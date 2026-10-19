import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

// Next compiles these ESM .js files; data imports also let Node test them without
// changing the project's CommonJS configuration or adding a test framework.
async function load(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}
const client = await load('../src/api/api.js');
const { default: handler } = await load('../src/pages/api/sample.js');
function response() {
  return {
    headers: {}, statusCode: 200,
    setHeader(key, value) { this.headers[key] = value; },
    status(value) { this.statusCode = value; return this; },
    json(value) { this.body = value; return this; },
  };
}

test('client GET and POST call only the local API and deliver callback results', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ result: 'ok' }) };
  });
  for (const method of [client.sampleGet, client.samplePOST]) {
    let received;
    await method((data, error) => { received = { data, error }; });
    assert.deepEqual(received, { data: { result: 'ok' }, error: null });
  }
  assert.deepEqual(calls.map(call => call.url), ['/api/sample', '/api/sample']);
  assert.equal(calls[1].options.method, 'POST');
  assert.deepEqual(JSON.parse(calls[1].options.body), { key: 'value' });
});

test('client delivers HTTP and network failures to the callback', async (t) => {
  for (const fails of [false, true]) {
    t.mock.method(globalThis, 'fetch', async () => {
      if (fails) throw new Error('Network failed');
      return { ok: false, status: 502 };
    });
    for (const method of [client.sampleGet, client.samplePOST]) {
      let received;
      await method((data, error) => { received = { data, error }; });
      assert.equal(received.data, null);
      assert.ok(received.error instanceof Error);
    }
    t.mock.restoreAll();
  }
});

test('server forwards GET and POST to fixed upstream without browser credentials', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://httpbin.org/anything');
    assert.equal(options.headers.Authorization, undefined);
    assert.equal(options.headers.Cookie, undefined);
    if (options.method === 'POST') assert.deepEqual(JSON.parse(options.body), { key: 'value' });
    return { ok: true, json: async () => ({ echoed: true }) };
  });
  for (const method of ['GET', 'POST']) {
    const res = response();
    await handler({ method, body: { key: 'value' }, headers: { authorization: 'private', cookie: 'private' } }, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { echoed: true });
  }
});

test('server rejects unsupported methods and invalid POST bodies without fetching', async (t) => {
  t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not fetch'); });
  const res = response();
  await handler({ method: 'DELETE' }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, 'GET, POST');
  for (const body of [undefined, null, 'text', []]) {
    const res = response();
    await handler({ method: 'POST', body }, res);
    assert.equal(res.statusCode, 400);
  }
});

test('server returns generic errors for upstream failures, invalid JSON and timeouts', async (t) => {
  for (const scenario of ['http', 'json', 'network', 'timeout']) {
    t.mock.method(globalThis, 'fetch', async () => {
      if (scenario === 'network') throw new Error('private upstream details');
      if (scenario === 'timeout') throw Object.assign(new Error('private'), { name: 'AbortError' });
      return { ok: scenario !== 'http', json: async () => { throw new Error('private JSON'); } };
    });
    const res = response();
    await handler({ method: 'GET' }, res);
    assert.equal(res.statusCode, scenario === 'timeout' ? 504 : 502);
    assert.equal(JSON.stringify(res.body).includes('private'), false);
    t.mock.restoreAll();
  }
});
