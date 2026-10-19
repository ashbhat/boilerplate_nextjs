// External requests belong in server routes, not browser API helpers.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (req.method === 'POST' &&
      (!req.body || typeof req.body !== 'object' || Array.isArray(req.body))) {
    return res.status(400).json({ error: 'Expected a JSON object' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const upstream = await fetch('https://httpbin.org/anything', {
      method: req.method,
      headers: {
        Accept: 'application/json',
        ...(req.method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(req.method === 'POST' ? { body: JSON.stringify(req.body) } : {}),
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!upstream.ok) {
      return res.status(502).json({ error: 'Upstream request failed' });
    }
    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (error) {
    const timedOut = controller.signal.aborted || error.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'Upstream request timed out' : 'Upstream request failed',
    });
  } finally {
    clearTimeout(timeout);
  }
}
