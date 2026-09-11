# Agatha Felix Design System

**Agatha Felix Stationery** — "Spesialist Product Custom Stationery." An Indonesian stationery **manufacturer (pabrik, bukan reseller)** specializing in plastic folders/maps: Clear Holder, Map L, Map Kancing (snap-button), Map Executive, and Business File. Two core customer segments:

1. **Education** — custom report-card covers (sampul rapor) and branded folders for schools, bimbel (tutoring centers), les privat, universities. MOQ from ~30 pcs (one class). This is the heart of the brand.
2. **Document-heavy professionals** — lawyers, notaris, pengacara, government, corporate procurement — custom-branded files for their practice.

Key facts used in copy: 20M+ units produced · 500+ institutions served · MOQ 100 pcs (custom print) / 30–40 pcs (school rapor) · lead time 5–14 working days · ships across Indonesia · WhatsApp +62 822-1947-2613 is THE conversion channel · Shopee store for retail · Mon–Sat 08.00–17.00 WIB.

## Sources

- Logo (full-color wordmark + clownfish mascot): `assets/logo-agatha-felix.png` (user upload)
- Website codebase: https://github.com/IvanJo-Coding/agathafelix-website (pages: `index.html`, `produk-standar.html`, `produk-custom.html`; images imported to `assets/`). Explore the repo for full page copy and structure.
- **Direction note from the owner:** the existing repo uses a dark "industrial" theme, but the requested direction is *"khas pendidikan untuk anak — playful and colorful, and a bit creative"*. This design system therefore defines a NEW playful, colorful identity derived from the rainbow logo, while reusing the repo's content, copy, and page structure.

## CONTENT FUNDAMENTALS

- **Language:** Bahasa Indonesia. Address the customer as **"Anda"** (capital A, respectful); the company is **"kami"**. Warm-professional, never stiff.
- **Tone:** confident factory-direct pitch, friendly and concrete. Sentences are short and benefit-led. Numbers are everywhere: "MOQ mulai 100 pcs", "5–14 hari kerja", "500+ institusi".
- **Signature claims (reuse verbatim):**
  - "Langsung dari Pabrik — Bukan Reseller"
  - "Tidak ada margin distributor atau reseller."
  - "Kenapa lebih murah? Karena Anda beli langsung dari pabriknya."
  - "Melayani dari 1 kelas hingga seluruh sekolah."
- **CTAs:** always WhatsApp-first, verb-led: "Minta Penawaran Gratis", "Chat WhatsApp Sekarang", "Konsultasi untuk Sekolah / Les", "Tanya Katalog & Harga". Secondary CTAs are quiet: "Lihat Produk ↓", "Kirim Email".
- **Casing:** Title Case for headings/buttons ("Pesan dalam 3 Langkah"); UPPERCASE only for tiny eyebrow labels.
- **Emoji:** sparingly, 0–1 per section, only in eyebrow labels/highlights (existing site uses 🏭 ✏️). Never in body copy or buttons.
- **Honorifics in testimonials:** "Bu Rahma Susanti — Kepala Sekolah", "Pak Andri Setiawan — Owner Bimbel". Always name + role + institution.

## VISUAL FOUNDATIONS

The identity is a **"sticker sheet on warm paper"**: candy-bright logo colors, chunky rounded shapes, flat offset shadows — playful like a school art class, but tidy enough for a notaris.

