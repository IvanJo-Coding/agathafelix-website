// ============================================================================
// Agatha Felix — static site builder
// ----------------------------------------------------------------------------
// Reads the "Website v2" UI kit from the design system (../project) and emits a
// fully self-contained, deployable `dist/` folder:
//   - JSX is transpiled to plain JS at BUILD time (no Babel in the browser)
//   - React/ReactDOM are vendored as PRODUCTION builds (no CDN dev build)
//   - all ../../ asset paths are rewritten to root-relative (/assets/...)
//   - clean URLs via folders (/produk-standar/, /produk-custom/)
//   - SEO: per-page <meta>, Open Graph, Twitter cards, robots.txt, sitemap.xml
//   - GitHub Pages: .nojekyll (keep _ds_bundle.js) + CNAME (custom domain)
// ============================================================================

import esbuild from 'esbuild';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;                              // repo root
const SRC = path.resolve(ROOT, 'project');           // design system source
const KIT = path.join(SRC, 'ui_kits/website_v2');    // the website kit
const DIST = path.join(ROOT, 'dist');

// ---------------------------------------------------------------------------
//  EDIT ME — site-wide config
// ---------------------------------------------------------------------------
const SITE = {
  domain: 'https://agatha-felix.com',  // canonical origin, NO trailing slash
  cname: 'agatha-felix.com',           // GitHub Pages custom domain (CNAME file)
  brand: 'Agatha Felix',
  legalName: 'Agatha Felix Stationery',
  locale: 'id_ID',
  themeColor: '#E8542D',               // af-orange
  ogImage: '/assets/hero-products.png',// social share preview (≈1200×630 ideal)
  logo: '/assets/logo-agatha-felix.png',
  whatsapp: '6282219472613',           // also the single source in Shell.jsx
  // Local SEO (Google Business Profile + LocalBusiness schema)
  city: 'Kota Bekasi',
  region: 'Jawa Barat',
  country: 'ID',
  sameAs: ['https://www.instagram.com/agathafelix_indonesia/'],
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '17:00' },
  minify: true,
  // Google Ads conversion tracking, injected into every generated page.
  googleAdsId: 'AW-18374325686',
  waConversionLabel: 'AW-18374325686/elV-CN2Bhe4cELbrx7lE',
};

// ---------------------------------------------------------------------------
//  Hand-written pages that are NOT generated from the JSX kit
// ---------------------------------------------------------------------------
// Everything under project/static/ is copied into dist/ verbatim. Ad landing
// pages live there: plain HTML on purpose (no React, no shared shell) so they
// load fast and can be iterated on independently of the main site.
//
// They MUST live in the source tree: cleanDist() wipes dist/ on every build, so
// a page that exists only in dist/ is destroyed by the next deploy.
const STATIC_PAGES = [
  { canonical: '/raporsekolah/', inSitemap: true },
];

