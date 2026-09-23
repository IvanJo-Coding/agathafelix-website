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

  .af-sheet-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(43, 42, 40, .55);
    display: flex; align-items: center; justify-content: center; padding: 32px 24px;
    animation: af-fade 160ms ease-out; }
  .af-sheet { position: relative; width: min(980px, 100%); max-height: calc(100vh - 64px); max-height: calc(100dvh - 64px);
    display: flex; flex-direction: column; background: var(--af-paper); border: 2px solid var(--af-ink);
    border-radius: var(--radius-xl); box-shadow: 0 8px 0 var(--af-ink); overflow: hidden;
    animation: af-pop 220ms var(--ease-pop); }
  .af-sheet-top { display: flex; align-items: center; gap: 8px; padding: 10px 12px 10px 20px;
    border-bottom: 2px solid var(--af-ink); background: #fff; touch-action: none; }
  .af-sheet-grip { display: none; }
  .af-sheet-iconbtn { width: 44px; height: 44px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    background: #fff; color: var(--af-ink); border: 2px solid var(--af-ink); border-radius: 50%; cursor: pointer;
    box-shadow: 0 3px 0 var(--af-ink); font: inherit; }
  .af-sheet-iconbtn:active { transform: translateY(2px); box-shadow: 0 1px 0 var(--af-ink); }
  .af-sheet-iconbtn:disabled { opacity: .35; cursor: default; }
  .af-sheet-iconbtn svg { width: 20px; height: 20px; }
  .af-sheet-scroll { flex: 1; overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }
  .af-sheet-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 28px; padding: 24px; align-items: start; }
  .af-sheet-gallery { position: sticky; top: 0; display: flex; flex-direction: column; gap: 10px; }
  .af-sheet-track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
    border: 2px solid var(--af-ink); border-radius: var(--radius-lg); background: #f4ede1; }
  .af-sheet-track::-webkit-scrollbar { display: none; }
  .af-sheet-track img { flex: 0 0 100%; width: 100%; aspect-ratio: 1 / 1; max-height: 58vh; object-fit: contain; background: #fff; scroll-snap-align: center; }
  .af-sheet-thumbs { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 4px; margin: -4px; }
  .af-sheet-thumbs::-webkit-scrollbar { display: none; }
  .af-sheet-thumbs button { flex: 0 0 auto; width: 64px; height: 64px; padding: 0; overflow: hidden; cursor: pointer; background: #f4ede1;
    border: 2px solid var(--af-ink); border-radius: var(--radius-sm); opacity: .6; }
  .af-sheet-thumbs button[aria-current="true"] { opacity: 1; outline: 3px solid var(--af-green); outline-offset: 1px; }
  .af-sheet-thumbs img { width: 100%; height: 100%; object-fit: contain; background: #fff; }
  .af-sheet-body { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  .af-sheet-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-sheet-chip { display: inline-flex; align-items: center; gap: 6px; font-size: .78rem; font-weight: 700;
    border-radius: 999px; padding: 6px 12px; border: 1.5px solid; }
  .af-sheet-h { font-family: var(--font-display); font-weight: 800; font-size: .95rem; margin: 0 0 8px; color: var(--af-ink); }
  .af-sheet-variants { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-sheet-variants button { min-height: 40px; padding: 7px 16px; cursor: pointer; font-family: var(--font-display);
    font-weight: 800; font-size: .88rem; color: var(--af-ink); background: #fff; border: 2px solid var(--af-ink); border-radius: 999px; }
  .af-sheet-variants button[aria-pressed="true"] { background: var(--af-ink); color: #fff; box-shadow: 0 3px 0 var(--af-orange); }
  .af-sheet-swatches { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-sheet-swatch { width: 38px; height: 38px; padding: 0; cursor: pointer; border-radius: 50%; border: 2px solid var(--af-ink);
    display: flex; align-items: center; justify-content: center;
    background: repeating-conic-gradient(#dfe4e8 0 25%, #fff 0 50%) 50% / 10px 10px; }
  .af-sheet-swatch[aria-pressed="true"] { outline: 3px solid var(--af-blue); outline-offset: 2px; }
  .af-sheet-swatch svg { width: 16px; height: 16px; }
  .af-sheet-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .af-sheet-spec { background: #fff; border: 2px solid var(--af-ink); border-radius: var(--radius-md); padding: 10px 12px; }
  .af-sheet-foot { display: flex; gap: 10px; align-items: center; padding: 12px 20px; background: #fff;
    border-top: 2px solid var(--af-ink); }
  .af-sheet-foot .af-btn { flex: 1; min-width: 0; }
  @media (max-width: 350px) { .af-sheet-xs-hide { display: none; } }

  @media (max-width: 760px) {
    .af-sheet-backdrop { align-items: flex-end; padding: 0; }
    .af-sheet { width: 100%; max-height: 92vh; max-height: 92dvh; border-radius: 24px 24px 0 0;
      border-bottom: none; box-shadow: none; animation: af-rise 260ms cubic-bezier(.2, .9, .3, 1); }
    .af-sheet-top { position: relative; padding: 18px 12px 10px 16px; }
    .af-sheet-grip { display: block; position: absolute; top: 6px; left: 50%; width: 44px; height: 5px;
      margin-left: -22px; border-radius: 99px; background: var(--af-line, #EADFD2); }
    .af-sheet-grid { gap: 20px; padding: 18px; }
    .af-sheet-thumbs button { width: 52px; height: 52px; }
    .af-sheet-foot { padding: 10px 16px calc(10px + env(safe-area-inset-bottom)); }
    .af-sheet-foot .af-btn { padding: 14px 18px !important; font-size: .95rem !important; }
  }
  /* Portrait phones: photo on top, details below. From 560px up the sheet
     keeps photo and details side by side, so the photo never fills it. */
  @media (max-width: 559px) {
    .af-sheet-grid { grid-template-columns: 1fr; gap: 18px; padding: 16px; }
    .af-sheet-gallery { position: static; }
  }
  /* Landscape phones and short windows: use the whole screen, compact bars,
     photo beside the details and sized to the height that is left. */
  @media (max-height: 520px) {
    .af-sheet-backdrop { padding: 0; align-items: stretch; }
    .af-sheet { width: 100%; height: 100%; max-height: 100%; border: none; border-radius: 0; box-shadow: none;
      animation: af-fade 160ms ease-out; }
    .af-sheet-top { padding: 6px max(12px, env(safe-area-inset-right)) 6px max(16px, env(safe-area-inset-left)); }
    .af-sheet-grip { display: none; }
    .af-sheet-iconbtn { width: 38px; height: 38px; box-shadow: 0 2px 0 var(--af-ink); }
    .af-sheet-grid { grid-template-columns: minmax(0, .85fr) 1fr; gap: 18px;
      padding: 12px max(16px, env(safe-area-inset-right)) 16px max(16px, env(safe-area-inset-left)); }
    .af-sheet-gallery { position: sticky; top: 0; }
    .af-sheet-track img { aspect-ratio: auto; height: calc(100vh - 160px); height: calc(100dvh - 160px); min-height: 150px; max-height: none; }
    .af-sheet-thumbs { display: none; }
    .af-sheet-foot { padding: 6px max(16px, env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); }
    .af-sheet-foot .af-btn { padding: 10px 18px !important; font-size: .92rem !important; }
  }
  @keyframes af-fade { from { opacity: 0; } }
  @keyframes af-pop { from { opacity: 0; transform: scale(.96); } }
  @keyframes af-rise { from { transform: translateY(100%); } }
  @media (prefers-reduced-motion: reduce) {
    .af-sheet, .af-sheet-backdrop, .af-ps-card { animation: none !important; transition: none !important; }
  }`;
  document.head.appendChild(tag);
})();

function KatalogCard({ fam, eager, onOpen }) {
  const first = fam.variants[0];
  const types = fam.variants.map((v) => v.label).filter(Boolean);
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
        <span className="af-ps-more" style={{ marginTop: 'auto' }}>Lihat detail <span aria-hidden="true">→</span></span>
      </div>
    </a>
  );
}

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((path) => <path key={path} d={path} />)}
  </svg>
);

// Dark tick on light swatches, white tick on dark ones.
function isLight(hex) {
  if (!hex) return true;
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 160;
}

function DetailSheet({ fam, vi, pos, total, onClose, onStep, onVariant }) {
  const { Badge, Button, FAQItem } = DS2p;
  const v = fam.variants[vi];
  const [colourIdx, setColourIdx] = React.useState(null);
  const [slide, setSlide] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const sheetRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const drag = React.useRef(null);
  const colour = colourIdx === null ? v.colours[0] : v.colours[colourIdx];
  const imgs = gallery(fam, v, colour);
  const colourSlide = v.card ? 2 : 0;

  // A new product starts at its first photo and the top of its details;
  // a new type keeps the scroll position so the choice stays in view.
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [fam.slug]);
  React.useEffect(() => {
    setColourIdx(null);
    setSlide(0);
    setCopied(false);
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, [v.slug]);

  // Focus, Escape, a simple Tab loop, and no page scrolling behind the sheet.
  React.useEffect(() => {
    const previous = document.activeElement;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const close = sheetRef.current.querySelector('[data-close]');
    if (close) close.focus({ preventScroll: true });
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = [...sheetRef.current.querySelectorAll('a[href], button:not([disabled]), summary, [tabindex="0"]')];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      root.style.overflow = overflow;
      if (previous && previous.focus) previous.focus({ preventScroll: true });
    };
  }, []);

  function showSlide(i, smooth = true) {
    setSlide(i);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: i * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
  }
  function pickColour(i) {
    setColourIdx(i);
    showSlide(colourSlide);
  }

  // Drag the top bar down to dismiss (touch only; buttons keep their taps).
  function dragStart(e) {
    if (e.pointerType !== 'touch' || e.target.closest('button')) return;
    drag.current = { y: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    sheetRef.current.style.transition = 'none';
  }
  function dragMove(e) {
    if (!drag.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y);
    sheetRef.current.style.transform = `translateY(${drag.current.dy}px)`;
  }
  function dragEnd() {
    if (!drag.current) return;
    const { dy } = drag.current;
    drag.current = null;
    const sheet = sheetRef.current;
    sheet.style.transition = 'transform 200ms ease';
    if (dy > 110) { onClose(); return; }
    sheet.style.transform = '';
  }

  async function share() {
    const url = location.origin + location.pathname + '#' + v.slug;
    try {
      if (navigator.share) { await navigator.share({ title: fam.name + ' — Agatha Felix', url }); return; }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (_) { /* dismissed share sheet or blocked clipboard */ }
  }

  const chosen = colourIdx === null ? null : v.colours[colourIdx];
  const waText = `Halo Agatha Felix! Saya mau tanya harga grosir *${fam.name}*${v.title ? ' (' + v.title + ')' : ''}.`
    + `\nWarna: ${chosen ? chosen.name : ''}\nJumlah: \nKota tujuan: `;
  const chip = (c) => ({ color: `var(--af-${c}-deep)`, background: `var(--af-${c}-tint)`, borderColor: `var(--af-${c}-soft)` });

  return (
    <div className="af-sheet-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={sheetRef} className="af-sheet" role="dialog" aria-modal="true" aria-labelledby="af-sheet-title">
        <div className="af-sheet-top" onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnd} onPointerCancel={dragEnd}>
          <span className="af-sheet-grip" aria-hidden="true"></span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '.85rem', color: 'var(--text-muted)', marginRight: 'auto' }}>
            Produk {pos + 1} dari {total}
          </span>
          <button type="button" className="af-sheet-iconbtn" aria-label="Produk sebelumnya" disabled={total < 2} onClick={() => onStep(-1)}>
            <Icon d={['M15 18l-6-6 6-6']} />
          </button>
          <button type="button" className="af-sheet-iconbtn" aria-label="Produk berikutnya" disabled={total < 2} onClick={() => onStep(1)}>
            <Icon d={['M9 18l6-6-6-6']} />
          </button>
          <button type="button" className="af-sheet-iconbtn" data-close aria-label="Tutup detail" onClick={onClose} style={{ marginLeft: 6 }}>
            <Icon d={['M6 6l12 12', 'M18 6L6 18']} />
          </button>
        </div>

        <div className="af-sheet-scroll" ref={scrollRef}>
          <div className="af-sheet-grid">
            <div className="af-sheet-gallery">
              <div style={{ position: 'relative' }}>
                <div
                  className="af-sheet-track" ref={trackRef}
                  onScroll={(e) => {
                    const t = e.currentTarget;
                    const i = Math.round(t.scrollLeft / t.clientWidth);
                    if (i !== slide) setSlide(i);
                  }}
                >
                  {imgs.map(([src, alt], i) => <img key={src} src={src} alt={alt} decoding="async" loading={i ? 'lazy' : 'eager'} />)}
                </div>
                {imgs.length > 1 ? (
                  <span aria-hidden="true" style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(43,42,40,.75)', color: '#fff', borderRadius: 999, fontSize: 12, fontWeight: 700, padding: '3px 10px' }}>{slide + 1}/{imgs.length}</span>
                ) : null}
              </div>
              {imgs.length > 1 ? (
                <div className="af-sheet-thumbs">
                  {imgs.map(([src, alt], i) => (
                    <button key={src} type="button" aria-label={'Foto ' + (i + 1) + ': ' + alt} aria-current={i === slide} onClick={() => showSlide(i)}>
                      <img src={src} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

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
                          <svg viewBox="0 0 12 12" fill="none" stroke={isLight(c.hex) ? 'var(--af-ink)' : '#fff'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>
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
        </div>

        <div className="af-sheet-foot">
          <Button color="wa" size="lg" href={window.waLink(waText)} target="_blank" rel="noopener noreferrer">
            <window.WaGlyph2 /> <span>Tanya Harga<span className="af-sheet-xs-hide"> via WhatsApp</span></span>
          </Button>
          <button type="button" className="af-sheet-iconbtn" aria-label={copied ? 'Link disalin' : 'Bagikan produk ini'} title={copied ? 'Link disalin' : 'Bagikan'} onClick={share}>
            {copied ? <Icon d={['M20 6L9 17l-5-5']} /> : <Icon d={['M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7', 'M16 6l-4-4-4 4', 'M12 2v13']} />}
          </button>
        </div>
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
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 28 }}>
              Harga menyusul setelah konfirmasi jumlah — chat kami untuk daftar harga grosir terbaru 👇
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
