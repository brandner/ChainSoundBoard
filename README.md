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

Option B — Git integration: push this repo to GitHub, then in the Cloudflare
dashboard create a Pages project connected to it. This account's Pages
projects run on Cloudflare's **Workers Builds** CI, which always requires a
deploy command (it can't be left blank) and always authenticates via an API
token — so in **Settings → Builds & deployments → Build configuration**:

- **Build command**: leave blank
- **Build output directory**: `/` (the repo root)
- **Deploy command**: `npx wrangler pages deploy .`

That deploy command needs a `CLOUDFLARE_API_TOKEN` environment variable
(**Settings → Environment variables**) set to a token that has the
**Account → Cloudflare Pages → Edit** permission. Having Super Administrator
account access is not the same thing — a token can be scoped narrower than
the account role that created it, and the Pages-Edit permission specifically
is what this deploy command calls. Create/edit the token at
https://dash.cloudflare.com/profile/api-tokens, then set it as
`CLOUDFLARE_API_TOKEN` on the Pages project.

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
wrangler.toml             Cloudflare Pages project name / output dir
```
