
export async function sampleGet(callback, error) {
    fetch("https://httpbin.org/anything")
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        console.log("hit an error")
        throw new Error('Something went wrong ...')
      }
    })
    .then(data => {
      callback(data, null)
    })
    .catch(error => {
        callback(null, error)
    })
}

export async function samplePOST(callback, error) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "key": "value"
    }),
  }

  fetch("https://httpbin.org/anything", options)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Something went wrong ...')
      }
    })
    .then(data => {
      callback(data, null)
    })
    .catch(null, error)
}