// Website v2 — Produk Custom: the six products schools usually order, each with
// an order-options sheet that sends a complete spec to WhatsApp. Options were
// confirmed by the owner on 2026-09-24; karton, busa and zipper tiers are the
// recommendations he accepted. Prices live in CustomHarga.jsx.
const DS2cp = window.AgathaFelixDesignSystem_3557c1;

const RI = '/raporsekolah/img/';        // real school orders, shared with /raporsekolah/
const PFC = '../../assets/portfolio/';
const KC = '../../assets/katalog/';
const PRC = '../../assets/products/';

const MOQ_PER_WARNA = 50;
const MAX_WARNA = 20;
const JUMLAH_CEPAT = [50, 100, 300, 500];
const WAKTU = ['Secepatnya (minggu ini)', 'Dalam 1 bulan', 'Untuk akhir semester ini', 'Masih survei harga dulu'];

// --- Option sets -------------------------------------------------------------
// o(id, label, extra): `rek` marks our recommendation, `uji` a finish we have
// never produced (shown as "konfirmasi dulu"), `noPrice` a choice that is
// always quoted by hand, `hex` a swatch colour, `img` a photo to jump to.
const o = (id, label, extra = {}) => ({ id, label, ...extra });
const HEX = {
  'abu-abu': '#8E9297', biru: '#1F5FD1', 'biru-tosca': '#22B0DE', hijau: '#1E8F52', 'hijau-1': '#37A55F',
  'hijau-2': '#23804D', 'hijau-stabilo': '#8CD41E', hitam: '#2B2A28', kuning: '#F2C318', merah: '#D9262C',
  'merah-maroon': '#7A2432', orange: '#F26A1B', pink: '#EC4F9A', 'putih-susu': '#F1EEE6', ungu: '#7040B0',
};
const NAMA_WARNA = {
  'abu-abu': 'Abu-abu', biru: 'Biru', 'biru-tosca': 'Biru Tosca', hijau: 'Hijau', 'hijau-1': 'Hijau 1', 'hijau-2': 'Hijau 2',
  'hijau-stabilo': 'Hijau Stabilo', hitam: 'Hitam', kuning: 'Kuning', merah: 'Merah', 'merah-maroon': 'Merah Maroon',
  orange: 'Orange', pink: 'Pink', 'putih-susu': 'Putih Susu', ungu: 'Ungu', bening: 'Bening',
};

const INNER_JUMLAH = ['20', '40', '60', '80', '100', '120'].map((n) => o(n, n));
INNER_JUMLAH.push(o('lain', 'Jumlah lain'));

const POLY = [
  o('emas', 'Emas', { hex: '#D4A93C' }), o('silver', 'Silver', { hex: '#C3C7CC' }), o('biru-tua', 'Biru tua', { hex: '#1F3A6E' }),
  o('putih', 'Putih', { hex: '#FFFFFF', uji: true }), o('hitam', 'Hitam', { hex: '#2B2A28', uji: true }),
  o('merah', 'Merah', { hex: '#C8282C', uji: true }), o('rose-gold', 'Rose gold', { hex: '#D8A48F', uji: true }),
  o('hologram', 'Hologram', { hex: 'holo', uji: true }),
];

// Clear Holder PP cover colours: the standard stock. Colours with a Clear
// Holder Folio photo jump to it, as an example of the PP shade.
const CH_FOTO = ['abu-abu', 'biru', 'biru-tosca', 'hijau', 'hijau-stabilo', 'hitam', 'kuning', 'merah', 'pink'];
const WARNA_PP = ['bening', 'putih-susu', 'abu-abu', 'hitam', 'biru', 'biru-tosca', 'hijau', 'hijau-stabilo', 'kuning', 'merah', 'pink', 'ungu']
  .map((k) => o(k, NAMA_WARNA[k], {
    hex: HEX[k] || null,
    img: CH_FOTO.includes(k) ? [KC + 'clear-holder-folio-warna-' + k + '.webp', 'Contoh warna sampul PP ' + NAMA_WARNA[k]] : null,
  }))
  .concat(o('lain', 'Warna lain', { hint: 'tulis di chat' }));

// Zipper Bag types = the standard catalogue types, with their stock colours.
const ZIPPER = [
  ['setengah-jaring', 'Jaring ½', 'biru hijau hitam kuning merah orange pink ungu'],
  ['tali-f4', 'Jaring ½ + Tali (F4)', 'biru hijau-1 hijau-2 hitam kuning merah-maroon orange pink ungu'],
  ['tali-a5', 'Jaring ½ + Tali (A5)', ''],
  ['namecard', 'Kancing + Name Card', 'biru hijau hijau-stabilo hitam merah orange pink ungu'],
  ['polos', 'Polos', 'biru hijau hitam kuning merah orange pink ungu'],
];
const ZIPPER_TIPE = ZIPPER.map(([k, label]) => o(k, label, { img: [KC + 'zipper-bag-' + k + '.webp', 'Zipper Bag tipe ' + label] }));
const ZIPPER_WARNA = Object.fromEntries(ZIPPER.map(([k, , keys]) => [k, (keys ? keys.split(' ') : []).map((c) => o(c, NAMA_WARNA[c], {
  hex: HEX[c], img: [KC + 'zipper-bag-' + k + '-warna-' + c + '.webp', 'Zipper Bag ' + NAMA_WARNA[c]],
})).concat(o('lain', keys ? 'Warna lain' : 'Tanya warna tersedia', { hint: 'tulis di chat' }))]));

