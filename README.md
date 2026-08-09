# Chain Soundboard

A one-button soundboard that plays a disc golf chain noise. It's a static
site (no backend) deployed to Cloudflare Pages, and it registers a service
worker on first load so the app and sound keep working offline afterward —
handy on a course with no signal.

## Run locally

```
npm install
npm run dev
```

This uses `wrangler pages dev` to serve the site at `http://localhost:8788`.
You can also just open `index.html` in a browser for a quick check, but the
service worker needs to be served over `http(s)` (not `file://`) to register.

## Deploy to Cloudflare Pages

Option A — CLI, from your own machine:

```
npm install
npx wrangler login
npm run deploy
```

Option B — Git integration (recommended): push this repo to GitHub, then in
the Cloudflare dashboard create a Pages project connected to it. In
**Settings → Builds & deployments → Build configuration**, leave both the
**Build command** and **Deploy command** fields blank, and set the **Build
output directory** to `/` (the repo root). With both fields blank, Cloudflare
uses its classic direct-upload flow — it just uploads the static files,
without needing to authenticate a `wrangler` deploy inside the build.

(There's no `wrangler.toml` in this repo on purpose — its presence makes
Cloudflare's build system auto-run `wrangler deploy`/`wrangler pages deploy`
during the build, which needs Pages-Edit permissions that the build's
auto-injected API token doesn't carry. Local CLI deploys in Option A don't
hit that issue since `wrangler login` authenticates as you.)

## Offline support

- `sw.js` is a service worker that caches the HTML/CSS/JS, the icons, and
  `sounds/chain.ogg` on first visit.
- After that first load, the page (and the sound) works with no network
  connection — reload or reopen it in airplane mode to confirm.
- `manifest.webmanifest` makes it installable as a home-screen app on
  mobile/desktop for a fullscreen, app-like experience.
- Bumping `CACHE_NAME` in `sw.js` forces clients to fetch fresh assets on
  the next deploy (e.g. if you swap in a different sound file).

## Project structure

```
index.html              Soundboard UI
styles.css               Styling
app.js                    Playback + service worker registration
sw.js                     Offline caching (service worker)
manifest.webmanifest      PWA metadata / install prompt
sounds/chain.ogg          The chain sound
icons/                    App icons (192px, 512px)
_headers                  Cloudflare Pages cache-control rules
```
