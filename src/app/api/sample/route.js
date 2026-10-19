// Keep external requests on the server, including any future private credentials.
export const dynamic = 'force-dynamic';

function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET() {
  return requestUpstream('GET');
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Expected valid JSON' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'Expected a JSON object' }, 400);
  }
  return requestUpstream('POST', body);
}

async function requestUpstream(method, body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const upstream = await fetch('https://httpbin.org/anything', {
      method: method,
      headers: {
        Accept: 'application/json',
        ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!upstream.ok) {
      return json({ error: 'Upstream request failed' }, 502);
    }
    const data = await upstream.json();
    return json(data);
  } catch (error) {
    const timedOut = controller.signal.aborted || error.name === 'AbortError';
    return json({
      error: timedOut ? 'Upstream request timed out' : 'Upstream request failed',
    }, timedOut ? 504 : 502);
  } finally {
    clearTimeout(timeout);
  }
}