// --- Fields ------------------------------------------------------------------
// type: 'pilih' (one chip), 'multi' (several chips), 'teks' (free text).
// group: where it sits in the sheet. priced: false = never changes the price.
// when(sel) hides a field; an option's hide(sel) hides that choice.
const innerCount = (sel) => (sel['inner-jumlah'] === 'lain' ? Number(sel['inner-jumlah-lain']) || 0 : Number(sel['inner-jumlah']) || 0);
// 4-ring D binder sized by sheet count (estimate from standard D-ring
// capacities; verify with a filled sample).
const ringSize = (n) => (n > 120 ? '2 inci' : n > 60 ? '1,5 inci' : '1 inci');

const F = {
  ukuran: { id: 'ukuran', group: 'model', label: 'Ukuran', def: 'f4', options: [
    o('a4', 'A4', { hint: 'muat kertas A4' }), o('f4', 'F4 / Folio', { hint: 'muat kertas F4', rek: true }),
    o('lain', 'Ukuran lain', { hint: 'tulis di chat', noPrice: true }),
  ] },
  bahan: { id: 'bahan', group: 'model', label: 'Bahan sampul', options: [
    o('tpk-urat', 'TPK tekstur urat'), o('tpk-pasir', 'TPK tekstur pasir'),
    o('linen', 'Linen tekstur pasir', { hide: (s) => s.konstruksi === 'jahit' }),
  ], hint: (s) => (s.bahan === 'linen' ? 'Linen tidak bisa dijahit dan tidak bisa pakai busa.' : '') },
  warnaSampul: { id: 'warna-sampul', group: 'model', label: 'Warna sampul', type: 'teks', priced: false,
    placeholder: 'cth: navy, maroon, hijau botol', hint: () => 'Warna bebas. Kirim contoh atau kode warnanya di chat.' },
  benang: { id: 'benang', group: 'model', label: 'Warna benang jahit', priced: false, when: (s) => s.konstruksi === 'jahit', options: [
    o('senada', 'Senada dengan sampul'), o('emas', 'Emas'), o('putih', 'Putih'), o('hitam', 'Hitam'), o('lain', 'Warna lain', { hint: 'tulis di chat' }),
  ] },
  poly: { id: 'poly', group: 'finishing', label: 'Warna poly logo', options: POLY,
    hint: (s) => {
      const pick = POLY.find((p) => p.id === s.poly);
      return pick && pick.uji ? 'Warna poly ini belum pernah kami produksi. Kami konfirmasi dulu hasilnya lewat WhatsApp.' : 'Emas, silver, dan biru tua sudah biasa kami produksi.';
    } },
  resleting: { id: 'resleting', group: 'finishing', label: 'Resleting', options: [
    o('nilon', 'Nilon spiral', { hint: 'paling ekonomis' }), o('plastik', 'Plastik gigi besar'),
    o('logam', 'Logam nikel / kuningan'), o('premium', 'Logam premium + tarikan berlogo', { hint: 'paling eksklusif' }),
  ] },
  siku: { id: 'siku', group: 'finishing', label: 'Siku besi', def: 'tanpa', options: [
    o('tanpa', 'Tanpa siku'), o('emas-rounded', 'Emas · rounded'), o('emas-lancip', 'Emas · lancip'),
    o('silver-rounded', 'Silver · rounded'), o('silver-lancip', 'Silver · lancip'),
  ] },
  innerTipe: { id: 'inner-tipe', group: 'isi', label: 'Plastik inner', options: [o('mika', 'Plastik mika'), o('pp-bening', 'PP bening')] },
  innerJumlah: { id: 'inner-jumlah', group: 'isi', label: 'Jumlah inner', unit: 'lembar', options: INNER_JUMLAH, other: 'inner-jumlah-lain' },
  punggung: { id: 'punggung', group: 'isi', label: 'Punggung', def: 'press', options: [
    o('press', 'Press biasa'), o('ring', 'Ring D 4-ring'),
  ], hint: (s) => {
    const n = innerCount(s);
    if (s.punggung === 'ring') return 'Ring ' + ringSize(n) + '. Inner berupa plastik lepas berlubang, bisa ditambah atau dilepas.';
    return n > 100 ? 'Isi lebih dari 100 lembar: kami sarankan ring binder, supaya punggungnya lebih lebar.' : '';
  } },
  jendela: { id: 'jendela', group: 'tambahan', label: 'Jendela nama', def: 'tanpa', options: [o('tanpa', 'Tanpa'), o('pakai', 'Pakai jendela nama')] },
  kantong: { id: 'kantong', group: 'tambahan', label: 'Kantong dalam', def: 'tanpa', options: [o('tanpa', 'Tanpa'), o('pakai', 'Pakai kantong dalam')] },
  karton: { id: 'karton', group: 'lanjutan', label: 'Tebal karton', def: 'k2', options: [
    o('k15', '1,5 mm'), o('k2', '2 mm', { rek: true }), o('k25', '2,5 mm'), o('k3', '3 mm'),
  ], hint: () => '2 mm untuk isi 20–60 lembar; 2,5–3 mm untuk 80 lembar ke atas atau ring binder.' },
  busa: { id: 'busa', group: 'lanjutan', label: 'Tebal busa', def: 'b3', options: [
    o('tanpa', 'Tanpa busa'),
    o('b2', '2 mm', { hide: (s) => s.bahan === 'linen' }), o('b3', '3 mm', { rek: true, hide: (s) => s.bahan === 'linen' }),
    o('b5', '5 mm', { hide: (s) => s.bahan === 'linen' }),
  ] },
  warnaPP: { id: 'warna-pp', group: 'model', label: 'Warna sampul PP', priced: false, options: WARNA_PP },
  zipperTipe: { id: 'tipe', group: 'model', label: 'Tipe zipper bag', options: ZIPPER_TIPE },
  zipperWarna: { id: 'warna-zipper', group: 'model', label: 'Warna zipper bag', priced: false,
    optionsFor: (s) => ZIPPER_WARNA[s.tipe] || [], when: (s) => !!s.tipe },
  metode: { id: 'metode', group: 'finishing', label: 'Cara cetak', def: 'rekomendasi', options: [
    o('rekomendasi', 'Rekomendasikan untuk saya', { rek: true, noPrice: true }), o('sablon', 'Sablon'), o('dtf', 'DTF'), o('uv', 'UV'),
  ], hint: () => 'Kami sarankan yang paling cocok dengan desain dan posisi cetaknya.' },
  sisi: { id: 'sisi', group: 'finishing', label: 'Sisi yang dicetak', type: 'multi', def: ['depan'], options: [
    o('depan', 'Depan'), o('belakang', 'Belakang'), o('samping', 'Samping'),
  ] },
  warnaCetak: { id: 'warna-cetak', group: 'finishing', label: 'Warna cetak', options: [
    o('full', 'Full color'), o('w1', '1 warna'), o('w2', '2 warna'), o('w3', '3 warna atau lebih'),
  ] },
};