- **Color:** warm cream paper page (`--af-paper #FFF8EE`), white sticker cards, and the five logo colors — orange `#E8542D` (primary, the clownfish), green `#2BA84A`, yellow `#F5D920` (decorative only — never text; use `--af-yellow-deep #E3A812` for text/stars), purple `#5C3A9E`, sky blue `#38AEE8`. WhatsApp green `#25D366` is reserved exclusively for conversion CTAs. Rainbow order when cycling accents: orange → green → yellow → purple → blue (the logo's letter order). Each hue ships with `-deep` (edges/hover), `-soft` (chip fills), `-tint` (section washes).
- **Type:** `Baloo 2` for display (extra-bold 800, tight leading, slight negative tracking) — round and friendly like the logo letterforms; `Plus Jakarta Sans` for body (400/600/700). Hero ~54px, h2 ~31px, body 16px/1.7. One playful trick: highlight a key word in a heading with a brand color (like the multicolor logo) — max one colored word per heading.
- **Backgrounds:** flat cream; alternate sections use `--af-paper-2` or a color `-tint` wash. NO gradients, no photos-as-background, no textures. Decorative confetti dots / small rounded shapes in brand colors are the only ornament, used at low density near section headers.
- **Cards ("stickers"):** white, `--radius-md` 16–24px, either a hairline `--af-line` border + `--shadow-soft`, or for emphasis the **sticker treatment**: `2px solid var(--af-ink)` outline + flat offset shadow `--shadow-sticker` (0 3px 0 ink @16%). Featured cards get a colored 2px outline instead.
- **Buttons:** pill-shaped (`--radius-pill`), bold 700, solid fills with a **candy edge** — `box-shadow: 0 4px 0 var(--<color>-deep)`. Hover: lift 1px + brighten. **Press: translateY(3px) and shadow collapses to 1px** (the button physically pushes in). Ghost buttons: 2px ink border, transparent fill.
- **Hover states:** lift (translateY -2px) + `--shadow-pop`; borders tint toward the accent color. Never opacity fades on interactive elements.
- **Motion:** quick & springy — `--ease-pop` (overshoot) for entrances and hovers, 140–220ms. Reveal-on-scroll: fade + 18px rise. Counters animate. Respect `prefers-reduced-motion`.
- **Corners:** nothing sharp. Minimum 10px radius; images 24px; buttons/badges full pill.
- **Borders:** 1px warm hairline (`--af-line #EADFD2`) for quiet structure; 2px ink for sticker emphasis. No colored left-border-only cards.
- **Shadows:** flat offset "die-cut" shadows for stickers/buttons; soft warm ambient (`--shadow-soft`, brown-tinted, never gray-blue) for large panels. No inner shadows.
- **Imagery:** real product photos on white/transparent (see `assets/hero-products.png`), framed in 24px-radius white mats with sticker outlines. Warm color grade. No stocky office photos.
- **Transparency/blur:** sticky header only: `rgba(255,248,238,.92)` + `backdrop-filter: blur(12px)`. Nowhere else.
- **Layout:** 1180px container, 28px gutter, 96px section rhythm; fixed sticky header (66px) and a floating WhatsApp bubble bottom-right on every page.

## ICONOGRAPHY

- **Icon system:** [Lucide](https://lucide.dev) outline icons, 24px grid, `stroke-width: 2` (the existing site uses Heroicons-style inline strokes; Lucide matches the weight and is CDN-available). Load via `https://unpkg.com/lucide@latest` or copy individual SVGs. Icons inherit `currentColor`; sit them in `-soft` colored circles (40–48px, full radius) for feature lists.
- **WhatsApp glyph:** filled brand glyph, copied to `assets/icons/whatsapp.svg` — use it (white) inside every WA button and the floating bubble.
- **Mascot:** the clownfish from the logo is the only illustration. Use `assets/logo-agatha-felix.png` (full lockup) on light backgrounds, `assets/logo-mark-white.png` (white mark) on colored/dark surfaces. Never redraw it.
- **Emoji as icons:** no — emoji are copy seasoning only, never UI icons.
- **Unicode:** ★ for testimonial stars (color `--af-yellow-deep`), → / ↓ in text links. That's all.

## INDEX

| Path | What |
|---|---|
| `styles.css` | Global CSS entry — `@import`s everything below |
| `tokens/colors.css` | Brand palette + semantic aliases |
| `tokens/typography.css` | Font stacks, scale, weights, leading |
| `tokens/spacing.css` | Spacing, radii, sticker shadows, motion |
| `tokens/fonts.css` | Google Fonts import (SUBSTITUTE — see Caveats) |
| `tokens/base.css` | Body/heading element defaults |
| `assets/` | Logos, white mark, product hero photo, WhatsApp icon |
| `components/core/` | Button, Badge, Chip, Card |
| `components/forms/` | Input, Select, Textarea |
| `components/content/` | SectionHeader, Stat, Step, FAQItem, TestimonialCard, ProductCard |
| `ui_kits/website_v2/` | **Redesign penuh** (3 halaman, gaya berani, hero map interaktif, simulator rapor, portfolio & factory) |
| `assets/products/` | Real standard-product photos |
| `assets/portfolio/` | Real custom work for named clients (Penabur, Symphonia, PermataBank, Evergreen, Robotics) |
| `assets/factory/` | Real factory floor / press / warehouse photos |
| `reference/site/` | Imported original website HTML (dark theme — reference only) |
| `guidelines/` | Specimen cards shown in the Design System tab |
| `SKILL.md` | Agent-skill entry point for Claude Code |

## Caveats

- **Fonts are substitutions.** The logo lettering is custom/unidentified; no brand font files were provided. `Baloo 2` + `Plus Jakarta Sans` are the chosen Google Fonts matches. Supply real brand font files to replace `tokens/fonts.css` with `@font-face` rules.
- Real finished **rapor custom** photos are now in `assets/portfolio/` (Penabur jahit & cordura, Evergreen & SMPN 5 Bekasi press, Symphonia & PermataBank clear-holder, Robotics zipper bag), and **factory** shots in `assets/factory/`. Owner will supply more product photos later.
- Prices are gathered from the owner; catalogue cards currently say “Chat untuk harga grosir” as placeholder until a price list is supplied.
