// Website v2 — Produk Standar: compact catalogue with audience filter and a
// product detail sheet (bottom sheet on phones, centred dialog on desktop).
const DS2p = window.AgathaFelixDesignSystem_3557c1;

const wrapPS = (extra = {}) => ({
  maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1,
  padding: '72px var(--container-pad)', ...extra,
});

// Photos: the product cards (overview + detail per type) and the per-colour
// Shopee shots live pre-sized as WebP in assets/katalog. Older photos in
// assets/products stay "*.png" so the build can swap in their WebP copies.
const K = '../../assets/katalog/';
const P = '../../assets/products/';

// Swatch colours, sampled from the product photos.
const WARNA = {
  'abu-abu': ['Abu-abu', '#8E9297'], biru: ['Biru', '#1F5FD1'], 'biru-tosca': ['Biru Tosca', '#22B0DE'],
  hijau: ['Hijau', '#1E8F52'], 'hijau-1': ['Hijau 1', '#37A55F'], 'hijau-2': ['Hijau 2', '#23804D'],
  'hijau-stabilo': ['Hijau Stabilo', '#8CD41E'], 'hijau-tua': ['Hijau Tua', '#2F4A3B'],
  'hijau-tosca': ['Hijau Tosca', '#5FD3C0'], 'hijau-toska': ['Hijau Tosca', '#5FD3C0'],
  hitam: ['Hitam', '#2B2A28'], kuning: ['Kuning', '#F2C318'], merah: ['Merah', '#D9262C'],
  'merah-maroon': ['Merah Maroon', '#7A2432'], orange: ['Orange', '#F26A1B'], pink: ['Pink', '#EC4F9A'],
  'putih-susu': ['Putih Susu', '#F1EEE6'], transparan: ['Transparan', null], bening: ['Bening', null],
  ungu: ['Ungu', '#7040B0'],
};
const warna = (slug, keys) => keys.split(' ').map((key) => ({
  key, name: WARNA[key][0], hex: WARNA[key][1], img: K + slug + '-warna-' + key + '.webp',
}));
// A product type with its overview + detail cards.
const tipe = (slug, label, title, specs, more = {}) => ({
  slug, label, title, specs, colours: [], extras: [],
  thumb: K + slug + '-540.webp', card: K + slug + '.webp', detail: K + slug + '-detail.webp', ...more,
});
const PP = [['Bahan', 'Polypropylene'], ['Anti air', 'Waterproof']];