const MAP_ISI = [F.innerTipe, F.innerJumlah, F.punggung, F.jendela, F.kantong, F.karton, F.busa];
const FILE_LOGO = 'Logo dan desain sampul saya kirim di chat ini untuk dibuatkan mockup.';

const CUSTOM_PRODUK = [
  {
    slug: 'map-jahit', name: 'Map Jahit', color: 'purple', fixed: { konstruksi: 'jahit' }, dasarKey: 'ukuran',
    desc: 'Tepi sampul dijahit rapi, logo di-poly. Pilihan favorit untuk rapor dan ijazah sekolah.',
    fields: [F.ukuran, F.bahan, F.warnaSampul, F.benang, F.poly, F.siku, ...MAP_ISI],
    fileNote: FILE_LOGO, simulator: true,
    photos: [
      [RI + 'jahit-hero.webp', 'Map jahit abu-abu SMAK 6 Penabur Jakarta dengan logo poly emas'],
      [RI + 'jahit-navy.webp', 'Map jahit navy SMAK 5 Penabur Jakarta dengan siku besi'],
      [RI + 'jahit-red.webp', 'Map jahit maroon SMAK 1 Penabur Jakarta'],
      [PFC + 'rapor-penabur-jahit-1.png', 'Map jahit kuning SMPK Penabur Bintaro Jaya'],
      [RI + 'detail-corner.webp', 'Detail jahitan dan siku besi emas'],
    ],
  },
  {
    slug: 'map-press', name: 'Map Press', color: 'orange', fixed: { konstruksi: 'press' }, dasarKey: 'ukuran',
    desc: 'Sampul di-press rapat tanpa jahitan, logo dan tulisan di-poly. Tampilan resmi dan rapi.',
    fields: [F.ukuran, F.bahan, F.warnaSampul, F.poly, F.siku, ...MAP_ISI],
    fileNote: FILE_LOGO, simulator: true,
    photos: [
      [RI + 'press-hero.webp', 'Map press navy SMAK Penabur Kota Tangerang dengan poly emas'],
      [RI + 'almasnuniyah.webp', 'Map press hijau tua SDI Al Masnuniyah dengan poly emas'],
      [PFC + 'rapor-press-evergreen.png', 'Map press SMP Evergreen Education dengan poly emas'],
      [RI + 'stack-alazhar.webp', 'Sampul ijazah Al-Azhar Kelapa Gading dalam lima warna'],
      [RI + 'stack-cikeas.webp', 'Sampul ijazah Sekolah Alam Cikeas dalam lima warna'],
      [PFC + 'rapor-press-open.png', 'Bagian dalam map dengan inner plastik'],
    ],
  },
  {
    slug: 'map-executive', name: 'Map Executive', color: 'blue', fixed: { konstruksi: 'jahit' }, dasarKey: 'ukuran',
    desc: 'Map premium yang dijahit dan ditutup resleting, untuk sertifikat, akta, dan dokumen penting.',
    fields: [F.ukuran, F.bahan, F.warnaSampul, F.benang, F.poly, F.resleting, F.siku, ...MAP_ISI],
    fileNote: FILE_LOGO,
    photos: [
      [PRC + 'map-executive.png', 'Map executive biru dan merah dengan poly emas'],
      ['../../assets/document-keeper-green.png', 'Map executive hijau tua dengan poly emas'],
      [KC + 'dokumen-keeper-foto-2.webp', 'Map executive hitam, biru, dan merah'],
      [RI + 'detail-zipper.webp', 'Detail resleting logam'],
    ],
  },
  {
    slug: 'clear-holder-poly', name: 'Clear Holder Poly', color: 'green', dasarKey: 'ukuran',
    desc: 'Clear holder bersampul plastik PP dengan logo di-poly. Warna sampul bisa dipilih.',
    fields: [F.ukuran, F.warnaPP, F.poly, F.innerTipe, F.innerJumlah, F.jendela],
    fileNote: FILE_LOGO,
    photos: [
      [RI + 'clearholder.webp', 'Clear holder kuning SMPK 3 Penabur Jakarta dengan logo poly biru tua'],
      [PRC + 'clear-holder.png', 'Pilihan warna sampul PP'],
    ],
  },
  {
    slug: 'clear-holder-print', name: 'Clear Holder Full Printing', color: 'orange', dasarKey: 'ukuran',
    desc: 'Sampul clear holder dicetak penuh sesuai desain Anda: foto, gambar, atau warna brand.',
    fields: [F.ukuran, { ...F.warnaPP, label: 'Warna dasar PP', hint: () => 'Untuk bagian yang tidak tercetak.' }, F.innerTipe, F.innerJumlah, F.jendela],
    fileNote: 'File desain saya kirim di chat ini untuk disesuaikan dan di-test print.',
    mustSendDesign: true,
    photos: [
      [PFC + 'clearholder-symphonia.png', 'Clear holder full printing Symphonia, Summarecon Serpong'],
      [PFC + 'clearholder-permata.png', 'Clear holder full printing PermataBank KPR'],
    ],
  },
  {
    slug: 'zipper-bag-print', name: 'Zipper Bag Custom Printing', color: 'purple', dasarKey: 'tipe',
    desc: 'Pilih tipe zipper bag dari produk standar kami, lalu kami cetak logo atau desain Anda.',
    fields: [F.zipperTipe, F.zipperWarna, F.metode, F.sisi, F.warnaCetak, F.jendela],
    fileNote: 'Logo atau desain cetak saya kirim di chat ini.',
    photos: [
      [PFC + 'zipperbag-robotics.png', 'Zipper bag cetak logo Robotics Education Center'],
    ],
  },
];

