### Context
This is the front end to get started quickly with NextJS.


### Comments
reach out to me@ashbhat.com with any comments about this boilerplate.

### API requests
Browser helpers in `src/api/api.js` call `/api/sample`. The Next.js server handler
in `src/pages/api/sample.js` makes the GET or POST request to httpbin. Follow this
pattern for new APIs: keep external requests in `src/pages/api/` and call those
routes from frontend helpers.

Call a helper from a browser event handler or `componentDidMount`:

```javascript
import { sampleGet, samplePOST } from "@/api/api";

sampleGet((data, error) => {
  if (error) {
    console.error(error.message);
    return;
  }
  console.log(data);
});
// samplePOST uses the same callback and sends { key: "value" }.
```

DevTools shows `/api/sample`, including its request and response. The external
httpbin request runs on the server. Keep private keys in server environment
variables, without a `NEXT_PUBLIC_` prefix, and never return them to the browser.
The demo returns httpbin's echo response; do not add secret headers to that echo
request, since httpbin includes them in its response.

The sample endpoint is public and accepts GET and POST. Add authentication and
request validation appropriate to your app when adapting it for private data.
This requires a Next.js server or a hosting platform that supports API routes;
it does not work with a static-only export.

Run `npm test` for API tests, `npm run lint` for lint checks, and `npm run build`
to check the production build.