const KATALOG = [
  {
    slug: 'clear-holder', name: 'Clear Holder', color: 'orange', aud: ['kantor', 'sekolah'], badge: 'Populer',
    desc: 'Buku display berisi kantong plastik bening. Dokumen tersusun rapi dan gampang dibolak-balik.',
    variants: [
      tipe('clear-holder-folio', 'Folio', 'Tipe Folio', [['Ukuran', '24 × 35 × 3,2 cm'], ...PP, ['Cetak logo', 'Bisa custom logo']], {
        colours: warna('clear-holder-folio', 'abu-abu biru biru-tosca hijau hijau-stabilo hitam kuning merah pink'),
        extras: [[K + 'clear-holder-folio-foto-1.webp', 'Clear Holder Folio berisi laporan'], [P + 'clear-holder.png', 'Tumpukan Clear Holder berbagai warna']],
      }),
      tipe('clear-holder-a4', 'A4', 'Tipe A4', [['Ukuran', '21 × 29,7 × 3,2 cm'], ['Pilihan isi', '20 · 40 · 60 lembar'], ...PP]),
      tipe('clear-holder-a3', 'A3', 'Tipe A3', [['Ukuran', '31 × 44 × 3 cm'], ['Pilihan isi', '20 · 40 · 60 lembar'], ...PP], {
        colours: warna('clear-holder-a3', 'abu-abu biru biru-tosca hijau hijau-stabilo hitam kuning merah pink ungu'),
      }),
      // Sold as A5: the cover is B5 size, the plastic sleeves slightly smaller.
      tipe('clear-holder-a5', 'A5', 'Tipe A5', [['Ukuran', '25 × 17,6 × 2 cm'], ['Pilihan isi', '20 · 40 · 60 lembar'], ...PP, ['Cetak logo', 'Bisa custom logo']], {
        colours: warna('clear-holder-a5', 'abu-abu biru biru-tosca hijau hijau-stabilo hitam kuning merah pink ungu'),
      }),
    ],
  },
  {
    slug: 'business-file', name: 'Business File', color: 'blue', aud: ['sekolah', 'kantor'], badge: 'Favorit',
    desc: 'Map dengan kantong depan dan label di punggung. Bahan PP tebal, anti air, bisa dicetak logo.',
    variants: [
      tipe('business-file-a4', 'A4', 'Tipe A4', [['Ukuran', '21 × 29,7 cm'], ['Tebal', '0,18 cm'], ...PP, ['Cetak logo', 'Bisa custom logo']]),
      tipe('business-file-folio', 'Folio', 'Tipe Folio', [['Ukuran', '23 × 35 cm'], ['Tebal', '0,18 cm'], ...PP, ['Cetak logo', 'Bisa custom logo']], {
        colours: warna('business-file-folio', 'abu-abu biru hijau hitam kuning merah orange pink putih-susu transparan ungu'),
        extras: [[K + 'business-file-foto-1.webp', 'Business File berbagai warna di meja belajar'], [P + 'clear-holder-spread.png', 'Deretan Business File berbagai warna']],
      }),
    ],
  },
  {
    slug: 'map-kancing', name: 'Map Kancing', color: 'green', aud: ['sekolah', 'kantor'], badge: null,
    desc: 'Map amplop dengan kancing jepret. Bahan PP, anti air, muat kertas F4 dan A4.',
    variants: [
      tipe('map-kancing-tipis', 'Tipis', 'Tipe Folio Tipis', [['Ukuran', '25 × 36,3 cm'], ['Tebal', '0,12 cm · ringan'], ...PP, ['Muat', 'Kertas F4 & A4']], {
        colours: warna('map-kancing-tipis', 'bening biru hijau-tosca kuning pink'),
      }),
      tipe('map-kancing-tebal', 'Tebal', 'Tipe Folio Tebal', [['Ukuran', '25 × 36,3 cm'], ['Tebal', '0,18 cm'], ...PP, ['Penutup', 'Kancing jepret']], {
        colours: warna('map-kancing-tebal', 'biru hijau-tosca kuning pink transparan'),
        extras: [[P + 'business-file.png', 'Tumpukan Map Kancing berbagai warna']],
      }),
    ],
  },
  {
    slug: 'zipper-bag', name: 'Zipper Bag', color: 'purple', aud: ['sekolah', 'kantor'], badge: null,
    desc: 'Tas map beresleting, bahan PP anti air. Pilih model polos, setengah jaring, bertali, atau dengan name card.',
    variants: [
      tipe('zipper-bag-setengah-jaring', 'Jaring ½', 'Tipe Jaring ½', [['Ukuran', 'F4 · 39,4 × 27 × 3 cm'], ...PP, ['Model', 'Setengah jaring, isi terlihat'], ['Muat', 'Kertas F4 & alat tulis']], {
        colours: warna('zipper-bag-setengah-jaring', 'biru hijau hitam kuning merah orange pink ungu'),
      }),
      tipe('zipper-bag-tali-f4', 'Tali · F4', 'Tipe Jaring ½ + Tali 2 (F4)', [['Ukuran', '24 × 34,5 cm'], ['Tebal', '0,18 cm'], ...PP, ['Muat', 'Kertas F4 & buku tulis']], {
        colours: warna('zipper-bag-tali-f4', 'biru hijau-1 hijau-2 hitam kuning merah-maroon orange pink ungu'),
      }),
      tipe('zipper-bag-tali-a5', 'Tali · A5', 'Tipe Jaring ½ + Tali 2 (A5)', [['Ukuran', '21 × 14,8 cm'], ['Tebal', '0,18 cm'], ...PP, ['Pas untuk', 'Alat tulis & buku kecil']]),
      tipe('zipper-bag-namecard', 'Name Card', 'Tipe Kancing + Name Card', [['Ukuran', 'Folio · 28 × 39,3 cm'], ['Lebar', '5 cm'], ...PP, ['Penutup', 'Kancing jepret & name card'], ['Muat', 'Kertas F4 & buku tulis']], {
        colours: warna('zipper-bag-namecard', 'biru hijau hijau-stabilo hitam merah orange pink ungu'),
      }),
      tipe('zipper-bag-polos', 'Polos', 'Tipe Biasa / Polos', [['Ukuran', 'Folio · 27 × 39,2 × 3 cm'], ...PP, ['Muat', 'Kertas F4 & alat tulis']], {
        colours: warna('zipper-bag-polos', 'biru hijau hitam kuning merah orange pink ungu'),
      }),
    ],
  },
  {
    slug: 'carry-file', name: 'Carry File', color: 'blue', aud: ['kantor', 'sekolah'], badge: 'Best Seller',
    desc: 'Tas dokumen bahan PP yang kokoh. Dokumen aman dibawa ke mana-mana.',
    variants: [
      tipe('carry-file-capslock', 'Caps Lock', 'Tipe Caps Lock & Handle Bag', [['Ukuran', '26 × 36,5 cm'], ['Lebar', '4 cm'], ...PP, ['Pengunci', 'Caps lock + handle']], {
        colours: warna('carry-file-capslock', 'biru hijau kuning merah transparan'),
        extras: [[P + 'carry-file-capslock.png', 'Carry File Caps Lock biru'], [P + 'carry-file-capslock-open.png', 'Carry File Caps Lock dalam keadaan terbuka']],
      }),
      tipe('carry-file-kancing', 'Kancing', 'Tipe Kancing', [['Ukuran', '26 × 36,5 cm'], ['Tebal', '0,18 cm'], ...PP, ['Penutup', 'Kancing jepret'], ['Muat', 'Kertas F4 & A4']]),
    ],
  },
  {
    slug: 'dokumen-keeper', name: 'Dokumen Keeper Executive', color: 'purple', aud: ['premium', 'kantor'], badge: 'Premium',
    desc: 'Map premium berbahan kulit sintetis dengan resleting. Untuk sertifikat, akta, dan dokumen penting.',
    variants: [
      tipe('dokumen-keeper', 'Folio', 'Ukuran Folio', [['Ukuran', '23 × 35 cm'], ['Bahan', 'Kulit sintetis'], ['Anti air', 'Waterproof'], ['Pilihan isi', '20 · 40 · 60 lembar']], {
        colours: warna('dokumen-keeper', 'biru hijau-tua hitam merah'),
        extras: [
          [K + 'dokumen-keeper-foto-1.webp', 'Dokumen Keeper berisi foto di meja kerja'],
          [K + 'dokumen-keeper-foto-2.webp', 'Dokumen Keeper hitam, biru, dan merah'],
          [P + 'map-executive.png', 'Dokumen Keeper biru dan merah dengan foil emas'],
          [P + 'map-executive-detail.png', 'Dokumen Keeper hitam dan hijau tua'],
        ],
      }),
    ],
  },
  {
    slug: 'file-case', name: 'File Case', color: 'blue', aud: ['kantor', 'sekolah'], badge: null,
    desc: 'Koper dokumen plastik PP tebal dengan handle jinjing dan klip samping yang rapat.',
    variants: [
      tipe('file-case', 'Folio', 'Tipe Executive', [['Ukuran', '23 × 35 cm'], ['Bahan', 'Plastik PP tebal'], ['Anti air', 'Waterproof'], ['Muat', 'Kertas A4 & F4'], ['Penutup', 'Klip samping rapat'], ['Pegangan', 'Handle jinjing']], {
        colours: warna('file-case', 'bening biru pink'),
      }),
    ],
  },
  {
    slug: 'clear-sleeves', name: 'Clear Sleeves (Map L)', color: 'green', aud: ['sekolah', 'kantor'], badge: null,
    desc: 'Map L transparan, ringan dan gampang dipakai. Warna-warni untuk mengelompokkan tugas dan dokumen.',
    variants: [
      tipe('clear-sleeves-a4', 'A4', 'Tipe A4', [['Ukuran', '21 × 29,7 cm'], ['Bahan', 'Polypropylene (PP)'], ['Anti air', 'Waterproof'], ['Pas untuk', 'Kertas A4, sertifikat, lampiran rapor']], {
        extras: [[P + 'map-l.png', 'Map L transparan warna-warni']],
      }),
      tipe('clear-sleeves-folio', 'Folio', 'Tipe Folio', [['Ukuran', '23 × 34,3 cm'], ['Bahan', 'Polypropylene (PP)'], ['Muat', 'Kertas F4 & A4']]),
    ],
  },
  {
    slug: 'map-tali', name: 'Map Tali', color: 'yellow', aud: ['kantor', 'sekolah'], badge: null,
    desc: 'Map amplop dengan tutup tali lilit dan bukaan atas. Aman untuk dokumen penting.',
    variants: [
      tipe('map-tali', 'Folio', 'Tipe Folio', [['Ukuran', '26 × 36,4 cm'], ['Tebal', '0,18 cm'], ...PP, ['Penutup', 'Tali lilit, bukaan atas']], {
        colours: warna('map-tali', 'bening biru hijau-toska kuning merah'),
      }),
    ],
  },
  {
    slug: 'expanding-file', name: 'Expanding File', color: 'green', aud: ['kantor', 'sekolah'], badge: null,
    desc: 'Map akordion bersekat banyak dengan tali elastis, tebal dan awet. Arsip rapi per kategori.',
    variants: [{
      slug: 'expanding-file', label: '', title: '', specs: [], colours: [], thumb: P + 'expanding-file.png',
      extras: [[P + 'expanding-file.png', 'Expanding File akordion dengan tali elastis'], [P + 'expanding-file-thickness.png', 'Pilihan ketebalan Expanding File']],
    }],
  },
];