const CUSTOM_GROUPS = [
  ['model', 'Model & sampul'], ['finishing', 'Logo & finishing'], ['isi', 'Isi map'], ['tambahan', 'Tambahan'],
];

// --- Pure helpers (also used by test.mjs) --------------------------------------
const optionsOf = (f, sel) => (f.optionsFor ? f.optionsFor(sel) : f.options || []).filter((op) => !(op.hide && op.hide(sel)));

// The effective selection: product-fixed values, then defaults, and any choice
// that is no longer available (e.g. busa after picking linen) falls back
// without being forgotten, so switching back restores it.
function customSel(p, raw) {
  const sel = { ...raw, ...(p.fixed || {}) };
  for (const f of p.fields) {
    if (f.type === 'teks') continue;
    const opts = optionsOf(f, sel);
    if (f.type === 'multi') {
      const v = (sel[f.id] || f.def || []).filter((id) => opts.some((op) => op.id === id));
      sel[f.id] = v;
      continue;
    }
    if (sel[f.id] !== undefined && opts.some((op) => op.id === sel[f.id])) continue;
    if (f.def !== undefined && opts.some((op) => op.id === f.def)) sel[f.id] = f.def;
    else if (opts.length === 1) sel[f.id] = opts[0].id;
    else delete sel[f.id];
  }
  return sel;
}
const visibleFields = (p, sel) => p.fields.filter((f) => !(f.when && !f.when(sel)));

function describeField(f, sel) {
  if (f.type === 'teks') return (sel[f.id] || '').trim();
  const opts = optionsOf(f, sel);
  const label = (id) => {
    const op = opts.find((x) => x.id === id);
    if (!op) return '';
    if (f.other && id === 'lain') {
      const n = (sel[f.other] || '').toString().trim();
      return n ? n + (f.unit ? ' ' + f.unit : '') : 'jumlah lain (saya jelaskan di chat)';
    }
    let t = op.label + (f.unit ? ' ' + f.unit : '');
    if (op.uji) t += ' (mohon dikonfirmasi)';
    if (op.id === 'lain' && !f.other) t += ' (saya jelaskan di chat)';
    return t;
  };
  if (f.type === 'multi') return (sel[f.id] || []).map(label).filter(Boolean).join(', ');
  let t = label(sel[f.id]);
  if (t && f.id === 'punggung' && sel.punggung === 'ring') t += ' (' + ringSize(innerCount(sel)) + ', inner plastik lepas berlubang)';
  return t;
}

function pesanCustom(p, raw, jumlah, warnaCount, info = {}) {
  const sel = customSel(p, raw);
  const lines = ['Halo Agatha Felix! Saya mau minta penawaran *' + p.name + '*.', '', 'Spesifikasi:'];
  for (const f of visibleFields(p, sel)) {
    if (f.group === 'tambahan' && sel[f.id] === 'tanpa') continue;   // add-ons not taken
    const v = describeField(f, sel);
    if (v) lines.push('- ' + f.label + ': ' + v);
  }
  lines.push('', 'Jumlah: ' + jumlah + ' pcs' + (warnaCount > 1 ? ' (' + warnaCount + ' warna, minimal 50 pcs per warna)' : ''));
  if (info.sekolah && info.sekolah.trim()) lines.push('Sekolah / instansi: ' + info.sekolah.trim());
  if (info.kota && info.kota.trim()) lines.push('Kota pengiriman: ' + info.kota.trim());
  if (info.waktu) lines.push('Dibutuhkan: ' + info.waktu);
  lines.push('', p.fileNote);
  return lines.join('\n');
}

// Price estimate from CustomHarga.jsx. Returns null until every number it needs
// is filled in: the base price for the size/type and quantity tier, and the
// add-on of every priced option chosen. A "lain" choice is always quoted by hand.
function perkiraanCustom(p, raw, jumlah, harga) {
  const table = harga && harga[p.slug];
  if (!table || !table.dasar) return null;
  const sel = customSel(p, raw);
  const row = table.dasar[sel[p.dasarKey]];
  if (!row) return null;
  const tier = Object.keys(row).map(Number).filter((t) => t <= jumlah).sort((a, b) => b - a)[0];
  let perPcs = tier === undefined ? null : row[tier];
  if (typeof perPcs !== 'number') return null;
  for (const f of visibleFields(p, sel)) {
    if (f.id === p.dasarKey || f.type === 'teks' || f.priced === false) continue;
    const ids = f.type === 'multi' ? sel[f.id] || [] : [sel[f.id]];
    for (const id of ids) {
      const op = optionsOf(f, sel).find((x) => x.id === id);
      if (!op || op.noPrice || id === 'lain') return null;
      const add = table.tambahan && table.tambahan[f.id] && table.tambahan[f.id][id];
      if (typeof add !== 'number') return null;
      perPcs += add;
    }
  }
  const sekali = Object.values(table.sekaliBayar || {}).filter((n) => typeof n === 'number').reduce((a, b) => a + b, 0);
  return { perPcs, sekali, total: perPcs * jumlah + sekali };
}

