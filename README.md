# Agatha Felix — Website (production)

One repository, one folder. `project/` holds the design-system source you edit.
`build.mjs` reads it and produces a self-contained `dist/`, which is published to
the **`gh-pages`** branch that GitHub Pages serves.

| Branch | Holds | You touch it? |
|---|---|---|
| `main` | the source: `project/`, the build scripts | **yes, this is where you work** |
| `gh-pages` | the built site | no, `npm run deploy` writes it |

`dist/` is a git worktree attached to `gh-pages`, so a build drops straight into
the branch that gets published. It is gitignored on `main` and never tracked there.

## What the build does

- **Pre-transpiles JSX → JS at build time** — no Babel in the browser.
- **Vendors React + ReactDOM _production_ builds** locally — no CDN dev build,
  no white-screen, fast first paint (the loader still shows briefly).
- **Copies all assets in** and rewrites every `../../` path → root-relative
  (`/assets/...`) so nothing depends on the design-system folder layout.
- **Clean URLs via folders** — `/produk-standar/`, `/produk-custom/` work on any
  static host with **zero server config**.
- **SEO** — per-page `<title>` + `<meta description>`, Open Graph + Twitter cards
  (nice WhatsApp/Instagram share previews), `robots.txt`, `sitemap.xml`.
- **GitHub Pages ready** — emits `.nojekyll` (so `_ds_bundle.js` isn't stripped)
  and `CNAME` (custom domain).

## Commands

```bash
npm install        # once
npm run build      # -> dist/
npm run preview    # build + serve at http://localhost:4173 (clean URLs work)
npm run serve      # serve existing dist/ without rebuilding
```

## Configuration

Edit the `SITE` object at the top of [`build.mjs`](build.mjs):

| Field        | Current value                  | Notes                                  |
|--------------|--------------------------------|----------------------------------------|
| `domain`     | `https://agatha-felix.com`     | canonical origin, used in meta/sitemap |
| `cname`      | `agatha-felix.com`             | written to `dist/CNAME`                |
| `ogImage`    | `/assets/hero-products.png`    | share preview (ideal 1200×630)         |
| `themeColor` | `#E8542D`                      | browser UI tint                        |

The WhatsApp number lives in **one place**: `WA_NUMBER` in
`project/ui_kits/website_v2/Shell.jsx`. Change it there and rebuild.

Google Ads conversion tracking lives in `SITE.googleAdsId` and
`SITE.waConversionLabel`. The build injects the gtag snippet into every
generated page, so it never has to be pasted in by hand.

## Hand-written pages (`project/static/`)

Everything under `project/static/` is copied into `dist/` verbatim. The Google
Ads landing page `/raporsekolah/` lives there: plain HTML on purpose, no React
and no shared shell, so it loads fast and can be iterated on separately.

> **Never edit a page directly inside `dist/`.** `cleanDist()` wipes `dist/` on
> every build, so a page that exists only there is destroyed by the next deploy.
> Put it in `project/static/` instead, and add it to `STATIC_PAGES` in
> `build.mjs` so it also lands in `sitemap.xml`.

### Media slots waiting on files

These render a designed placeholder until the file exists — nothing is ever
broken by a missing asset. **Drop the file in, then rebuild**, and the slot
switches itself on; the build checks which files are present and only wires up
those, so an empty slot costs no failed request at page load:

| Drop file at | Shows up as |
|---|---|
| `project/assets/testimoni/cikeas.mp4` | Instagram testimonial clip, homepage |
| `project/assets/testimoni/nurul-fikri.mp4` | Instagram testimonial clip, homepage |
| `project/static/raporsekolah/img/testi-cikeas.mp4` | same clip on `/raporsekolah/` |
| `project/static/raporsekolah/img/testi-nurulfikri.mp4` | same clip on `/raporsekolah/` |
| `project/static/raporsekolah/img/klien/<slug>.png` | school logo in the "Sudah dipercaya" row |

Clips should be short, **muted**, H.264 MP4, ideally under 2 MB — they autoplay
on loop in the viewport and pause when scrolled away.

School logos: PNG with a transparent background reads best, since they are shown
greyscale until hovered. Roughly square crops sit better in the row than very
wide ones (the row caps logo width at 150px). Use the exact filenames above —
the slug is what ties a file to its school. And make sure you have each school's
permission before publishing their logo.

## Deploy — GitHub Pages

The live site is the **`gh-pages`** branch. `main` is never published.

### Update the live site (the normal workflow)

Edit what you need under `project/`, then:

```bash
npm run deploy      # build + commit gh-pages + push
```

That is it. Live in about a minute at https://agatha-felix.com.

Commit your source changes on `main` separately, the way you would in any repo.
`npm run deploy` only touches `gh-pages`.

### If `dist/` is missing

`npm run deploy` recreates it automatically. To do it by hand:

```bash
git worktree add dist gh-pages
```

### One-time GitHub setup

1. Repo → **Settings → Pages** → **Source = Deploy from a branch**,
   **Branch = `gh-pages`**, folder **`/ (root)`** → Save.
2. **Custom domain** should auto-fill `agatha-felix.com` from the `CNAME` file
   the build writes. DNS lives at Hostinger:
   - `A` record `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record `www` → `IvanJo-Coding.github.io`
3. Enable **Enforce HTTPS** once the certificate is issued (a few minutes).

> Apex custom domain ⇒ served at root ⇒ the root-relative paths (`/assets/...`)
> are correct as-is, no extra config.

### Other hosts (the same `dist/` works everywhere)
- **Netlify / Vercel / Cloudflare Pages**: drag-and-drop the `dist/` folder.
- **cPanel / shared hosting**: upload the contents of `dist/` into `public_html`.

## ⚠️ Before you go live — content checklist

These are business decisions, not code blockers. The site is fully functional
with WhatsApp ordering as-is, but review:

- [ ] **Prices** still say "Chat untuk harga grosir" (intentional wholesale flow).
      Add a price list if you'd rather show numbers.
- [ ] **WhatsApp number** = `6282219472613`. Confirmed correct; change in
      `Shell.jsx` (`WA_NUMBER`) if it ever moves.
- [ ] **Forms / simulator** open a pre-filled WhatsApp chat (no backend). If you
      want submissions stored (e.g. Google Forms / Formspree / a CRM), that's a
      follow-up — say the word and I'll wire it.
- [ ] **OG share image** uses `hero-products.png`. For pixel-perfect previews,
      add a dedicated 1200×630 image and point `SITE.ogImage` at it.
- [ ] **Fonts** load from Google Fonts (Baloo 2 + Plus Jakarta Sans). Fine for
      production; self-host later if you want zero third-party requests.
