// Browser helpers call our Next.js API; external URLs and credentials stay server-side.
async function request(options, callback, onError) {
  let data;
  try {
    const response = await fetch('/api/sample', options);
    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }
    data = await response.json();
  } catch (error) {
    if (typeof onError === 'function') {
      onError(error);
    } else {
      callback(null, error);
    }
    return;
  }
  callback(data, null);
}

export function sampleGet(callback, onError) {
  return request({ method: 'GET' }, callback, onError);
}

export function samplePOST(callback, onError) {
  return request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' }),
  }, callback, onError);
}