// Photos: the product's first photo, then whatever the latest choices point
// to (zipper type, colour), then the rest.
function galleryCustom(p, sel) {
  const picked = [];
  for (const f of visibleFields(p, sel)) {
    if (f.type === 'teks' || f.type === 'multi') continue;
    const op = optionsOf(f, sel).find((x) => x.id === sel[f.id]);
    if (op && op.img) picked.push(op.img);
  }
  return [p.photos[0], ...picked, ...p.photos.slice(1)];
}

const rupiah = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

// --- Styles --------------------------------------------------------------------
const CP_CSS_ID = 'af-custom-produk';
(function injectCpCss() {
  if (typeof document === 'undefined' || document.getElementById(CP_CSS_ID)) return;
  const tag = document.createElement('style');
  tag.id = CP_CSS_ID;
  tag.textContent = `
  .af-cp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .af-cp-card { display: flex; flex-direction: column; overflow: hidden; background: #fff; color: inherit; text-decoration: none;
    border: 2px solid var(--af-ink); border-radius: var(--radius-lg); box-shadow: 0 5px 0 var(--af-ink); transition: transform 220ms var(--ease-pop); }
  @media (hover: hover) { .af-cp-card:hover { transform: translateY(-5px) rotate(-.6deg); } }
  .af-cp-card:active { transform: translateY(2px); box-shadow: 0 3px 0 var(--af-ink); }
  .af-cp-card:focus-visible { outline: 3px solid var(--af-blue); outline-offset: 3px; }
  .af-cp-img { aspect-ratio: 4 / 3; background: #f4ede1; border-bottom: 2px solid var(--af-ink); position: relative; }
  .af-cp-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .af-cp-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
  .af-cp-meta { margin-top: auto; padding-top: 6px; display: flex; align-items: center; justify-content: space-between; gap: 8px;
    font-family: var(--font-display); font-weight: 800; font-size: .8rem; }
  .af-cp-other { margin-top: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
    background: #fff; border: 2px dashed var(--af-ink); border-radius: var(--radius-lg); padding: 18px 20px; }
  @media (max-width: 680px) {
    .af-cp-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .af-cp-card { border-radius: var(--radius-md); box-shadow: 0 4px 0 var(--af-ink); }
    .af-cp-img { aspect-ratio: 1 / 1; }
    .af-cp-body { padding: 10px 11px 12px; gap: 4px; }
    .af-cp-body h3 { font-size: .95rem !important; }
    .af-cp-desc { display: none; }
    .af-cp-meta { flex-direction: column; align-items: flex-start; gap: 2px; font-size: .74rem; }
    .af-cp-other { padding: 16px; }
    .af-cp-other .af-btn { width: 100%; }
  }

  .af-cp-group { display: flex; flex-direction: column; gap: 14px; padding-top: 16px; border-top: 2px solid var(--af-line, #EADFD2); }
  .af-cp-group > h3 { font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; margin: 0; }
  .af-cp-field-h { font-family: var(--font-display); font-weight: 800; font-size: .9rem; margin: 0 0 8px; color: var(--af-ink); }
  .af-cp-field-h span { color: var(--text-muted); font-weight: 700; }
  .af-opts { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-opt { min-height: 40px; padding: 7px 14px; display: inline-flex; align-items: center; gap: 7px; cursor: pointer;
    font-family: var(--font-display); font-weight: 800; font-size: .86rem; color: var(--af-ink); text-align: left;
    background: #fff; border: 2px solid var(--af-ink); border-radius: 999px; }
  .af-opt[aria-pressed="true"] { background: var(--af-ink); color: #fff; box-shadow: 0 3px 0 var(--af-orange); }
  .af-opt-dot { width: 14px; height: 14px; flex-shrink: 0; border-radius: 50%; border: 1.5px solid rgba(43, 42, 40, .35);
    background: repeating-conic-gradient(#dfe4e8 0 25%, #fff 0 50%) 50% / 8px 8px; }
  .af-opt[aria-pressed="true"] .af-opt-dot { border-color: rgba(255, 255, 255, .7); }
  .af-opt-tag { font-family: var(--font-body); font-size: .6rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
    padding: 2px 6px; border-radius: 999px; background: var(--af-green-soft); color: var(--af-green-deep); }
  .af-opt-tag.uji { background: var(--af-yellow-soft); color: var(--af-yellow-deep); }
  .af-cp-hint { font-size: .78rem; line-height: 1.5; color: var(--text-muted); margin: 6px 0 0; }
  .af-cp-note { font-size: .82rem; line-height: 1.55; margin: 0; padding: 10px 12px; border-radius: 12px;
    background: var(--af-yellow-tint); border: 1.5px solid var(--af-yellow-soft); color: var(--af-ink); }
  .af-cp-other-input { margin-top: 8px; max-width: 200px; }
  .af-step { display: inline-flex; align-items: center; background: #fff; border: 2px solid var(--af-ink); border-radius: 999px; overflow: hidden; }
  .af-step button { width: 44px; height: 42px; border: none; background: none; cursor: pointer; font: 800 1.2rem var(--font-display); color: var(--af-ink); }
  .af-step button:disabled { opacity: .3; cursor: default; }
  .af-step input { width: 72px; height: 42px; border: none; border-left: 2px solid var(--af-ink); border-right: 2px solid var(--af-ink);
    text-align: center; font: 800 1rem var(--font-display); color: var(--af-ink); background: #fff; -moz-appearance: textfield; }
  .af-step input::-webkit-outer-spin-button, .af-step input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .af-cp-details { border-top: 2px solid var(--af-line, #EADFD2); padding-top: 14px; }
  .af-cp-details > summary { cursor: pointer; font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; list-style: none;
    display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .af-cp-details > summary::-webkit-details-marker { display: none; }
  .af-cp-details > summary small { font-family: var(--font-body); font-weight: 600; font-size: .78rem; color: var(--text-muted); }
  .af-cp-details[open] > summary { margin-bottom: 14px; }
  .af-cp-est { border: 2px solid var(--af-ink); border-radius: var(--radius-md); background: #fff; padding: 12px 14px; }
  .af-cp-est strong { font-family: var(--font-display); font-size: 1.25rem; }
  .af-cp-info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 559px) { .af-cp-info { grid-template-columns: 1fr; } }`;
  document.head.appendChild(tag);
})();

