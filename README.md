# Chain Soundboard

A one-button soundboard that plays a disc golf chain noise. It's a static
site (no server-side code) deployed as a Cloudflare **Worker with static
assets**, and it registers a service worker on first load so the app and
sound keep working offline afterward — handy on a course with no signal.

## Run locally

```
npm install
npm run dev
```

This uses `wrangler dev` to serve the site at `http://localhost:8787`. You
can also just open `index.html` in a browser for a quick check, but the
service worker needs to be served over `http(s)` (not `file://`) to
register.

## Deploy to Cloudflare

This project deploys through `wrangler.toml`'s `[assets]` config as a
Worker (Cloudflare's current recommended path for static sites, distinct
from the older "Pages" product). `wrangler.toml`'s `name` must match the
project's slug in the dashboard.

Option A — CLI, from your own machine:

```
npm install
npx wrangler login
npm run deploy
```

Option B — Git integration: push this repo to GitHub, then connect it under
**Workers & Pages** in the Cloudflare dashboard. In **Settings → Builds &
deployments → Build configuration**:

- **Build command**: leave blank
- **Deploy command**: `npx wrangler deploy`

That deploy command needs a `CLOUDFLARE_API_TOKEN` environment variable
(**Settings → Environment variables**) set to a token with **Account →
Workers Scripts → Edit** permission — create/edit one at
https://dash.cloudflare.com/profile/api-tokens. Having account-owner access
isn't the same thing; a token can be scoped narrower than the account it
belongs to.

`.assetsignore` (gitignore-style syntax) keeps non-site files — `node_modules`
installed by the build, `wrangler.toml`, `README.md` — out of the deployed
asset bundle, since `[assets] directory` in `wrangler.toml` points at the
repo root.

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
_headers                  Cloudflare cache-control rules
.assetsignore             Files excluded from the deployed asset bundle
wrangler.toml             Cloudflare Worker project name / assets config
```
