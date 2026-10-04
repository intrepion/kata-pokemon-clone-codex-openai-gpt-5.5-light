# Briarbrook League

Briarbrook League is an original top-down creature-catching browser RPG inspired by the early Pokemon first-route and first-badge loop.

## Development

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173/dev.html` during development.

## Direct File Play

The root `index.html` is the double-click entrypoint. Regenerate its local assets before publishing:

```sh
npm run build:file
```

Then open `index.html` directly in a browser.

## Verification

```sh
npm run typecheck
npm test
npm run build
npm run build:file
npm run test:browser
```

Or run the full local gate:

```sh
npm run check
```