// --- Components ------------------------------------------------------------------
function CustomCard({ p, onOpen }) {
  return (
    <a
      href={'#custom-' + p.slug} className="af-cp-card" aria-haspopup="dialog"
      onClick={(e) => { if (e.ctrlKey || e.metaKey || e.shiftKey) return; e.preventDefault(); onOpen(); }}
    >
      <div className="af-cp-img"><img src={p.photos[0][0]} alt={p.photos[0][1]} loading="lazy" decoding="async" /></div>
      <div className="af-cp-body">
        <h3 style={{ fontSize: '1.15rem' }}>{p.name}</h3>
        <p className="af-cp-desc" style={{ margin: 0, fontSize: '.82rem', lineHeight: 1.55, color: 'var(--text-body)' }}>{p.desc}</p>
        <div className="af-cp-meta">
          <span style={{ color: `var(--af-${p.color}-deep)` }}>Min. 50 pcs</span>
          <span>Pilih spesifikasi <span aria-hidden="true">→</span></span>
        </div>
      </div>
    </a>
  );
}

function OptionChips({ f, sel, onPick }) {
  const opts = optionsOf(f, sel);
  const on = (id) => (f.type === 'multi' ? (sel[f.id] || []).includes(id) : sel[f.id] === id);
  // Finishes we have never produced sit in their own row under one caption,
  // instead of a "konfirmasi" tag on every chip.
  const proven = opts.filter((op) => !op.uji);
  const untested = opts.filter((op) => op.uji);
  const chip = (op) => (
    <button key={op.id} type="button" className="af-opt" aria-pressed={on(op.id)} title={op.hint || undefined} onClick={() => onPick(f, op)}>
      {op.hex !== undefined ? (
        <span className="af-opt-dot" aria-hidden="true" style={op.hex === 'holo'
          ? { background: 'linear-gradient(135deg, #f6c1d7, #b9e4f7, #fbe7a1, #c9b6f2)' }
          : op.hex ? { background: op.hex } : undefined}></span>
      ) : null}
      {op.label}
      {op.rek ? <span className="af-opt-tag">Saran</span> : null}
    </button>
  );
  if (untested.length) {
    return (
      <div role="group" aria-label={f.label}>
        <div className="af-opts">{proven.map(chip)}</div>
        <div className="af-cp-hint" style={{ margin: '10px 0 6px' }}>Belum pernah kami produksi, konfirmasi dulu:</div>
        <div className="af-opts">{untested.map(chip)}</div>
      </div>
    );
  }
  return (
    <div className="af-opts" role="group" aria-label={f.label}>{opts.map(chip)}</div>
  );
}

function CustomField({ f, sel, raw, setRaw, onPick }) {
  const { Input } = DS2cp;
  const value = describeField(f, sel);
  const hint = f.hint ? f.hint(sel) : '';
  return (
    <div>
      <div className="af-cp-field-h">
        {f.label}
        {f.type !== 'teks' && value ? <span> · {value}</span> : null}
      </div>
      {f.type === 'teks' ? (
        <Input aria-label={f.label} placeholder={f.placeholder} value={raw[f.id] || ''} onChange={(e) => setRaw({ ...raw, [f.id]: e.target.value })} />
      ) : (
        <OptionChips f={f} sel={sel} onPick={onPick} />
      )}
      {f.other && sel[f.id] === 'lain' ? (
        <div className="af-cp-other-input">
          <Input aria-label={f.label + ' lainnya'} inputMode="numeric" placeholder={'cth: 150 ' + (f.unit || '')}
            value={raw[f.other] || ''} onChange={(e) => setRaw({ ...raw, [f.other]: e.target.value.replace(/[^0-9]/g, '') })} />
        </div>
      ) : null}
      {hint ? <p className="af-cp-hint">{hint}</p> : null}
    </div>
  );
}

function Stepper({ label, value, min, max = Infinity, step, onChange }) {
  const [text, setText] = React.useState(String(value));
  React.useEffect(() => setText(String(value)), [value]);
  // Always rewrite the field with the corrected number: when a typed value is
  // raised to the minimum the state may not change (50 stays 50), so the
  // effect above would not fire and the field would keep showing "25".
  const commit = (n) => {
    // Both bounds are applied here, so the field always shows the stored value.
    const v = Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
    setText(String(v));
    onChange(v);
  };
  return (
    <div className="af-step">
      <button type="button" aria-label={label + ' kurangi'} disabled={value <= min} onClick={() => commit(value - step)}>−</button>
      <input aria-label={label} inputMode="numeric" value={text}
        onChange={(e) => setText(e.target.value.replace(/[^0-9]/g, ''))}
        onBlur={() => commit(parseInt(text, 10))}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
      <button type="button" aria-label={label + ' tambah'} disabled={value >= max} onClick={() => commit(value + step)}>+</button>
    </div>
  );
}