// ---------------------------------------------------------------------------
//  Per-page definitions (mirrors the original *.html glue scripts)
// ---------------------------------------------------------------------------
const PAGES = [
  {
    out: 'index.html',
    canonical: '/',
    title: 'Pabrik Map Plastik & Custom Rapor Sekolah | Agatha Felix',
    description:
      'Agatha Felix — pabrik map plastik & custom rapor sekolah langsung dari produksi, ' +
      'bukan reseller. Clear holder, map kancing, business file, rapor custom logo. Chat WhatsApp untuk harga grosir.',
    sections: ['Shell', 'HeroMap', 'Portfolio', 'BerandaSections'],
    glue: `
      function BerandaPage() {
        return (
          <div data-screen-label="Beranda">
            <window.HeaderV2 active="/" />
            <main>
              <window.HeroV2 />
              <window.MarqueeV2 />
              <window.ProdukTeaserV2 />
              <window.SekolahV2 />
              <window.FactoryBand />
              <window.CaraPesanV2 />
              <window.TestimoniV2 />
              <window.FAQV2 />
              <window.CTAV2 />
            </main>
            <window.FooterV2 />
            <window.FloatingWAV2 />
          </div>
        );
      }
      ReactDOM.createRoot(document.getElementById('root')).render(<BerandaPage/>);
    `,
  },
  {
    out: 'produk-standar/index.html',
    canonical: '/produk-standar/',
    title: 'Jual Map Plastik Grosir — Katalog Siap Kirim | Agatha Felix',
    description:
      'Jual map plastik grosir langsung dari pabrik: clear holder, map kancing, business file, ' +
      'map L, map executive, carry file, expanding file, zipper bag. Beli per lusin atau grosir, siap kirim.',
    sections: ['Shell', 'ProdukStandarSections'],
    glue: `ReactDOM.createRoot(document.getElementById('root')).render(<window.ProdukStandarPage/>);`,
  },
  {
    out: 'produk-custom/index.html',
    canonical: '/produk-custom/',
    title: 'Custom Rapor Sekolah & Map Cetak Logo | Agatha Felix',
    description:
      'Custom rapor sekolah dengan logo & warna sekolahmu, plus map cetak logo untuk les, kantor & instansi. ' +
      'Coba simulator rapor interaktif. Desain dibantu gratis, mulai 30 pcs.',
    sections: ['Shell', 'Simulator', 'Portfolio', 'ProdukCustomSections'],
    glue: `ReactDOM.createRoot(document.getElementById('root')).render(<window.ProdukCustomPage/>);`,
  },
];

// All section modules referenced by any page (deduped, transpiled once each).
const ALL_SECTIONS = [...new Set(PAGES.flatMap((p) => p.sections))];

// ---------------------------------------------------------------------------
//  Path rewriting: kit-relative -> root-relative + clean URLs
// ---------------------------------------------------------------------------
function rewriteAssets(code) {
  // ../../assets/x  ->  /assets/x   (kit lived two levels deep in the DS)
  return code.split('../../').join('/');
}
function rewriteLinks(code) {
  // internal page links -> clean URLs (order matters: specific first)
  return code
    .split('produk-standar.html').join('/produk-standar/')
    .split('produk-custom.html').join('/produk-custom/')
    .split('index.html').join('/');
}

// ---------------------------------------------------------------------------
//  Transpile JSX (classic runtime -> global React.createElement)
// ---------------------------------------------------------------------------
async function transpileSource(code) {
  const out = await esbuild.transform(code, {
    loader: 'jsx',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: 'es2018',
    minify: SITE.minify,
    legalComments: 'none',
  });
  // Wrap each file in an IIFE so top-level const/function names stay file-local.
  // (These load as separate classic <script>s sharing one global lexical scope;
  //  cross-file communication happens only through window.*, never top-level names.)
  const body = rewriteLinks(rewriteAssets(out.code));
  return `(function(){\n${body}\n})();\n`;
}

// ---------------------------------------------------------------------------
//  Loader markup + styles (lifted verbatim from the original kit)
// ---------------------------------------------------------------------------
const LOADER_STYLE = `
  html { scroll-behavior: smooth; }
  #af-loader { position: fixed; inset: 0; z-index: 9999; background: var(--af-paper, #FFF8EE); display: flex; align-items: center; justify-content: center; transition: opacity .45s ease; }
  #af-loader.af-hide { opacity: 0; pointer-events: none; }
  .af-loader-box { display: flex; flex-direction: column; align-items: center; gap: 18px; }
  .af-loader-fish { width: 88px; height: 88px; object-fit: contain; animation: af-bob 1s cubic-bezier(.34,1.56,.64,1) infinite; }
  @keyframes af-bob { 0%,100% { transform: translateY(0) rotate(-7deg); } 50% { transform: translateY(-16px) rotate(7deg); } }
  .af-loader-dots { display: flex; gap: 9px; }
  .af-loader-dots span { width: 13px; height: 13px; border-radius: 50%; border: 2px solid var(--af-ink, #2B2A28); animation: af-pulse 1s ease infinite; }
  .af-loader-dots span:nth-child(1){ background: var(--af-orange, #E8542D); animation-delay: 0s; }
  .af-loader-dots span:nth-child(2){ background: var(--af-green, #2BA84A); animation-delay: .1s; }
  .af-loader-dots span:nth-child(3){ background: var(--af-yellow, #F5D920); animation-delay: .2s; }
  .af-loader-dots span:nth-child(4){ background: var(--af-purple, #5C3A9E); animation-delay: .3s; }
  .af-loader-dots span:nth-child(5){ background: var(--af-blue, #38AEE8); animation-delay: .4s; }
  @keyframes af-pulse { 0%,100% { transform: scale(.55); opacity: .5; } 50% { transform: scale(1.1); opacity: 1; } }
  .af-loader-text { font-family: var(--font-display, sans-serif); font-weight: 800; color: var(--af-ink, #2B2A28); font-size: 15px; }
  @media (prefers-reduced-motion: reduce) { .af-loader-fish, .af-loader-dots span { animation: none; } }`;

