# Spanish Real Estate Chatbot Widget

This repository contains two deliverables:

1. **`server/`** – a lightweight Express proxy that forwards chat messages to your configured n8n webhook (`/api/chat`).
2. **`widget/`** – a reusable vanilla JavaScript chat widget that can be embedded on any website with a `<script>` tag and a simple `ChatWidget.init` call.

## Getting started

> **Prerequisites**
>
> - Node.js 18+
> - npm 9+

Install dependencies for all workspaces:

```bash
npm install
```

> If your network blocks access to npm, you can install each workspace manually inside `server/` and `widget/` using any registry mirror that exposes the same packages.

### Running the proxy server

Create a `.env` file or export the `N8N_WEBHOOK_URL` environment variable before starting the server.

```bash
export N8N_WEBHOOK_URL="https://chrisscholte.app.n8n.cloud/webhook/spanish-re-custom%20bot"
npm run dev:server
```

This boots an Express app on `http://localhost:3001` with the `/api/chat` endpoint. Use `npm run build:server` to emit compiled JavaScript into `server/dist` and `npm --workspace server start` to serve the production build.

Run the server tests (Vitest + Supertest):

```bash
npm run test:server
```

### Building the chat widget bundle

```bash
npm run build:widget
```

The build outputs `widget/dist/chat-widget.js` (IIFE bundle that registers `window.ChatWidget`) and `widget/dist/chat-widget.css`.

Embed the widget anywhere:

```html
<link rel="stylesheet" href="/path/to/chat-widget.css" />
<script src="/path/to/chat-widget.js"></script>
<script>
  ChatWidget.init({
    apiUrl: 'https://yourdomain.com/api/chat',
    agencyName: 'Spanish Real Estate',
    agencyLogoUrl: 'https://example.com/logo.png',
    primaryColor: '#2C5C94',
    accentColor: '#4D7DC0',
    bubbleColorUser: '#E6F0FF',
    bubbleColorBot: '#F6F7FB',
    languageFallback: 'en',
    position: 'bottom-right',
    clientId: 'spanish-real-estate-01',
  });
</script>
```

### Project structure

```
server/
  src/
    config.ts
    routes/chat.ts
    services/n8nClient.ts
    server.ts
    types/chat.ts
  tests/chat.test.ts
widget/
  src/index.ts
  src/chat-widget.css
  scripts/build-widget.mjs
```

Feel free to adjust request/response types inside `server/src/types/chat.ts` and enhance the UI copy or styling via the CSS file.