function CustomSheet({ p, pos, total, onClose, onStep, onLeaveTo }) {
  const { Badge, Button, Select, Input } = DS2cp;
  const [raw, setRaw] = React.useState({});
  const [warnaCount, setWarnaCount] = React.useState(1);
  const [jumlah, setJumlah] = React.useState(100);
  const [info, setInfo] = React.useState({ sekolah: '', kota: '', waktu: '' });
  const [slide, setSlide] = React.useState(0);

  React.useEffect(() => { setRaw({}); setSlide(0); }, [p.slug]);

  const sel = customSel(p, raw);
  const imgs = galleryCustom(p, sel);
  const minJumlah = MOQ_PER_WARNA * warnaCount;
  const est = perkiraanCustom(p, raw, jumlah, window.HARGA_CUSTOM);

  function pick(f, op) {
    let next;
    if (f.type === 'multi') {
      const cur = sel[f.id] || [];
      const v = cur.includes(op.id) ? cur.filter((x) => x !== op.id) : [...cur, op.id];
      next = { ...raw, [f.id]: v.length ? v : cur };
    } else {
      next = { ...raw, [f.id]: op.id };
    }
    setRaw(next);
    const g = galleryCustom(p, customSel(p, next));
    const at = op.img ? g.findIndex(([src]) => src === op.img[0]) : -1;
    setSlide(at >= 0 ? at : Math.min(slide, g.length - 1));
  }
  function setWarna(n) {
    const v = Math.max(1, Math.min(MAX_WARNA, n));
    setWarnaCount(v);
    if (jumlah < MOQ_PER_WARNA * v) setJumlah(MOQ_PER_WARNA * v);
  }

  const fields = visibleFields(p, sel);
  const byGroup = (g) => fields.filter((f) => f.group === g);
  const lanjutan = byGroup('lanjutan');
  const waText = pesanCustom(p, raw, Math.max(jumlah, minJumlah), warnaCount, info);
  const waLain = 'Halo Agatha Felix! Saya tertarik ' + p.name + ', tapi modelnya berbeda dari pilihan di website. Saya kirim foto contohnya di chat ini.';

  return (
    <window.AfSheet
      pos={pos} total={total} onClose={onClose} onStep={onStep} resetKey={p.slug}
      footer={<>
        <Button color="wa" size="lg" href={window.waLink(waText)} target="_blank" rel="noopener noreferrer">
          <window.WaGlyph2 /> <span>Minta Penawaran<span className="af-sheet-xs-hide"> via WhatsApp</span></span>
        </Button>
        <window.AfShareButton url={location.origin + location.pathname + '#custom-' + p.slug} title={p.name + ' — Agatha Felix'} />
      </>}
    >
      <div className="af-sheet-grid">
        <window.AfGallery imgs={imgs} slide={Math.min(slide, imgs.length - 1)} onSlide={setSlide} fit="cover" />

        <div className="af-sheet-body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge color={p.color}>Produk Custom</Badge>
            <Badge color="green" dot>Mockup gratis</Badge>
          </div>
          <div>
            <h2 id="af-sheet-title" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)' }}>{p.name}</h2>
            <p style={{ margin: '8px 0 0', fontSize: '.95rem', lineHeight: 1.7, color: 'var(--text-body)' }}>{p.desc}</p>
          </div>
          <p className="af-cp-note">
            {p.mustSendDesign
              ? 'Wajib kirim file desain: kami sesuaikan dan test print dulu, produksi setelah Anda setujui.'
              : 'Pilih yang Anda tahu saja, sisanya bisa ditanyakan di chat. Kami kirim mockup gratis dulu, produksi setelah Anda setujui.'}
          </p>

          {CUSTOM_GROUPS.map(([g, title]) => {
            const list = byGroup(g);
            if (!list.length) return null;
            return (
              // divs, not <section>: Shell's phone rule "main section > div"
              // would pad every field by 48px.
              <div key={g} className="af-cp-group" role="group" aria-label={title}>
                <h3>{title}</h3>
                {list.map((f) => <CustomField key={f.id} f={f} sel={sel} raw={raw} setRaw={setRaw} onPick={pick} />)}
              </div>
            );
          })}

          {lanjutan.length ? (
            <details className="af-cp-details">
              <summary>Detail lanjutan <small>sudah kami pilihkan yang standar</small></summary>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {lanjutan.map((f) => <CustomField key={f.id} f={f} sel={sel} raw={raw} setRaw={setRaw} onPick={pick} />)}
              </div>
            </details>
          ) : null}

          <div className="af-cp-group" role="group" aria-label="Jumlah">
            <h3>Jumlah</h3>
            <div>
              <div className="af-cp-field-h">Berapa warna sampul?</div>
              <Stepper label="Jumlah warna" value={warnaCount} min={1} max={MAX_WARNA} step={1} onChange={setWarna} />
              <p className="af-cp-hint">Setiap warna minimal 50 pcs{warnaCount > 1 ? ', jadi ' + warnaCount + ' warna minimal ' + minJumlah + ' pcs.' : '.'}</p>
            </div>
            <div>
              <div className="af-cp-field-h">Jumlah pesanan (pcs)</div>
              <Stepper label="Jumlah pesanan" value={jumlah} min={minJumlah} step={MOQ_PER_WARNA} onChange={setJumlah} />
              <div className="af-opts" style={{ marginTop: 10 }}>
                {JUMLAH_CEPAT.filter((n) => n >= minJumlah).map((n) => (
                  <button key={n} type="button" className="af-opt" aria-pressed={jumlah === n} onClick={() => setJumlah(n)}>
                    {n} pcs{n === 100 ? <span className="af-opt-tag">Saran</span> : null}
                  </button>
                ))}
              </div>
              <p className="af-cp-hint">Disarankan 100 pcs agar harga per pcs lebih ekonomis.</p>
            </div>
          </div>

          <div className="af-cp-group" role="group" aria-label="Data pesanan">
            <h3>Data pesanan <small style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '.78rem', color: 'var(--text-muted)' }}>opsional</small></h3>
            <div className="af-cp-info">
              <Input label="Sekolah / instansi" placeholder="cth: SDIT Al-Furqon" value={info.sekolah} onChange={(e) => setInfo({ ...info, sekolah: e.target.value })} />
              <Input label="Kota pengiriman" placeholder="cth: Bekasi" value={info.kota} onChange={(e) => setInfo({ ...info, kota: e.target.value })} />
            </div>
            <Select label="Kapan dibutuhkan" value={info.waktu} onChange={(e) => setInfo({ ...info, waktu: e.target.value })}>
              <option value="">Pilih perkiraan waktu</option>
              {WAKTU.map((w) => <option key={w} value={w}>{w}</option>)}
            </Select>
          </div>

          <div className="af-cp-est" aria-live="polite">
            {est ? (
              <>
                <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Perkiraan harga</div>
                <strong>{rupiah(est.perPcs)}/pcs</strong>
                <div style={{ fontSize: '.84rem', marginTop: 2 }}>
                  Sekitar {rupiah(est.total)} untuk {jumlah} pcs{est.sekali ? ' (termasuk biaya sekali ' + rupiah(est.sekali) + ')' : ''}. Harga final ada di penawaran.
                </div>
              </>
            ) : (
              <div style={{ fontSize: '.86rem', lineHeight: 1.55 }}>
                <strong style={{ fontSize: '1rem', display: 'block' }}>Harga dikirim di penawaran</strong>
                Tekan tombol di bawah: pilihan Anda terkirim lengkap ke WhatsApp. Di jam kerja kami balas di bawah 1 jam.
              </div>
            )}
          </div>

          {p.simulator ? (
            <a href="#simulator" onClick={(e) => { e.preventDefault(); onLeaveTo('simulator'); }} style={{ fontSize: '.86rem', fontWeight: 700, color: 'var(--af-purple-deep)' }}>
              🎨 Mau lihat dulu warna dan logonya? Coba simulator rapor
            </a>
          ) : null}

          <a href={window.waLink(waLain)} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--af-ink)', background: 'var(--af-purple-tint)', border: '2px solid var(--af-ink)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
            <span style={{ flex: 1 }}>
              <strong style={{ fontFamily: 'var(--font-display)', display: 'block' }}>Model yang Anda mau tidak ada di pilihan?</strong>
              <span style={{ fontSize: '.8rem', color: 'var(--text-body)' }}>Kirim foto contohnya lewat WhatsApp, kami cek apakah bisa dibuat.</span>
            </span>
            <span aria-hidden="true" style={{ fontWeight: 800, fontSize: '1.2rem' }}>→</span>
          </a>
        </div>
      </div>
    </window.AfSheet>
  );
}