// Every type slug, and every product slug (its first type), is a deep link.
function findSlug(slug) {
  for (const fam of KATALOG) {
    if (fam.slug === slug) return { fam, vi: 0 };
    const vi = fam.variants.findIndex((v) => v.slug === slug);
    if (vi >= 0) return { fam, vi };
  }
  return null;
}
// Card photos first, then the chosen colour, then real-life shots.
function gallery(fam, v, colour) {
  const title = fam.name + (v.title ? ' ' + v.title : '');
  return [
    ...(v.card ? [[v.card, title + ': ringkasan produk'], [v.detail, title + ': ukuran dan spesifikasi']] : []),
    ...(colour ? [[colour.img, title + ' warna ' + colour.name]] : []),
    ...v.extras,
  ];
}

// Prices from HargaStandar.jsx. A type's rows: a Clear Holder column ('ch:x')
// or a list of item ids. Types without a mapping stay "tanya harga".
const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID');
function hargaTipe(slug) {
  const hs = window.HARGA_STANDAR;
  const map = hs.tipe[slug];
  if (!map) return [];
  if (typeof map === 'string') {
    const col = hs.clearHolder.ukuran.findIndex(([key]) => 'ch:' + key === map);
    return hs.clearHolder.isi.filter(([, row]) => typeof row[col] === 'number')
      .map(([n, row]) => ({ label: 'Isi ' + n + ' lembar', harga: row[col], satuan: 'pcs' }));
  }
  return map.map((id) => {
    for (const grup of hs.daftar) {
      const b = grup.barang.find((x) => x[0] === id);
      if (b) return { label: b[1] + ' · ' + b[3], kode: b[2], harga: b[4], satuan: grup.satuan };
    }
    return null;
  }).filter(Boolean);
}
// Lowest price across a product's types, for the card.
function mulaiDari(fam) {
  const rows = fam.variants.flatMap((v) => hargaTipe(v.slug));
  return rows.length ? rows.reduce((a, b) => (b.harga < a.harga ? b : a)) : null;
}