const LOADER_MARKUP = `<div id="af-loader" aria-hidden="true">
  <div class="af-loader-box">
    <img src="/assets/favicon.png" alt="" class="af-loader-fish"/>
    <div class="af-loader-dots"><span></span><span></span><span></span><span></span><span></span></div>
    <div class="af-loader-text">Memuat keceriaan…</div>
  </div>
</div>
<script>
(function () {
  function hide() {
    var l = document.getElementById('af-loader');
    if (l && !l.classList.contains('af-hide')) {
      l.classList.add('af-hide');
      setTimeout(function () { if (l.parentNode) l.parentNode.removeChild(l); }, 600);
    }
  }
  var t = setInterval(function () {
    var r = document.getElementById('root');
    if (r && r.children.length) { clearInterval(t); setTimeout(hide, 280); }
  }, 80);
  setTimeout(function () { clearInterval(t); hide(); }, 6000);
})();
</script>`;

// ---------------------------------------------------------------------------
//  Google Ads tag (gtag.js)
// ---------------------------------------------------------------------------
const GTAG_HEAD = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.googleAdsId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${SITE.googleAdsId}');
</script>`;

// Every WhatsApp link is a conversion. Delegated from document so it also covers
// the links React mounts after this script has already run.
const GTAG_WA_CLICK = `<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
  if (!a) return;
  gtag('event', 'conversion', {
    'send_to': '${SITE.waConversionLabel}'
  });
});
</script>`;

// ---------------------------------------------------------------------------
//  HTML document template (with SEO + Open Graph)
// ---------------------------------------------------------------------------
// Read PNG/JPEG pixel dimensions so og:image hints are always truthful.
async function imageSize(absPath) {
  try {
    const b = await fs.readFile(absPath);
    if (b.slice(1, 4).toString() === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    if (b[0] === 0xff && b[1] === 0xd8) { // JPEG: scan SOF markers
      let o = 2;
      while (o < b.length) {
        if (b[o] !== 0xff) { o++; continue; }
        const m = b[o + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
          return { h: b.readUInt16BE(o + 5), w: b.readUInt16BE(o + 7) };
        o += 2 + b.readUInt16BE(o + 2);
      }
    }
  } catch {}
  return null;
}

// ---------------------------------------------------------------------------
//  Structured data (JSON-LD) for rich results + entity understanding
// ---------------------------------------------------------------------------
// FAQ copy MUST match what's visible in FAQV2 (BerandaSections.jsx) — Google
// requires FAQPage schema to mirror on-page content.
const FAQ_ITEMS = [
  ['Minimal pesan berapa, sih?', 'Custom print mulai 100 pcs. Khusus rapor sekolah & tempat les bisa mulai 30–40 pcs — cukup untuk satu kelas.'],
  ['Berapa lama jadinya?', '5–14 hari kerja setelah desain kamu setujui, tergantung jumlah dan tingkat kerumitan.'],
  ['Aku nggak bisa desain. Gimana dong?', 'Tenang! Kirim logo dan warna kesukaanmu, tim kami yang buatkan mockup — gratis, revisi sampai cocok.'],
  ['Kirim ke luar pulau bisa?', 'Bisa! Kami kirim ke seluruh Indonesia via ekspedisi. Ongkir dihitung transparan saat penawaran.'],
];

function organizationSchema() {
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': SITE.domain + '/#organization',
    name: SITE.legalName,
    alternateName: SITE.brand,
    url: SITE.domain + '/',
    logo: SITE.domain + SITE.logo,
    image: SITE.domain + SITE.ogImage,
    description: 'Pabrik map plastik & custom rapor sekolah langsung dari produksi — clear holder, map kancing, business file, hingga rapor custom logo sekolah.',
    telephone: '+' + SITE.whatsapp,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: SITE.country,
    },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
    sameAs: SITE.sameAs,
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SITE.openingHours.days,
      opens: SITE.openingHours.opens, closes: SITE.openingHours.closes,
    }],
    contactPoint: {
      '@type': 'ContactPoint', contactType: 'sales',
      telephone: '+' + SITE.whatsapp, availableLanguage: ['id'],
    },
  };
}

function jsonLdFor(page) {
  const blocks = [{ '@context': 'https://schema.org', ...organizationSchema() }];
  if (page.canonical === '/') {
    blocks.push({
      '@context': 'https://schema.org', '@type': 'WebSite', '@id': SITE.domain + '/#website',
      url: SITE.domain + '/', name: SITE.brand,
      publisher: { '@id': SITE.domain + '/#organization' }, inLanguage: 'id-ID',
    });
    blocks.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map(([q, a]) => ({
        '@type': 'Question', name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  } else {
    const crumb = { '/produk-standar/': 'Produk Standar', '/produk-custom/': 'Custom Rapor Sekolah' }[page.canonical] || page.title;
    blocks.push({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE.domain + '/' },
        { '@type': 'ListItem', position: 2, name: crumb, item: SITE.domain + page.canonical },
      ],
    });
  }
  return blocks;
}

function ldScript(obj) {
  // escape "<" so a stray "</script>" in data can never break out of the tag
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
}

function pageHtml(page, ogDim, mediaManifest = []) {
  const url = SITE.domain + page.canonical;
  const ogImage = SITE.domain + SITE.ogImage;
  const scripts = [
    '/vendor/react.production.min.js',
    '/vendor/react-dom.production.min.js',
    '/_ds_bundle.js',
    ...page.sections.map((s) => `/js/${s}.js`),
    `/js/page-${page.canonical === '/' ? 'index' : page.canonical.replace(/\//g, '')}.js`,
  ];
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${page.title}</title>
<meta name="description" content="${esc(page.description)}"/>
<link rel="canonical" href="${url}"/>
<meta name="theme-color" content="${SITE.themeColor}"/>
<link rel="icon" type="image/png" href="/assets/favicon.png"/>
<!-- Open Graph (WhatsApp / Facebook / IG share preview) -->
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="${SITE.brand}"/>
<meta property="og:locale" content="${SITE.locale}"/>
<meta property="og:title" content="${esc(page.title)}"/>
<meta property="og:description" content="${esc(page.description)}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:image" content="${ogImage}"/>${ogDim ? `
<meta property="og:image:width" content="${ogDim.w}"/>
<meta property="og:image:height" content="${ogDim.h}"/>` : ''}
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(page.title)}"/>
<meta name="twitter:description" content="${esc(page.description)}"/>
<meta name="twitter:image" content="${ogImage}"/>
${jsonLdFor(page).map(ldScript).join('\n')}
<link rel="stylesheet" href="/styles.css"/>
<style>${LOADER_STYLE}</style>
<script>window.AF_MEDIA=${JSON.stringify(mediaManifest)};</script>
${GTAG_HEAD}
</head>
<body>
${LOADER_MARKUP}
<div id="root"></div>
${scripts.map((s) => `<script src="${s}"></script>`).join('\n')}
${GTAG_WA_CLICK}
</body>
</html>
`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------------------
//  Build
// ---------------------------------------------------------------------------
// Wipe dist/ contents but KEEP the .git folder, so dist/ can stay a persistent
// deploy repo (GitHub Pages publish folder) across rebuilds.
async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

// Media slots (school logos, testimonial clips) render a designed placeholder
// until their file is added. The page probes the file before swapping it in, but
// probing a slot that is still empty costs a 404 on every single page view — on
// the ad landing page that was eight wasted round-trips. So drop the attribute
// at build time for anything that does not exist yet; adding the file and
// rebuilding is what turns the slot on.
async function pruneEmptyMediaSlots(htmlPath, baseDir) {
  let html = await fs.readFile(htmlPath, 'utf8');
  let dropped = 0;
  for (const attr of ['data-logo', 'data-video']) {
    const matches = [...html.matchAll(new RegExp(' ' + attr + '="([^"]+)"', 'g'))];
    for (const m of matches.reverse()) {
      if (await exists(path.join(baseDir, m[1]))) continue;
      html = html.slice(0, m.index) + html.slice(m.index + m[0].length);
      dropped++;
    }
  }
  if (dropped) await fs.writeFile(htmlPath, html);
  return dropped;
}

// Same idea for the React pages, which cannot be rewritten as text: hand them a
// manifest of the clips that actually shipped so a card skips the probe.
async function testimoniManifest() {
  const dir = path.join(DIST, 'assets/testimoni');
  try {
    return (await fs.readdir(dir)).filter((f) => /[.](mp4|webm)$/i.test(f)).map((f) => '/assets/testimoni/' + f);
  } catch { return []; }
}

async function cleanDist() {
  try {
    for (const entry of await fs.readdir(DIST)) {
      if (entry === '.git') continue;
      await fs.rm(path.join(DIST, entry), { recursive: true, force: true });
    }
  } catch {
    await fs.mkdir(DIST, { recursive: true });
  }
}

async function build() {
  const t0 = Date.now();
  await cleanDist();
  await fs.mkdir(path.join(DIST, 'js'), { recursive: true });
  await fs.mkdir(path.join(DIST, 'vendor'), { recursive: true });

  // 1. Static assets, styles, tokens
  await fs.cp(path.join(SRC, 'assets'), path.join(DIST, 'assets'), { recursive: true });
  await fs.cp(path.join(SRC, 'images'), path.join(DIST, 'images'), { recursive: true });
  await fs.cp(path.join(SRC, 'tokens'), path.join(DIST, 'tokens'), { recursive: true });
  await fs.copyFile(path.join(SRC, 'styles.css'), path.join(DIST, 'styles.css'));

  // 1b. Hand-written pages (ad landing pages) copied verbatim, if present.
  const staticDir = path.join(SRC, 'static');
  if (await exists(staticDir)) {
    await fs.cp(staticDir, DIST, { recursive: true });
  }

  // 2. Design-system bundle (rewrite kit-relative asset paths only)
  const bundle = await fs.readFile(path.join(SRC, '_ds_bundle.js'), 'utf8');
  await fs.writeFile(path.join(DIST, '_ds_bundle.js'), rewriteAssets(bundle));

  // 3. Vendor React + ReactDOM PRODUCTION builds
  const reactDir = path.dirname(fileURLToPath(import.meta.resolve('react/package.json')));
  const reactDomDir = path.dirname(fileURLToPath(import.meta.resolve('react-dom/package.json')));
  await fs.copyFile(path.join(reactDir, 'umd/react.production.min.js'), path.join(DIST, 'vendor/react.production.min.js'));
  await fs.copyFile(path.join(reactDomDir, 'umd/react-dom.production.min.js'), path.join(DIST, 'vendor/react-dom.production.min.js'));

  // 4. Transpile shared section modules
  for (const name of ALL_SECTIONS) {
    const src = await fs.readFile(path.join(KIT, `${name}.jsx`), 'utf8');
    await fs.writeFile(path.join(DIST, 'js', `${name}.js`), await transpileSource(src));
  }

  // 5. Per-page glue + HTML
  const ogDim = await imageSize(path.join(DIST, SITE.ogImage.replace(/^\//, '')));
  const mediaManifest = await testimoniManifest();
  for (const page of PAGES) {
    const key = page.canonical === '/' ? 'index' : page.canonical.replace(/\//g, '');
    await fs.writeFile(path.join(DIST, 'js', `page-${key}.js`), await transpileSource(page.glue));
    const outPath = path.join(DIST, page.out);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, pageHtml(page, ogDim, mediaManifest));
  }

  // 5b. Turn off media slots whose file has not been added yet.
  let pruned = 0;
  for (const sp of STATIC_PAGES) {
    const dir = path.join(DIST, sp.canonical.replace(/^\/|\/$/g, ''));
    const index = path.join(dir, 'index.html');
    if (await exists(index)) pruned += await pruneEmptyMediaSlots(index, dir);
  }

  // 6. SEO + host files
  await fs.writeFile(path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);

  const today = new Date().toISOString().slice(0, 10);
  const sitemapPaths = [
    ...PAGES.map((p) => p.canonical),
    ...STATIC_PAGES.filter((p) => p.inSitemap).map((p) => p.canonical),
  ];
  const urls = sitemapPaths.map((canonical) =>
    `  <url>\n    <loc>${SITE.domain}${canonical}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n');
  await fs.writeFile(path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

  // GitHub Pages: disable Jekyll (keeps _ds_bundle.js) + custom domain
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');
  await fs.writeFile(path.join(DIST, 'CNAME'), SITE.cname + '\n');

  // Every file here is written with LF. Without this, a Windows checkout of
  // the gh-pages branch rewrites them to CRLF and `git status` then reports
  // the whole site as modified after every build, which is pure noise.
  await fs.writeFile(path.join(DIST, '.gitattributes'), '* text=auto eol=lf\n');

  // Deploy-repo .gitignore — only OS junk; everything else here IS the site.
  await fs.writeFile(path.join(DIST, '.gitignore'),
    '# Auto-generated. dist/ is the GitHub Pages publish folder; keep everything except OS junk.\n.DS_Store\nThumbs.db\ndesktop.ini\n');

  // Friendly 404 (GitHub Pages serves this for unknown routes)
  await fs.writeFile(path.join(DIST, '404.html'), html404());

  console.log(`✓ Built ${PAGES.length} pages (+${STATIC_PAGES.length} static) + ${ALL_SECTIONS.length} modules to dist/ in ${Date.now() - t0}ms`);
  console.log(`  domain: ${SITE.domain}`);
  console.log(`  media slots: ${mediaManifest.length} clip(s) live, ${pruned} empty slot(s) left as placeholders`);
}

function html404() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Halaman tidak ditemukan · ${SITE.brand}</title>
<link rel="icon" type="image/png" href="/assets/favicon.png"/>
<link rel="stylesheet" href="/styles.css"/>
</head>
<body style="font-family:var(--font-body,sans-serif);background:var(--af-paper,#FFF8EE);color:var(--af-ink,#2B2A28);display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px;">
<div>
  <img src="/assets/logo-agatha-felix.png" alt="${SITE.brand}" style="height:64px;margin-bottom:24px"/>
  <h1 style="font-family:var(--font-display,sans-serif);font-size:2rem;margin:0 0 8px">Waduh, halamannya nggak ketemu 🙈</h1>
  <p style="margin:0 0 24px">Mungkin link-nya salah ketik. Yuk balik ke beranda.</p>
  <a href="/" style="display:inline-block;background:var(--af-orange,#E8542D);color:#fff;text-decoration:none;font-weight:700;padding:12px 28px;border:2px solid var(--af-ink,#2B2A28);border-radius:999px;box-shadow:0 4px 0 var(--af-ink,#2B2A28)">← Kembali ke Beranda</a>
</div>
</body>
</html>
`;
}

build().catch((err) => { console.error(err); process.exit(1); });
