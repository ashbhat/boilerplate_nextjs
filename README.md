### Context
This is a small Next.js App Router boilerplate.

### Development

```bash
npm install
npm run dev
```

Use Node.js 20.9 or newer. Run `npm test`, `npm run lint`, and `npm run build`
to validate changes. `npm start` serves the production build.

### Project structure

```text
src/app/
  layout.js                 Global styles, document layout, and metadata
  page.js                   Home screen
  styles.module.css         Home-screen styles
  _0Sidebar/index.jsx       Optional sidebar component
  _1Content/index.jsx       Optional content component
  api/sample/route.js       Server-side GET and POST handlers
```

Colocate components with the routes that own them. Numbered private component
folders can contain further numbered components at any depth. Numbers organize
folders; JSX controls rendering order. Add styles, hooks, and tests alongside
their owning component when needed. Move reused components into the nearest
common `_components/` folder. The sidebar and content are optional structural
examples; the default page still displays Hello World.

`AGENTS.md` documents the coding conventions. `CLAUDE.md` imports that same file.

### API requests

Client components call `/api/sample` directly from an event handler or effect:

```javascript
const response = await fetch('/api/sample');
if (!response.ok) throw new Error(`Request failed (${response.status})`);
const data = await response.json();
```

For POST, pass `method: 'POST'`, a `Content-Type: application/json` header, and
`body: JSON.stringify({ key: 'value' })`. Components with event handlers or effects
need `"use client"` at the top of their file. There is no global browser API wrapper.

The route in `src/app/api/sample/route.js` calls httpbin on the server. DevTools
shows `/api/sample` and its response, not a browser request to httpbin. Keep private
keys in server environment variables without a `NEXT_PUBLIC_` prefix. The demo
returns httpbin's echo response: never add secret headers to that request, since
they would be echoed back to the browser.

The sample endpoint is public; add authorization and application-specific
validation when adapting it for private data. API routes require a Next.js server
or compatible hosting, rather than a static-only export.

### Comments
Reach out to me@ashbhat.com with any comments about this boilerplate.