const FILTERS = [
  ['semua', 'Semua 🗂️'],
  ['sekolah', 'Buat Sekolah 🎒'],
  ['kantor', 'Buat Kantor 💼'],
  ['premium', 'Premium ✨'],
];

const AUD_LABEL = { sekolah: ['Sekolah', 'purple'], kantor: ['Kantor', 'blue'], premium: ['Premium', 'yellow'] };

// Class-based layer for this page: inline styles cannot express hover-only
// effects, sticky filters or the sheet's phone/desktop switch.
const PS_CSS_ID = 'af-produk-standar';
(function injectPsCss() {
  if (typeof document === 'undefined' || document.getElementById(PS_CSS_ID)) return;
  const tag = document.createElement('style');
  tag.id = PS_CSS_ID;
  tag.textContent = `
  .af-ps-filters { position: sticky; top: 74px; z-index: 20; display: flex; gap: 8px; overflow-x: auto;
    scrollbar-width: none; padding: 12px var(--container-pad); margin: 0 calc(-1 * var(--container-pad)) 18px;
    background: var(--af-paper); border-bottom: 2px solid transparent; }
  .af-ps-filters::-webkit-scrollbar { display: none; }
  .af-ps-filters button { flex-shrink: 0; min-height: 44px; }
  .af-ps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .af-ps-card { position: relative; display: flex; flex-direction: column; overflow: hidden; background: #fff;
    border: 2px solid var(--af-ink); border-radius: var(--radius-lg); box-shadow: 0 5px 0 var(--af-ink);
    color: inherit; text-decoration: none; transition: transform 220ms var(--ease-pop); }
  .af-ps-card:focus-visible { outline: 3px solid var(--af-blue); outline-offset: 3px; }
  @media (hover: hover) { .af-ps-card:hover { transform: translateY(-5px) rotate(-.6deg); } }
  .af-ps-card:active { transform: translateY(2px); box-shadow: 0 3px 0 var(--af-ink); }
  .af-ps-img { aspect-ratio: 1 / 1; background: #f4ede1; border-bottom: 2px solid var(--af-ink); position: relative; }
  .af-ps-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .af-ps-types { font-size: .72rem; font-weight: 700; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .af-ps-more { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-display);
    font-weight: 800; font-size: .8rem; color: var(--af-ink); margin-top: 2px; }
  .af-ps-price { font-size: .78rem; font-weight: 700; color: var(--af-green-deep); }

  /* Prices: rows in the detail sheet, and the full list below the grid. */
  .af-ps-harga { display: grid; border: 2px solid var(--af-ink); border-radius: var(--radius-md); background: #fff; overflow: hidden; }
  .af-ps-harga > div { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 8px 12px; font-size: .88rem; }
  .af-ps-harga > div + div { border-top: 1px solid var(--af-line); }
  .af-ps-harga small, .af-ps-daftar small { display: block; font-size: .72rem; color: var(--text-muted); font-weight: 600; }
  .af-ps-harga strong { font-family: var(--font-display); font-weight: 800; white-space: nowrap; }
  .af-ps-harga strong small { display: inline; }
  .af-ps-note { margin: 6px 0 0; font-size: .74rem; color: var(--text-muted); }
  .af-ps-dh { margin-top: 36px; scroll-margin-top: 90px; }
  .af-ps-dh-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 18px; align-items: start; }
  .af-ps-box { background: #fff; border: 2px solid var(--af-ink); border-radius: var(--radius-lg); box-shadow: 0 4px 0 var(--af-ink); padding: 16px 18px; min-width: 0; }
  .af-ps-box h3 { font-size: 1.05rem; margin: 0 0 10px; }
  .af-ps-box h3 span { font-family: var(--font-body); font-weight: 700; font-size: .75rem; color: var(--text-muted); margin-left: 6px; }
  .af-ps-tabel { width: 100%; border-collapse: collapse; font-size: .86rem; font-variant-numeric: tabular-nums; }
  .af-ps-tabel th, .af-ps-tabel td { padding: 7px 6px; text-align: right; border-bottom: 1px solid var(--af-line); white-space: nowrap; }
  .af-ps-tabel th:first-child { text-align: left; }
  .af-ps-tabel thead th { font-family: var(--font-display); font-weight: 800; color: var(--af-ink); border-bottom: 2px solid var(--af-ink); }
  .af-ps-tabel tbody th { font-weight: 700; color: var(--af-ink); }
  .af-ps-tabel tr:last-child > * { border-bottom: none; }
  .af-ps-daftar { list-style: none; margin: 0; padding: 0; font-size: .86rem; }
  .af-ps-daftar li { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 7px 0; border-bottom: 1px solid var(--af-line); }
  .af-ps-daftar li:last-child { border-bottom: none; }
  .af-ps-daftar strong { font-weight: 700; color: var(--af-ink); }
  .af-ps-daftar b { font-family: var(--font-display); font-weight: 800; white-space: nowrap; font-variant-numeric: tabular-nums; }
  @media (max-width: 760px) { .af-ps-dh-grid { grid-template-columns: 1fr; } }
  @media (max-width: 400px) {
    .af-ps-box { padding: 14px 12px; }
    .af-ps-tabel { font-size: .78rem; }
    .af-ps-tabel th, .af-ps-tabel td { padding: 6px 3px; }
  }

  @media (max-width: 900px) { .af-ps-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 680px) {
    .af-ps-wrap { padding-left: 16px !important; padding-right: 16px !important; }
    .af-ps-hero { padding-top: 36px !important; padding-bottom: 12px !important; gap: 12px !important; }
    .af-ps-list { padding-top: 4px !important; }
    .af-ps-hero h1 { font-size: 2rem !important; }
    .af-ps-hero p { font-size: 1rem !important; }
    .af-ps-filters { padding: 10px 16px; margin: 0 -16px 14px; }
    .af-ps-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .af-ps-card { border-radius: var(--radius-md); box-shadow: 0 4px 0 var(--af-ink); }
    .af-ps-body { padding: 10px 11px 12px !important; gap: 4px !important; }
    .af-ps-body h3 { font-size: .95rem !important; }
    .af-ps-desc, .af-ps-price { display: none !important; }
    .af-ps-badge { top: 6px !important; right: 6px !important; font-size: 9px !important; padding: 1px 7px !important; }
    /* The row scrolls sideways; a fade on the right edge says there is more. */
    .af-ps-filters::after { content: ''; position: sticky; right: -16px; flex: 0 0 40px; margin-left: -40px;
      background: linear-gradient(to right, rgba(255, 248, 238, 0), var(--af-paper) 70%); pointer-events: none; }
  }
  /* Large phones / small tablets: two columns made each card ~345px tall. */
  @media (min-width: 460px) and (max-width: 680px) { .af-ps-grid { grid-template-columns: repeat(3, 1fr); } }
  /* Wider screens: filters and the count line sit centred under the heading. */
  @media (min-width: 681px) {
    .af-ps-filters { justify-content: center; }
    .af-ps-count { text-align: center; }
  }
  /* Landscape phones: header + sticky filters would cover a third of the screen. */
  @media (max-height: 520px) { .af-ps-filters { position: static; } }

  @media (prefers-reduced-motion: reduce) {
    .af-ps-card { animation: none !important; transition: none !important; }
  }`;
  document.head.appendChild(tag);
})();