function CustomProdukSection() {
  const { SectionHeader, Button } = DS2cp;
  const [openSlug, setOpenSlug] = React.useState(null);
  const idx = CUSTOM_PRODUK.findIndex((p) => p.slug === openSlug);

  // #custom-<slug> opens a product: shareable, Back closes it, and plain links
  // elsewhere on the page (e.g. the executive band) can open one too.
  React.useEffect(() => {
    const sync = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      const slug = h.startsWith('custom-') ? h.slice(7) : null;
      setOpenSlug(CUSTOM_PRODUK.some((p) => p.slug === slug) ? slug : null);
    };
    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); };
  }, []);

  function open(slug) {
    history.pushState({ afDetail: true }, '', '#custom-' + slug);
    setOpenSlug(slug);
  }
  function close() {
    if (history.state && history.state.afDetail) { history.back(); return; }
    history.replaceState(null, '', location.pathname + location.search);
    setOpenSlug(null);
  }
  function step(dir) {
    const next = CUSTOM_PRODUK[(idx + dir + CUSTOM_PRODUK.length) % CUSTOM_PRODUK.length];
    history.replaceState(history.state, '', '#custom-' + next.slug);
    setOpenSlug(next.slug);
  }
  // Close the sheet and jump to a section of this page. close() would run
  // history.back(), which lands after the jump and undoes it, so the product
  // entry is replaced by the section's hash instead.
  function leaveTo(id) {
    history.replaceState(null, '', location.pathname + location.search + '#' + id);
    setOpenSlug(null);
    // After the sheet unmounts and releases the page scroll lock.
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: 'start' });
    });
  }

  // The sheet renders outside the <section>: Shell's "main section > div"
  // phone padding would otherwise lift it 48px off the bottom of the screen.
  return (
    <>
    <section id="produk-custom" style={{ background: 'var(--af-paper)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px var(--container-pad) 64px' }}>
        <SectionHeader
          eyebrow="Pilih Produk Custom" eyebrowColor="orange"
          title="Mau Dibuatkan yang Mana?" highlight="yang Mana?" highlightColor="orange"
          description="Model yang paling sering dipesan sekolah dan instansi. Pilih spesifikasinya, kirim ke WhatsApp, kami balas dengan mockup dan penawaran."
        />
        <div className="af-cp-grid">
          {CUSTOM_PRODUK.map((p) => <CustomCard key={p.slug} p={p} onOpen={() => open(p.slug)} />)}
        </div>
        <div className="af-cp-other">
          <div>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', display: 'block' }}>Model lain yang belum ada di sini?</strong>
            <span style={{ fontSize: '.88rem', color: 'var(--text-body)' }}>Kirim foto contohnya lewat WhatsApp, kami cek apakah bisa dibuat.</span>
          </div>
          <Button color="wa" href={window.waLink('Halo Agatha Felix! Saya mau buat produk custom dengan model lain. Saya kirim foto contohnya di chat ini.')} target="_blank" rel="noopener noreferrer">
            <window.WaGlyph2 /> Kirim Foto Contoh
          </Button>
        </div>
      </div>
    </section>
    {idx >= 0 ? (
      <CustomSheet p={CUSTOM_PRODUK[idx]} pos={idx} total={CUSTOM_PRODUK.length} onClose={close} onStep={step} onLeaveTo={leaveTo} />
    ) : null}
    </>
  );
}

Object.assign(window, {
  CustomProdukSection,
  AfCustom: { CUSTOM_PRODUK, customSel, visibleFields, optionsOf, describeField, pesanCustom, perkiraanCustom, ringSize },
});
