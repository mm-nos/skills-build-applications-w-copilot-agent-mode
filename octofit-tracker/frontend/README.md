# Octofit Tracker Frontend

React 19 + Vite presentation tier for Octofit Tracker.

## Environment

Define `VITE_CODESPACE_NAME` so the app can call the forwarded backend API:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

For local development, place it in `.env.local`. When set, API requests use:

```text
https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

If `VITE_CODESPACE_NAME` is unset, the app falls back to `http://localhost:8000/api` to avoid constructing invalid `undefined-8000` URLs.