function KatalogCard({ fam, eager, onOpen }) {
  const first = fam.variants[0];
  const types = fam.variants.map((v) => v.label).filter(Boolean);
  const mulai = mulaiDari(fam);
  return (
    <a
      href={'#' + fam.slug}
      className="af-ps-card"
      aria-haspopup="dialog"
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        onOpen();
      }}
    >
      <div className="af-ps-img">
        <img
          src={first.thumb}
          srcSet={first.card ? `${first.thumb} 540w, ${first.card} 1080w` : undefined}
          sizes="(max-width: 680px) 50vw, (max-width: 900px) 33vw, 280px"
          alt={fam.name} loading={eager ? 'eager' : 'lazy'} decoding="async"
        />
        {fam.badge ? (
          <span className="af-ps-badge" style={{ position: 'absolute', top: 8, right: 8, background: 'var(--af-yellow)', border: '2px solid var(--af-ink)', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, padding: '2px 9px', color: 'var(--af-ink)' }}>{fam.badge}</span>
        ) : null}
      </div>
      <div className="af-ps-body" style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ fontSize: '1.1rem' }}>{fam.name}</h3>
        {types.length > 1 ? <span className="af-ps-types">{types.length} tipe · {types.join(' · ')}</span> : null}
        <p className="af-ps-desc" style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.55, color: 'var(--text-body)', flex: 1 }}>{fam.desc}</p>
        {mulai ? <span className="af-ps-price">{'Mulai ' + rupiah(mulai.harga) + '/' + mulai.satuan}</span> : null}
        <span className="af-ps-more" style={{ marginTop: 'auto' }}>Lihat detail <span aria-hidden="true">→</span></span>
      </div>
    </a>
  );
}

