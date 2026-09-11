# Website v2 — Redesign Penuh (Juni 2026)

New from-scratch website design (NOT a re-skin of the GitHub site). Direction per owner: **sangat berani** — kid-brand energy, full color, big shapes — education-first, professionals secondary. Fresh playful copy. Three pages mirroring the original site map:

- `index.html` — homepage (clean URL). Hero = **map raksasa interaktif** (CSS-built giant Map Kancing; colorful documents slide INTO it, replay on hover/click), marquee strip, product teasers, school focus, factory band, steps, testimonials, FAQ, CTA.
- `produk-standar.html` — playful catalogue with audience filter chips.
- `produk-custom.html` — school/rapor pitch + **Simulator Rapor** (pick cover color, accent, school name, upload logo → live mockup) + **portfolio** of real client work + professional (notaris/lawyer) section using the real Document Keeper photo.

Every page shows a branded **loading splash** (bouncing clownfish favicon + rainbow dots) until React mounts, sets a **favicon** (`assets/favicon.png`), and uses a short tab title (home = “Agatha Felix”). File names are clean slugs so deployed URLs read `/produk-standar` etc.

Shared: `Shell.jsx` (chunky header with **mobile hamburger menu**, footer, floating WA, wave dividers, confetti, and a centralized **responsive CSS layer** — hero/2-col sections stack at ≤900px, product grids drop to 2 then 1 column, footer collapses, giant map & rapor stack scale down, nav swaps to a hamburger at ≤680px). All tokens from `../../styles.css`; components from the compiled bundle where they fit. The older `ui_kits/website/` kit (re-skin of the GitHub structure) is kept for comparison.
