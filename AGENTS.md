# Coding guidance

For framework behavior, consult the version-matched Next.js documentation in
`node_modules/next/dist/docs/` after installing dependencies.

## Routes and components

- Use the Next.js App Router under `src/app/`. Use `page.js` for pages,
  `layout.js` for layouts, and `route.js` for API endpoints. Do not add a
  `src/pages/` tree or use `next/head`; use the App Router metadata API.
- Colocate route-specific UI with its route. For example, settings components
  belong under `src/app/settings/`, not in a global components directory.
- Organize screen sections as numbered, underscore-prefixed folders such as
  `_0Sidebar` and `_1Content`. Each exposes a function component in `index.jsx`.
  Component names omit the number and underscore: `Sidebar`, `Content`.
- Numbers are stable organizational identifiers, not rendering order. Restart
  numbering within each parent, allow gaps, and do not renumber existing folders
  just because the UI order changes. JSX determines rendering order.
- Nested components follow the same convention at any depth. Nest when a
  component belongs exclusively to its parent, not for every HTML wrapper.
- Keep `page.js` and `layout.js` focused on composing the screen. Keep state at
  the lowest common owner that needs it.
- Colocate styles (`styles.module.css`), tests, and component-specific hooks with
  their owner. Add supporting files only when needed; do not create empty files.
- Keep private components local until reuse is needed. Move shared components
  into the nearest common `_components/` directory and use unnumbered descriptive
  names there. Do not import another section's private children directly.
- Keep URL folders unnumbered (`settings/`, `api/sample/`). Underscore folders
  are excluded from routing; this does not make their contents confidential.
- Use Server Components by default. Add `"use client"` at the smallest practical
  boundary needing state, effects, event handlers, or browser APIs. Avoid class
  components and unnecessary client boundaries.

## API requests

- Implement browser-facing endpoints in `src/app/api/<name>/route.js` with named
  HTTP method exports such as `GET` and `POST`.
- Browser interactions call same-origin `/api/...` endpoints directly. Do not
  recreate a global `src/api/api.js` wrapper. Extract a colocated helper or hook
  only when a feature needs it.
- Keep external service calls and secrets on the server. Server Components can
  call server-side data functions directly rather than making HTTP requests to
  the application's own routes. Never import server-only code into client code.
- Validate request bodies, handle upstream failures, and bound external requests
  with timeouts. Choose caching explicitly; the sample API is uncached.
- Never commit or log secrets, expose them via `NEXT_PUBLIC_` variables, or return
  them in responses. The sample httpbin endpoint echoes headers: do not send it
  secret headers and then return that response to the browser.
- Server-side routing is not authentication. Add appropriate authorization when
  implementing endpoints that access private data.

## Validation and scope

- Install dependencies with `npm install`; start development with `npm run dev`.
- Run `npm test`, `npm run lint`, and `npm run build` for relevant code changes.
  API unit tests use Node's test runner; no external service is needed.
- Test API changes through the running Next.js server as appropriate, including
  errors and unsupported methods. Report any live checks that were not run.
- Preserve the existing UI unless a visual change is requested. The sidebar and
  content modules are optional examples and are not rendered by default.
- Keep changes focused; do not add empty scaffolding or dependencies without a
  concrete need. Update README examples when conventions or commands change.