function DetailSheet({ fam, vi, pos, total, onClose, onStep, onVariant }) {
  const { Badge, Button, FAQItem } = DS2p;
  const v = fam.variants[vi];
  const [colourIdx, setColourIdx] = React.useState(null);
  const [slide, setSlide] = React.useState(0);
  const colour = colourIdx === null ? v.colours[0] : v.colours[colourIdx];
  const imgs = gallery(fam, v, colour);
  const colourSlide = v.card ? 2 : 0;

  // A new type starts at its first photo with no colour chosen.
  React.useEffect(() => {
    setColourIdx(null);
    setSlide(0);
  }, [v.slug]);

  function pickColour(i) {
    setColourIdx(i);
    setSlide(colourSlide);
  }

  const chosen = colourIdx === null ? null : v.colours[colourIdx];
  const harga = hargaTipe(v.slug);
  const waText = `Halo Agatha Felix! Saya mau ${harga.length ? 'pesan' : 'tanya harga grosir'} *${fam.name}*${v.title ? ' (' + v.title + ')' : ''}.`
    + `\nWarna: ${chosen ? chosen.name : ''}\nJumlah: \nKota tujuan: `;
  const chip = (c) => ({ color: `var(--af-${c}-deep)`, background: `var(--af-${c}-tint)`, borderColor: `var(--af-${c}-soft)` });

  return (
    <window.AfSheet
      pos={pos} total={total} onClose={onClose} onStep={onStep} resetKey={fam.slug}
      footer={<>
        <Button color="wa" size="lg" href={window.waLink(waText)} target="_blank" rel="noopener noreferrer">
          <window.WaGlyph2 /> <span>{harga.length ? 'Pesan' : 'Tanya Harga'}<span className="af-sheet-xs-hide"> via WhatsApp</span></span>
        </Button>
        <window.AfShareButton url={location.origin + location.pathname + '#' + v.slug} title={fam.name + ' — Agatha Felix'} />
      </>}
    >
      <div className="af-sheet-grid">
        <window.AfGallery imgs={imgs} slide={slide} onSlide={setSlide} />

        <div className="af-sheet-body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {fam.badge ? <Badge color="yellow">{fam.badge}</Badge> : null}
            <Badge color="green" dot>Siap Kirim</Badge>
          </div>
          <div>
            <h2 id="af-sheet-title" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)' }}>{fam.name}</h2>
            {v.title ? <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: `var(--af-${fam.color}-deep)`, marginTop: 2 }}>{v.title}</div> : null}
            <p style={{ margin: '8px 0 0', fontSize: '.95rem', lineHeight: 1.7, color: 'var(--text-body)' }}>{fam.desc}</p>
          </div>

          {fam.variants.length > 1 ? (
            <div>
              <h3 className="af-sheet-h">Pilih tipe</h3>
              <div className="af-sheet-variants" role="group" aria-label="Pilih tipe">
                {fam.variants.map((t, i) => (
                  <button key={t.slug} type="button" aria-pressed={i === vi} onClick={() => onVariant(i)}>{t.label}</button>
                ))}
              </div>
            </div>
          ) : null}

          {harga.length ? (
            <div>
              <h3 className="af-sheet-h">Harga</h3>
              <div className="af-ps-harga">
                {harga.map((r) => (
                  <div key={r.label}>
                    <span>{r.label}{r.kode ? <small>Kode {r.kode}</small> : null}</span>
                    <strong>{rupiah(r.harga)}<small>/{r.satuan}</small></strong>
                  </div>
                ))}
              </div>
              <p className="af-ps-note">Belum termasuk PPN · update {window.HARGA_STANDAR.update}. Harga dapat berubah sewaktu-waktu.</p>
            </div>
          ) : null}

          {v.colours.length ? (
            <div>
              <h3 className="af-sheet-h">
                {v.colours.length} pilihan warna
                {chosen ? <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}> · {chosen.name}</span> : null}
              </h3>
              <div className="af-sheet-swatches" role="group" aria-label="Pilih warna">
                {v.colours.map((c, i) => (
                  <button
                    key={c.key} type="button" className="af-sheet-swatch" aria-pressed={i === colourIdx}
                    aria-label={c.name} title={c.name} onClick={() => pickColour(i)}
                    style={c.hex ? { background: c.hex } : undefined}
                  >
                    {i === colourIdx ? (
                      <svg viewBox="0 0 12 12" fill="none" stroke={window.afIsLight(c.hex) ? 'var(--af-ink)' : '#fff'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {v.specs.length ? (
            <div>
              <h3 className="af-sheet-h">Spesifikasi</h3>
              <div className="af-sheet-specs">
                {v.specs.map(([k, val]) => (
                  <div key={k} className="af-sheet-spec">
                    <div style={{ fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', fontWeight: 700, color: 'var(--text-muted)' }}>{k}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '.98rem', marginTop: 3 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="af-sheet-chips">
            <span className="af-sheet-chip" style={chip('orange')}>Langsung dari pabrik</span>
            <span className="af-sheet-chip" style={chip('green')}>Grosir &amp; satuan</span>
            <span className="af-sheet-chip" style={chip('blue')}>Pengiriman cepat</span>
          </div>

          <div>
            <h3 className="af-sheet-h">Cocok untuk</h3>
            <div className="af-sheet-chips">
              {fam.aud.map((a) => <Badge key={a} color={AUD_LABEL[a][1]}>{AUD_LABEL[a][0]}</Badge>)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 className="af-sheet-h" style={{ marginBottom: 0 }}>Pertanyaan umum</h3>
            <FAQItem question="Bisa beli satuan atau harus grosir?">Bisa dua-duanya. Sebutkan jumlah dan warna lewat WhatsApp, kami kirim harga terbarunya.</FAQItem>
            <FAQItem question="Bisa dicetak logo & nama sekolah?">Bisa. Untuk produk standar, cetak logo dan nama sekolah atau instansi mulai 50 pcs.</FAQItem>
            <FAQItem question="Kirim ke luar kota atau luar pulau?">Bisa, kami kirim ke seluruh Indonesia lewat ekspedisi. Ongkir dihitung transparan saat penawaran.</FAQItem>
          </div>

          <a href="produk-custom.html" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--af-ink)', background: 'var(--af-purple-tint)', border: '2px solid var(--af-ink)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
            <span style={{ flex: 1 }}>
              <strong style={{ fontFamily: 'var(--font-display)', display: 'block' }}>Mau versi ada logo-nya?</strong>
              <span style={{ fontSize: '.8rem', color: 'var(--text-body)' }}>Lihat produk custom &amp; rapor sekolah</span>
            </span>
            <span aria-hidden="true" style={{ fontWeight: 800, fontSize: '1.2rem' }}>→</span>
          </a>
        </div>
      </div>
    </window.AfSheet>
  );
}

// The whole price list as published, including items without a catalogue card.
function DaftarHarga() {
  const hs = window.HARGA_STANDAR;
  const angka = (n) => (typeof n === 'number' ? n.toLocaleString('id-ID') : '–');
  return (
    <div id="daftar-harga" className="af-ps-dh">
      <h2 style={{ fontSize: 'var(--text-lg)', textAlign: 'center' }}>Daftar Harga</h2>
      <p className="af-ps-note" style={{ textAlign: 'center', fontSize: '.8rem' }}>
        Update {hs.update} · belum termasuk PPN · harga dapat berubah sewaktu-waktu
      </p>
      <div className="af-ps-dh-grid">
        <div className="af-ps-box" style={{ gridColumn: '1 / -1' }}>
          <h3>Clear Holder <span>Rupiah per pcs, menurut isi kantong (lembar)</span></h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="af-ps-tabel">
              <thead>
                <tr><th scope="col">Isi</th>{hs.clearHolder.ukuran.map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr>
              </thead>
              <tbody>
                {hs.clearHolder.isi.map(([n, row]) => (
                  <tr key={n}><th scope="row">{n}</th>{row.map((v, i) => <td key={i}>{angka(v)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="af-ps-note">B5 = Clear Holder tipe A5 di katalog. Executive = Dokumen Keeper Executive.</p>
        </div>
        {hs.daftar.map((grup) => (
          <div key={grup.judul} className="af-ps-box">
            <h3>{grup.judul} <span>per {grup.satuan}</span></h3>
            <ul className="af-ps-daftar">
              {grup.barang.map(([id, nama, kode, ukuran, harga]) => (
                <li key={id}>
                  <span><strong>{nama}</strong><small>{kode ? kode + ' · ' : ''}{ukuran}</small></span>
                  <b>{rupiah(harga)}</b>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProdukStandarPage() {
  const { Badge, Button } = DS2p;
  const [filter, setFilter] = React.useState('semua');
  const [openSlug, setOpenSlug] = React.useState(null);
  const shown = KATALOG.filter((f) => filter === 'semua' || f.aud.includes(filter));
  const open = openSlug ? findSlug(openSlug) : null;
  const typeCount = shown.reduce((n, f) => n + f.variants.length, 0);

  // The URL hash names the open product type: shareable, and Back closes the sheet.
  React.useEffect(() => {
    const sync = () => {
      const slug = decodeURIComponent(location.hash.slice(1));
      setOpenSlug(findSlug(slug) ? slug : null);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  function openProduct(slug) {
    history.pushState({ afDetail: true }, '', '#' + slug);
    setOpenSlug(slug);
  }
  function closeProduct() {
    if (history.state && history.state.afDetail) { history.back(); return; }
    history.replaceState(null, '', location.pathname + location.search);
    setOpenSlug(null);
  }
  function goTo(slug) {
    history.replaceState(history.state, '', '#' + slug);
    setOpenSlug(slug);
  }
  const navList = open && shown.includes(open.fam) ? shown : KATALOG;
  function step(dir) {
    const i = navList.indexOf(open.fam);
    goTo(navList[(i + dir + navList.length) % navList.length].slug);
  }

  return (
    <div data-screen-label="Produk Standar">
      <window.HeaderV2 active="produk-standar.html" />
      <main>
        <section style={{ background: 'var(--af-green-tint)', position: 'relative', overflow: 'hidden' }}>
          <window.ConfettiV2 />
          <div className="af-ps-wrap af-ps-hero" style={wrapPS({ paddingBottom: 20, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 })}>
            <Badge color="green" dot>Siap Kirim Hari Ini</Badge>
            <h1 style={{ fontSize: 'var(--text-2xl)', maxWidth: 640 }}>
              Katalog Map Plastik <span style={{ color: 'var(--af-green)' }}>Siap Pakai</span>
            </h1>
            <p style={{ margin: 0, fontSize: 'var(--text-md)', maxWidth: 520 }}>
              Tanpa minimum desain, tanpa nunggu produksi — pilih, pesan, kirim. Beli satuan, per lusin, atau grosir.
            </p>
          </div>
          <window.Wave fill="var(--af-paper)" />
        </section>

        <section style={{ background: 'var(--af-paper)' }}>
          <div className="af-ps-wrap af-ps-list" style={wrapPS({ paddingTop: 8 })}>
            <div className="af-ps-filters" role="group" aria-label="Filter produk">
              {FILTERS.map(([key, label]) => {
                const isOn = filter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isOn}
                    onClick={() => setFilter(key)}
                    style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                      background: isOn ? 'var(--af-green)' : '#fff', color: isOn ? '#fff' : 'var(--af-ink)',
                      border: '2px solid var(--af-ink)', borderRadius: 999, padding: '9px 18px',
                      boxShadow: isOn ? '0 3px 0 var(--af-ink)' : 'none',
                      transition: 'all 160ms var(--ease-pop)',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="af-ps-count" aria-live="polite" style={{ margin: '0 0 12px', fontSize: '.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {shown.length} produk, {typeCount} tipe · ketuk untuk lihat detail
            </p>
            <div className="af-ps-grid">
              {shown.map((f, i) => <KatalogCard key={f.slug} fam={f} eager={i < 4} onOpen={() => openProduct(f.slug)} />)}
            </div>
            <DaftarHarga />
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 28 }}>
              Mau pesan atau cek stok warna? Chat kami, sebutkan produk dan jumlahnya 👇
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button color="wa" size="lg" href={window.waLink('Halo Agatha Felix! Saya mau tanya katalog & daftar harga grosir.')} target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Tanya Katalog &amp; Harga</Button>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--af-blue-tint)' }}>
          <window.Wave fill="var(--af-paper)" flip />
          <div style={wrapPS({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', paddingTop: 40, paddingBottom: 56 })}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)' }}>Butuh yang ada logo-nya?</h2>
              <p style={{ margin: '6px 0 0', fontSize: '0.9rem' }}>Semua produk di atas bisa dicetak custom dengan logo &amp; warna institusimu.</p>
            </div>
            <Button color="purple" size="lg" href="produk-custom.html">Lihat Custom &amp; Rapor →</Button>
          </div>
        </section>
      </main>
      <window.FooterV2 />
      <window.FloatingWAV2 />
      {open ? (
        <DetailSheet
          fam={open.fam}
          vi={open.vi}
          pos={navList.indexOf(open.fam)}
          total={navList.length}
          onClose={closeProduct}
          onStep={step}
          onVariant={(i) => goTo(open.fam.variants[i].slug)}
        />
      ) : null}
    </div>
  );
}

Object.assign(window, { ProdukStandarPage });
