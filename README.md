# Inventory Tracker — Frontend

React + TypeScript admin UI for the [Inventory Tracker
API](https://github.com/HansNu/inventory-tracker) — browse, search, create,
edit and delete IT assets, categories and category groups, behind JWT login.

**API:** [Swagger](https://inventory-tracker-production-a38f.up.railway.app/swagger/index.html)

## Stack

React 19 · TypeScript · Vite · Ant Design · React Router · axios

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
```

By default it talks to a backend on `http://localhost:8080/api`. To point it
at the deployed API instead, create `.env` in the project root:

```
VITE_API_BASE_URL=https://your-api-host/api
```

Two things about that variable: the `VITE_` prefix is required or Vite strips
it out of the client bundle, and the value must include the scheme — without
`https://` the browser treats it as a relative path and resolves it against the
dev server.

Restart the dev server after changing it; `.env` is read once at startup.

If you point the frontend at a deployed API, that API's `FRONTEND_ORIGIN` has
to name this origin exactly, or the browser blocks every request on CORS.

## Structure

```
src/
  api/          axios calls, one module per resource
  context/      AuthContext — token + current user, persisted to localStorage
  components/   pages and forms
  models/       TypeScript shapes mirroring the API's JSON
  constants.ts  route paths and endpoint URLs
```

`api/axiosSetup.ts` installs two interceptors, imported once from `main.tsx`:
one attaches `Authorization: Bearer <token>` to every outgoing request, the
other catches `401`, clears the stored token and redirects to `/login`. Session
expiry is handled in one place rather than at every call site.

`protectedRoute.tsx` wraps the authenticated routes. It is a **convenience, not
a security control** — it hides UI, nothing more. Every real check lives in the
API's `AuthMiddleware` and `RoleMiddleware`; the admin-only delete is rejected
server-side whether or not the button renders.


