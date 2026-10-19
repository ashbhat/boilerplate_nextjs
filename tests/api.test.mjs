import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

// Load Next's ESM route without changing the CommonJS project configuration.
const source = await readFile(new URL('../src/app/api/sample/route.js', import.meta.url), 'utf8');
const { GET, POST } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const post = (body) => new Request('http://localhost/api/sample', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
});

test('GET and POST forward to the fixed upstream and return uncached JSON', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://httpbin.org/anything');
    assert.equal(options.headers.Authorization, undefined);
    assert.equal(options.headers.Cookie, undefined);
    if (options.method === 'POST') assert.deepEqual(JSON.parse(options.body), { key: 'value' });
    return { ok: true, json: async () => ({ echoed: true }) };
  });
  for (const response of [await GET(), await POST(post('{"key":"value"}'))]) {
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.deepEqual(await response.json(), { echoed: true });
  }
});

test('POST rejects malformed JSON and non-object bodies before fetching', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => { throw new Error('Must not fetch'); });
  for (const body of ['', '{', 'null', '"text"', '[]']) {
    const response = await POST(post(body));
    assert.equal(response.status, 400);
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test('upstream HTTP, JSON, network and timeout failures return generic errors', async (t) => {
  for (const scenario of ['http', 'json', 'network', 'timeout']) {
    t.mock.method(globalThis, 'fetch', async () => {
      if (scenario === 'network') throw new Error('private upstream details');
      if (scenario === 'timeout') throw Object.assign(new Error('private'), { name: 'AbortError' });
      return { ok: scenario !== 'http', json: async () => { throw new Error('private JSON'); } };
    });
    for (const response of [await GET(), await POST(post('{}'))]) {
      assert.equal(response.status, scenario === 'timeout' ? 504 : 502);
      assert.equal((await response.text()).includes('private'), false);
    }
    t.mock.restoreAll();
  }
});
