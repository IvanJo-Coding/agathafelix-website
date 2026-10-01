// Admin — kalkulator HPP produk custom, di /admin/ (noindex, tidak ditautkan).
//
// Repo dan website ini publik, jadi angka HPP, segmen harga, dan data sekolah
// TIDAK PERNAH ditulis di kode. Semuanya diketik di halaman ini, tersimpan di
// browser (localStorage), dan dipindah ke HP/PC lain lewat file backup JSON.
// Produk dan perintilannya diambil dari CustomProduk.jsx, jadi pilihan baru di
// sana otomatis muncul di sini.
const AC = window.AfCustom;

const KUNCI = 'af-admin-hpp';
const VERSI = 1;
const TINGKAT = [50, 100, 300, 500];   // tingkat qty, sama dengan website
const LABEL_TINGKAT = ['50–99 pcs', '100–299', '300–499', '500+'];

// --- What is costed ------------------------------------------------------------
// The order sheet's options, with three costing changes: inner sleeves cost per
// sheet (times the count), the ring binder costs per ring size, and choices that
// are always quoted by hand ("lain", "rekomendasikan") are left out.
const RING = [['ring-1', 'Ring D 1 inci'], ['ring-15', 'Ring D 1,5 inci'], ['ring-2', 'Ring D 2 inci']];
const RING_ID = { '1 inci': 'ring-1', '1,5 inci': 'ring-15', '2 inci': 'ring-2' };
const GRATIS = ['tanpa', 'press'];   // start at 0: no add-on, or part of the base cost

const dipilih = (f) => f.type !== 'teks' && f.priced !== false;     // asked in the calculator
const dihitung = (f) => dipilih(f) && f.id !== 'inner-jumlah';     // has its own cost rows
const pilihanHpp = (f, sel) => AC.optionsOf(f, sel).filter((op) => !op.noPrice && op.id !== 'lain');
const jumlahInner = (sel) => Number(sel['inner-jumlah'] === 'lain' ? sel['inner-jumlah-lain'] : sel['inner-jumlah']) || 0;

// The cost table of one product: base cost per size/type first, then each field.
function grupHpp(p) {
  const sel = AC.customSel(p, {});
  const grup = [];
  for (const f of p.fields) {
    if (!dihitung(f)) continue;
    const dasar = f.id === p.dasarKey;
    let rows = pilihanHpp(f, sel).map((op) => [op.id, op.label]);
    if (f.id === 'punggung') rows = rows.filter(([id]) => id !== 'ring').concat(RING);
    grup.push({
      id: dasar ? 'dasar' : f.id,
      label: dasar ? 'Biaya dasar per ' + f.label.toLowerCase() : f.label + (f.id === 'inner-tipe' ? ' (per lembar)' : ''),
      hint: dasar ? 'Ongkos kerja, bahan pokok, dan packing per pcs.'
        : f.id === 'inner-tipe' ? 'Dikali jumlah inner yang dipilih.'
        : f.id === 'punggung' ? 'Ukuran ring dipilih otomatis dari jumlah inner, sama seperti di website.'
        : f.type === 'multi' ? 'Per sisi; dijumlahkan untuk setiap sisi yang dipilih.' : '',
      rows,
    });
  }
  return grup.sort((a, b) => (b.id === 'dasar') - (a.id === 'dasar'));
}

// --- Saved data -------------------------------------------------------------------
const angkaKosong = (id) => Object.fromEntries(TINGKAT.map((t, i) => [t, i === 0 && GRATIS.includes(id) ? 0 : null]));
const SEGMEN_AWAL = [['premium', 'Premium'], ['menengah', 'Menengah'], ['ekonomis', 'Ekonomis']];

// Fill in rows added to the product definitions since the data was saved. Rows
// that no longer exist are kept, so a renamed option never loses its numbers.
function lengkapi(d) {
  d = d && typeof d === 'object' ? d : {};
  const hpp = {};
  for (const p of AC.CUSTOM_PRODUK) {
    const lama = (d.hpp && d.hpp[p.slug]) || {};
    const harga = JSON.parse(JSON.stringify(lama.harga || {}));
    for (const g of grupHpp(p)) {
      harga[g.id] = harga[g.id] || {};
      for (const [id] of g.rows) harga[g.id][id] = { ...angkaKosong(id), ...harga[g.id][id] };
    }
    const sekali = Array.isArray(lama.sekali) ? lama.sekali
      : p.fields.some((f) => f.id === 'poly') ? [{ nama: 'Klise / plat poly', biaya: null }] : [];
    hpp[p.slug] = { harga, sekali };
  }
  return {
    versi: VERSI,
    hpp,
    segmen: Array.isArray(d.segmen) ? d.segmen : SEGMEN_AWAL.map(([id, nama]) => ({ id, nama, markup: null, catatan: '' })),
    sekolah: Array.isArray(d.sekolah) ? d.sekolah : [],
    bulat: typeof d.bulat === 'number' ? d.bulat : 500,
    disimpan: d.disimpan || null,
  };
}
function muat() {
  try {
    const raw = localStorage.getItem(KUNCI);
    if (raw) return lengkapi(JSON.parse(raw));
  } catch (_) {}
  return lengkapi({});
}
function simpan(d) {
  try { localStorage.setItem(KUNCI, JSON.stringify(d)); return true; } catch (_) { return false; }
}

// --- Calculation -----------------------------------------------------------------
// A cost for a quantity: its tier, or the nearest filled tier below it (else
// above), so one filled column is enough when bulk buying changes nothing.
function nilai(cells, qty) {
  if (!cells) return null;
  const isi = TINGKAT.filter((t) => typeof cells[t] === 'number');
  if (!isi.length) return null;
  const bawah = isi.filter((t) => t <= qty);
  return cells[bawah.length ? bawah[bawah.length - 1] : isi[0]];
}

// HPP of one order. One-time costs (klise, setup) are spread over every piece.
function hitungHpp(p, raw, qty, hppProduk, ekstra = {}) {
  const sel = AC.customSel(p, raw);
  const harga = (hppProduk && hppProduk.harga) || {};
  const rincian = [], kurang = [];
  const tambah = (label, cells, kali = 1) => {
    const v = nilai(cells, qty);
    if (typeof v === 'number') rincian.push({ label, perPcs: v * kali });
    else kurang.push(label + ' (belum ada harga)');
  };
  for (const f of AC.visibleFields(p, sel)) {
    if (!dihitung(f)) continue;
    const g = f.id === p.dasarKey ? 'dasar' : f.id;
    const ids = f.type === 'multi' ? sel[f.id] || [] : [sel[f.id]];
    if (!ids.length) kurang.push(f.label + ' (belum dipilih)');
    for (const id of ids) {
      const op = pilihanHpp(f, sel).find((x) => x.id === id);
      if (!op) { kurang.push(f.label + ' (belum dipilih)'); continue; }
      const cells = (harga[g] || {})[id];
      if (f.id === 'inner-tipe') {
        const n = jumlahInner(sel);
        if (n > 0) tambah('Inner ' + op.label.toLowerCase() + ' × ' + n + ' lembar', cells, n);
        else kurang.push('Jumlah inner (belum diisi)');
      } else if (f.id === 'punggung' && id === 'ring') {
        const ring = RING.find(([rid]) => rid === RING_ID[AC.ringSize(jumlahInner(sel))]);
        tambah(ring[1], (harga.punggung || {})[ring[0]]);
      } else {
        tambah((g === 'dasar' ? 'Biaya dasar' : f.label) + ': ' + op.label, cells);
      }
    }
  }
  const angka = (n) => (typeof n === 'number' && isFinite(n) ? n : 0);
  if (angka(ekstra.perPcs)) rincian.push({ label: 'Biaya lain per pcs', perPcs: angka(ekstra.perPcs) });
  const sekaliRows = ((hppProduk && hppProduk.sekali) || []).filter((s) => s.nama || typeof s.biaya === 'number');
  for (const s of sekaliRows) if (typeof s.biaya !== 'number') kurang.push((s.nama || 'Biaya sekali bayar') + ' (belum ada harga)');
  const sekali = sekaliRows.reduce((a, s) => a + angka(s.biaya), 0) + angka(ekstra.sekali);
  const perPcs = rincian.reduce((a, r) => a + r.perPcs, 0);
  const hppPcs = perPcs + (qty > 0 ? sekali / qty : 0);
  return { sel, rincian, kurang, perPcs, sekali, sekaliNama: sekaliRows.filter((s) => s.biaya).map((s) => s.nama), hppPcs, total: hppPcs * qty };
}

// Selling price: HPP plus the markup, rounded UP to the chosen step.
function hargaJual(hppPcs, markup, bulat) {
  if (typeof markup !== 'number' || !(hppPcs > 0)) return null;
  const raw = hppPcs * (1 + markup / 100);
  return bulat > 0 ? Math.ceil(raw / bulat - 1e-6) * bulat : Math.round(raw);
}

const rupiah = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

// WhatsApp-ready quote for the customer. Never shows HPP or markup.
function teksPenawaran(p, sel, qty, jual, sekolah, sekaliNama = []) {
  const lines = ['*Penawaran Agatha Felix*'];
  if (sekolah) lines.push('Untuk: ' + sekolah.nama + (sekolah.kota ? ', ' + sekolah.kota : ''));
  lines.push('', '*' + p.name + '*');
  for (const f of AC.visibleFields(p, sel)) {
    if (!dipilih(f) || (f.group === 'tambahan' && sel[f.id] === 'tanpa')) continue;
    const v = AC.describeField(f, sel);
    if (v) lines.push('- ' + f.label + ': ' + v);
  }
  lines.push('', 'Jumlah: ' + qty + ' pcs', 'Harga: ' + rupiah(jual) + '/pcs', 'Total: ' + rupiah(jual * qty));
  if (sekaliNama.length) lines.push('Harga sudah termasuk ' + sekaliNama.join(', ').toLowerCase() + '.');
  return lines.join('\n');
}

// --- Styles -------------------------------------------------------------------------
(function injectAdminCss() {
  if (typeof document === 'undefined' || document.getElementById('af-admin-css')) return;
  const tag = document.createElement('style');
  tag.id = 'af-admin-css';
  tag.textContent = `
  .af-ad { min-height: 100vh; background: var(--af-paper); color: var(--af-ink); font-size: 15px; }
  .af-ad-wrap { max-width: 1120px; margin: 0 auto; padding: 0 16px; }
  .af-ad-top { background: #fff; border-bottom: 2px solid var(--af-ink); }
  .af-ad-top .af-ad-wrap { display: flex; align-items: center; gap: 14px; min-height: 68px; }
  .af-ad-top img { height: 40px; width: auto; }
  .af-ad-top h1 { font-size: 1.3rem; }
  .af-ad-top p { margin: 0; font-size: .8rem; color: var(--af-ink-3); }
  .af-ad-banner { margin: 16px 0 0; padding: 10px 14px; border: 2px dashed var(--af-ink); border-radius: 12px; background: var(--af-yellow-tint); font-size: .85rem; }
  .af-ad-banner.gagal { background: var(--af-orange-soft); border-style: solid; font-weight: 700; }
  .af-ad-tabs { display: flex; gap: 8px; overflow-x: auto; padding: 16px 0 14px; scrollbar-width: none; }
  .af-ad-tabs button { flex-shrink: 0; min-height: 42px; padding: 8px 16px; font: 800 .9rem var(--font-display); cursor: pointer;
    color: var(--af-ink); background: #fff; border: 2px solid var(--af-ink); border-radius: 999px; }
  .af-ad-tabs button[aria-pressed="true"] { background: var(--af-ink); color: #fff; box-shadow: 0 3px 0 var(--af-orange); }
  .af-ad-card { background: #fff; border: 2px solid var(--af-ink); border-radius: 16px; padding: 16px; margin-bottom: 16px; min-width: 0; }
  .af-ad-card h2 { font-size: 1.15rem; margin-bottom: 10px; }
  .af-ad-card h3 { font-size: 1rem; }
  .af-ad-hint { margin: 2px 0 10px; font-size: .8rem; color: var(--af-ink-3); }
  .af-ad-cols { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 16px; align-items: start; }
  .af-ad-sticky { position: sticky; top: 12px; }
  .af-ad-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
  .af-ad-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; border: 0; padding: 0; margin: 0; font-size: .82rem; font-weight: 700; }
  .af-ad-field.lebar { grid-column: 1 / -1; }
  .af-ad-field legend { padding: 0; margin-bottom: 4px; }
  .af-ad select, .af-ad input[type="text"], .af-ad input[type="number"], .af-ad input[type="search"] {
    width: 100%; min-height: 40px; padding: 7px 10px; font: 500 .92rem var(--font-body); color: var(--af-ink);
    background: #fff; border: 2px solid var(--af-ink); border-radius: 10px; box-sizing: border-box; }
  .af-ad input::placeholder { color: #B5AEA3; }
  .af-ad-checks { display: flex; flex-wrap: wrap; gap: 6px 14px; font-weight: 500; }
  .af-ad-checks label { display: inline-flex; align-items: center; gap: 6px; min-height: 32px; }
  .af-ad-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .af-ad-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 40px; padding: 7px 14px;
    font: 800 .86rem var(--font-display); color: var(--af-ink); background: #fff; border: 2px solid var(--af-ink); border-radius: 999px; cursor: pointer; }
  .af-ad-btn.utama { background: var(--af-green); color: #fff; box-shadow: 0 3px 0 var(--af-ink); }
  .af-ad-btn.bahaya { color: var(--af-orange-deep); }
  .af-ad-btn.kecil { min-height: 32px; padding: 4px 10px; font-size: .78rem; }
  .af-ad-warn { padding: 10px 12px; margin-bottom: 12px; border-radius: 12px; background: var(--af-orange-tint); border: 2px solid var(--af-orange); font-size: .84rem; }
  .af-ad-warn ul { margin: 4px 0 0; padding-left: 18px; }
  .af-ad-rincian { list-style: none; margin: 0 0 8px; padding: 0; font-size: .86rem; }
  .af-ad-rincian li { display: flex; justify-content: space-between; gap: 12px; padding: 5px 0; border-bottom: 1px solid var(--af-line); }
  .af-ad-rincian li span:last-child, .af-ad-tabel td { font-variant-numeric: tabular-nums; white-space: nowrap; }
  .af-ad-big { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 0; }
  .af-ad-big > div { border: 2px solid var(--af-ink); border-radius: 12px; padding: 10px 12px; background: var(--af-paper); }
  .af-ad-big > div.jual { background: var(--af-green-tint); }
  .af-ad-big small { display: block; font-size: .74rem; font-weight: 700; color: var(--af-ink-3); }
  .af-ad-big strong { display: block; font: 800 1.35rem var(--font-display); }
  .af-ad-big span { font-size: .78rem; }
  .af-ad-tabel { width: 100%; border-collapse: collapse; font-size: .84rem; }
  .af-ad-tabel th, .af-ad-tabel td { padding: 6px 6px; text-align: right; border-bottom: 1px solid var(--af-line); }
  .af-ad-tabel th:first-child, .af-ad-tabel td:first-child { text-align: left; }
  .af-ad-tabel tr.ini td { font-weight: 800; background: var(--af-yellow-tint); }
  .af-ad-tier { display: grid; grid-template-columns: minmax(150px, 1fr) repeat(4, minmax(64px, 104px)); gap: 6px; align-items: center; padding: 5px 0; border-bottom: 1px solid var(--af-line); }
  .af-ad-tier.kepala { font-size: .72rem; font-weight: 700; color: var(--af-ink-3); border-bottom: 2px solid var(--af-ink); }
  .af-ad-tier input { min-height: 36px !important; padding: 5px 7px !important; text-align: right; }
  .af-ad-baris { display: grid; grid-template-columns: 2fr 1.2fr 1.3fr 2fr auto; gap: 6px; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--af-line); }
  .af-ad-baris.segmen { grid-template-columns: 1.5fr 110px 2.5fr auto; }
  .af-ad-baris.sekali { grid-template-columns: 2fr 1fr auto; }
  .af-ad textarea { width: 100%; min-height: 170px; padding: 10px; font: .84rem/1.5 ui-monospace, monospace; border: 2px solid var(--af-ink); border-radius: 10px; box-sizing: border-box; }
  @media (max-width: 860px) {
    .af-ad-cols { grid-template-columns: 1fr; }
    .af-ad-sticky { position: static; }
  }
  @media (max-width: 620px) {
    .af-ad-fields, .af-ad-big { grid-template-columns: 1fr; }
    .af-ad-tier { grid-template-columns: repeat(4, 1fr); }
    .af-ad-tier > :first-child { grid-column: 1 / -1; font-weight: 700; }
    .af-ad-tier.kepala > :first-child { display: none; }
    .af-ad-baris, .af-ad-baris.segmen { grid-template-columns: 1fr 1fr; }
    .af-ad-baris > :first-child { grid-column: 1 / -1; }
    .af-ad-baris.sekali { grid-template-columns: 1fr 1fr auto; }
  }`;
  document.head.appendChild(tag);
})();

// --- Components ---------------------------------------------------------------------
const keAngka = (v) => (v === '' || v === null || v === undefined || !isFinite(Number(v)) ? null : Number(v));
const idBaru = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function Angka({ id, value, onChange, label, placeholder }) {
  return (
    <input id={id} type="number" inputMode="decimal" step="any" aria-label={label} placeholder={placeholder}
      value={typeof value === 'number' ? value : ''} onChange={(e) => onChange(keAngka(e.target.value))} />
  );
}

function Kalkulator({ data, kalk, setKalk, keTab }) {
  const p = AC.CUSTOM_PRODUK.find((x) => x.slug === kalk.slug) || AC.CUSTOM_PRODUK[0];
  const raw = kalk.raw[p.slug] || {};
  const qty = Math.max(0, Math.floor(Number(kalk.qty) || 0));
  const segmen = data.segmen.find((s) => s.id === kalk.segmenId) || null;
  const sekolah = data.sekolah.find((s) => s.id === kalk.sekolahId) || null;
  const markup = typeof kalk.markup === 'number' ? kalk.markup : segmen && typeof segmen.markup === 'number' ? segmen.markup : null;
  const ekstra = { perPcs: kalk.lainPcs, sekali: kalk.lainSekali };
  const hasil = hitungHpp(p, raw, qty, data.hpp[p.slug], ekstra);
  const jual = hargaJual(hasil.hppPcs, markup, data.bulat);
  const sel = hasil.sel;
  const [tersalin, setTersalin] = React.useState(false);
  const set = (patch) => setKalk((k) => ({ ...k, ...patch }));
  const setRaw = (patch) => setKalk((k) => ({ ...k, raw: { ...k.raw, [p.slug]: { ...(k.raw[p.slug] || {}), ...patch } } }));

  // Every tier plus the typed quantity: how HPP and price fall as the order grows.
  const daftarQty = [...new Set([...TINGKAT, qty])].filter((n) => n > 0).sort((a, b) => a - b);
  const tingkat = daftarQty.map((n) => {
    const h = hitungHpp(p, raw, n, data.hpp[p.slug], ekstra);
    return { n, hpp: h.hppPcs, jual: hargaJual(h.hppPcs, markup, data.bulat) };
  });
  const jual50 = tingkat[0] && tingkat[0].jual;
  const teks = jual ? teksPenawaran(p, sel, qty, jual, sekolah, hasil.sekaliNama) : '';
  const sekolahUrut = [...data.sekolah].sort((a, b) => a.nama.localeCompare(b.nama, 'id'));

  async function salin() {
    try { await navigator.clipboard.writeText(teks); setTersalin(true); setTimeout(() => setTersalin(false), 2000); }
    catch (_) { window.prompt('Salin teks ini:', teks); }
  }

  return (
    <div className="af-ad-cols">
      <div>
        <section className="af-ad-card">
          <h2>Pesanan</h2>
          <div className="af-ad-fields">
            <label className="af-ad-field lebar">Produk
              <select value={p.slug} onChange={(e) => set({ slug: e.target.value })}>
                {AC.CUSTOM_PRODUK.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
              </select>
            </label>
            {AC.visibleFields(p, sel).filter(dipilih).map((f) => {
              if (f.type === 'multi') {
                const now = sel[f.id] || [];
                return (
                  <fieldset key={f.id} className="af-ad-field lebar">
                    <legend>{f.label}</legend>
                    <div className="af-ad-checks">
                      {pilihanHpp(f, sel).map((op) => (
                        <label key={op.id}>
                          <input type="checkbox" checked={now.includes(op.id)}
                            onChange={(e) => setRaw({ [f.id]: e.target.checked ? [...now, op.id] : now.filter((x) => x !== op.id) })} />
                          {op.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                );
              }
              const opts = f.other ? AC.optionsOf(f, sel) : pilihanHpp(f, sel);
              const value = opts.some((op) => op.id === sel[f.id]) ? sel[f.id] : '';
              return (
                <div key={f.id} className="af-ad-field">
                  <label htmlFor={'af-ad-' + f.id}>{f.label}</label>
                  <select id={'af-ad-' + f.id} value={value} onChange={(e) => setRaw({ [f.id]: e.target.value || undefined })}>
                    {value === '' ? <option value="">— pilih —</option> : null}
                    {opts.map((op) => <option key={op.id} value={op.id}>{op.label}{f.unit && op.id !== 'lain' ? ' ' + f.unit : ''}</option>)}
                  </select>
                  {f.other && sel[f.id] === 'lain' ? (
                    <Angka label={f.label + ' lain'} placeholder={'jumlah ' + (f.unit || '')} value={keAngka(raw[f.other])} onChange={(v) => setRaw({ [f.other]: v })} />
                  ) : null}
                </div>
              );
            })}
            <div className="af-ad-field lebar">
              <label htmlFor="af-ad-qty">Jumlah pesanan (pcs)</label>
              <Angka id="af-ad-qty" label="Jumlah pesanan" value={keAngka(kalk.qty)} onChange={(v) => set({ qty: v })} />
              <div className="af-ad-chips">
                {TINGKAT.map((t) => <button key={t} type="button" className="af-ad-btn kecil" onClick={() => set({ qty: t })}>{t} pcs</button>)}
              </div>
            </div>
          </div>
        </section>

        <section className="af-ad-card">
          <h2>Pelanggan &amp; harga jual</h2>
          <div className="af-ad-fields">
            <label className="af-ad-field lebar">Sekolah / instansi
              <select value={kalk.sekolahId} onChange={(e) => {
                const s = data.sekolah.find((x) => x.id === e.target.value);
                set({ sekolahId: e.target.value, segmenId: s ? s.segmen : kalk.segmenId, markup: null });
              }}>
                <option value="">— tanpa sekolah —</option>
                {sekolahUrut.map((s) => <option key={s.id} value={s.id}>{s.nama}{s.kota ? ' · ' + s.kota : ''}</option>)}
              </select>
            </label>
            <label className="af-ad-field">Segmen harga
              <select value={kalk.segmenId} onChange={(e) => set({ segmenId: e.target.value, markup: null })}>
                <option value="">— pilih segmen —</option>
                {data.segmen.map((s) => <option key={s.id} value={s.id}>{s.nama}{typeof s.markup === 'number' ? ' · ' + s.markup + '%' : ''}</option>)}
              </select>
            </label>
            <label className="af-ad-field">Markup (% dari HPP)
              <Angka label="Markup" value={kalk.markup} onChange={(v) => set({ markup: v })}
                placeholder={segmen && typeof segmen.markup === 'number' ? 'segmen: ' + segmen.markup : 'isi di segmen'} />
            </label>
            <label className="af-ad-field">Biaya lain per pcs
              <Angka label="Biaya lain per pcs" value={kalk.lainPcs} onChange={(v) => set({ lainPcs: v })} placeholder="0" />
            </label>
            <label className="af-ad-field">Biaya lain sekali bayar
              <Angka label="Biaya lain sekali bayar" value={kalk.lainSekali} onChange={(v) => set({ lainSekali: v })} placeholder="0" />
            </label>
          </div>
          <p className="af-ad-hint" style={{ marginTop: 10 }}>
            Harga jual = HPP + markup, dibulatkan ke atas per {rupiah(data.bulat || 1)}. Atur markup tiap segmen di tab Sekolah &amp; Segmen.
          </p>
        </section>
      </div>

      <section className="af-ad-card af-ad-sticky">
        <h2>Hasil · {p.name}</h2>
        {hasil.kurang.length ? (
          <div className="af-ad-warn">
            <strong>Belum lengkap, angka di bawah masih kurang:</strong>
            <ul>{hasil.kurang.map((k) => <li key={k}>{k}</li>)}</ul>
            <button type="button" className="af-ad-btn kecil" style={{ marginTop: 8 }} onClick={() => keTab('harga', p.slug)}>Isi harga perintilan {p.name} →</button>
          </div>
        ) : null}
        {qty > 0 ? (
          <>
            <ul className="af-ad-rincian">
              {hasil.rincian.filter((r) => r.perPcs).map((r) => <li key={r.label}><span>{r.label}</span><span>{rupiah(r.perPcs)}</span></li>)}
              {hasil.sekali ? <li><span>Biaya sekali bayar {rupiah(hasil.sekali)} ÷ {qty} pcs</span><span>{rupiah(hasil.sekali / qty)}</span></li> : null}
            </ul>
            <div className="af-ad-big">
              <div><small>HPP per pcs</small><strong>{rupiah(hasil.hppPcs)}</strong><span>Total {rupiah(hasil.total)}</span></div>
              <div className="jual">
                <small>Harga jual per pcs{markup !== null ? ' · markup ' + markup + '%' : ''}</small>
                {jual ? (
                  <>
                    <strong>{rupiah(jual)}</strong>
                    <span>Total {rupiah(jual * qty)} · laba {rupiah((jual - hasil.hppPcs) * qty)} ({Math.round((1 - hasil.hppPcs / jual) * 100)}% dari harga jual)</span>
                  </>
                ) : <span>{markup === null ? 'Pilih segmen atau isi markup.' : 'Isi harga perintilan dulu.'}</span>}
              </div>
            </div>
            <h3 style={{ margin: '14px 0 6px' }}>Potongan per jumlah</h3>
            <table className="af-ad-tabel">
              <thead><tr><th>Jumlah</th><th>HPP/pcs</th><th>Jual/pcs</th><th>vs {daftarQty[0]} pcs</th></tr></thead>
              <tbody>
                {tingkat.map((r) => (
                  <tr key={r.n} className={r.n === qty ? 'ini' : ''}>
                    <td>{r.n} pcs</td>
                    <td>{r.hpp ? rupiah(r.hpp) : '–'}</td>
                    <td>{r.jual ? rupiah(r.jual) : '–'}</td>
                    <td>{r.jual && jual50 && r.jual < jual50 ? '−' + Math.round((1 - r.jual / jual50) * 100) + '%' : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {teks ? (
              <>
                <h3 style={{ margin: '16px 0 6px' }}>Teks penawaran untuk pelanggan</h3>
                <textarea readOnly value={teks} aria-label="Teks penawaran" />
                <button type="button" className="af-ad-btn utama" style={{ marginTop: 8 }} onClick={salin}>{tersalin ? 'Tersalin ✓' : 'Salin teks penawaran'}</button>
                {hasil.kurang.length ? <p className="af-ad-hint">Periksa dulu: harga belum lengkap.</p> : null}
              </>
            ) : null}
          </>
        ) : <p className="af-ad-hint">Isi jumlah pesanan.</p>}
      </section>
    </div>
  );
}

function HargaPerintilan({ data, ubah, slug, setSlug }) {
  const p = AC.CUSTOM_PRODUK.find((x) => x.slug === slug) || AC.CUSTOM_PRODUK[0];
  const hp = data.hpp[p.slug];
  const grup = grupHpp(p);
  const [dari, setDari] = React.useState('');
  const semua = grup.flatMap((g) => g.rows.map(([id]) => hp.harga[g.id][id]));
  const terisi = semua.filter((c) => TINGKAT.some((t) => typeof c[t] === 'number')).length;

  function salinDari() {
    const src = data.hpp[dari];
    const nama = AC.CUSTOM_PRODUK.find((x) => x.slug === dari).name;
    if (!src || !window.confirm('Salin harga perintilan yang sama dari ' + nama + ' ke ' + p.name + '? Biaya dasar tidak ikut disalin.')) return;
    ubah((d) => {
      for (const g of grup) {
        if (g.id === 'dasar' || !src.harga[g.id]) continue;
        for (const [id] of g.rows) if (src.harga[g.id][id]) d.hpp[p.slug].harga[g.id][id] = { ...src.harga[g.id][id] };
      }
      return d;
    });
  }

  return (
    <div>
      <div className="af-ad-tabs" style={{ paddingTop: 0 }}>
        {AC.CUSTOM_PRODUK.map((x) => <button key={x.slug} type="button" aria-pressed={x.slug === p.slug} onClick={() => setSlug(x.slug)}>{x.name}</button>)}
      </div>
      <section className="af-ad-card">
        <h2>Harga perintilan · {p.name}</h2>
        <p className="af-ad-hint" style={{ fontSize: '.86rem' }}>
          Harga modal per pcs dalam Rupiah, tanpa titik. Cukup isi kolom 50–99 pcs; kolom yang kosong ikut harga di kirinya
          (angka abu-abu). Isi kolom kanan kalau beli bahan dalam jumlah besar lebih murah. {terisi} dari {semua.length} baris sudah ada harganya.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={dari} onChange={(e) => setDari(e.target.value)} style={{ maxWidth: 260 }} aria-label="Salin dari produk">
            <option value="">Salin harga dari produk lain…</option>
            {AC.CUSTOM_PRODUK.filter((x) => x.slug !== p.slug).map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
          </select>
          <button type="button" className="af-ad-btn kecil" disabled={!dari} onClick={salinDari}>Salin</button>
        </div>
      </section>
      {grup.map((g) => (
        <section key={g.id} className="af-ad-card">
          <h3>{g.label}</h3>
          {g.hint ? <p className="af-ad-hint">{g.hint}</p> : null}
          <div className="af-ad-tier kepala"><span>Pilihan</span>{LABEL_TINGKAT.map((l) => <span key={l} style={{ textAlign: 'right' }}>{l}</span>)}</div>
          {g.rows.map(([id, label]) => {
            const cells = hp.harga[g.id][id];
            return (
              <div key={id} className="af-ad-tier">
                <span>{label}</span>
                {TINGKAT.map((t) => {
                  const ikut = nilai(cells, t);
                  return (
                    <Angka key={t} label={label + ', ' + t + ' pcs'} value={cells[t]} placeholder={typeof ikut === 'number' ? String(ikut) : ''}
                      onChange={(v) => ubah((d) => { d.hpp[p.slug].harga[g.id][id][t] = v; return d; })} />
                  );
                })}
              </div>
            );
          })}
        </section>
      ))}
      <section className="af-ad-card">
        <h3>Biaya sekali bayar per pesanan</h3>
        <p className="af-ad-hint">Misalnya klise/plat poly atau setup cetak. Di kalkulator biaya ini dibagi ke semua pcs, jadi makin banyak pesanan makin murah per pcs.</p>
        {hp.sekali.map((s, i) => (
          <div key={i} className="af-ad-baris sekali">
            <input type="text" value={s.nama} aria-label="Nama biaya" placeholder="Nama biaya"
              onChange={(e) => ubah((d) => { d.hpp[p.slug].sekali[i].nama = e.target.value; return d; })} />
            <Angka label="Biaya" value={s.biaya} placeholder="Rupiah" onChange={(v) => ubah((d) => { d.hpp[p.slug].sekali[i].biaya = v; return d; })} />
            <button type="button" className="af-ad-btn kecil bahaya" onClick={() => ubah((d) => { d.hpp[p.slug].sekali.splice(i, 1); return d; })}>Hapus</button>
          </div>
        ))}
        <button type="button" className="af-ad-btn kecil" style={{ marginTop: 10 }} onClick={() => ubah((d) => { d.hpp[p.slug].sekali.push({ nama: '', biaya: null }); return d; })}>+ Tambah biaya</button>
      </section>
    </div>
  );
}

function SekolahSegmen({ data, ubah }) {
  const [cari, setCari] = React.useState('');
  const [baru, setBaru] = React.useState({ nama: '', kota: '', segmen: '', catatan: '' });
  const q = cari.trim().toLowerCase();
  const tampil = data.sekolah
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => !q || (s.nama + ' ' + s.kota + ' ' + s.catatan).toLowerCase().includes(q))
    .sort((a, b) => a.s.nama.localeCompare(b.s.nama, 'id'));
  const pakai = (id) => data.sekolah.filter((s) => s.segmen === id).length;

  function tambahSekolah(e) {
    e.preventDefault();
    if (!baru.nama.trim()) return;
    ubah((d) => { d.sekolah.push({ id: idBaru(), ...baru, nama: baru.nama.trim(), kota: baru.kota.trim() }); return d; });
    setBaru({ nama: '', kota: '', segmen: baru.segmen, catatan: '' });
  }
  const segmenSelect = (value, onChange, label) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      <option value="">— segmen —</option>
      {data.segmen.map((g) => <option key={g.id} value={g.id}>{g.nama}</option>)}
    </select>
  );

  return (
    <div>
      <section className="af-ad-card">
        <h2>Segmen harga</h2>
        <p className="af-ad-hint" style={{ fontSize: '.86rem' }}>
          Markup = untung dalam persen dari HPP. Contoh: HPP Rp40.000 dengan markup 50% menjadi Rp60.000. Sekolah premium bisa diberi markup lebih
          tinggi supaya harganya tidak kemurahan, sekolah ekonomis lebih rendah.
        </p>
        {data.segmen.map((g, i) => (
          <div key={g.id} className="af-ad-baris segmen">
            <input type="text" value={g.nama} aria-label="Nama segmen" onChange={(e) => ubah((d) => { d.segmen[i].nama = e.target.value; return d; })} />
            <Angka label={'Markup ' + g.nama} value={g.markup} placeholder="markup %" onChange={(v) => ubah((d) => { d.segmen[i].markup = v; return d; })} />
            <input type="text" value={g.catatan || ''} placeholder="Keterangan, mis. SPP di atas Rp2 juta" aria-label="Keterangan segmen"
              onChange={(e) => ubah((d) => { d.segmen[i].catatan = e.target.value; return d; })} />
            <button type="button" className="af-ad-btn kecil bahaya" onClick={() => {
              const n = pakai(g.id);
              if (!window.confirm('Hapus segmen ' + g.nama + '?' + (n ? ' ' + n + ' sekolah akan tanpa segmen.' : ''))) return;
              ubah((d) => { d.segmen.splice(i, 1); d.sekolah.forEach((s) => { if (s.segmen === g.id) s.segmen = ''; }); return d; });
            }}>Hapus</button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
          <button type="button" className="af-ad-btn kecil" onClick={() => ubah((d) => { d.segmen.push({ id: idBaru(), nama: 'Segmen baru', markup: null, catatan: '' }); return d; })}>+ Tambah segmen</button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.84rem', fontWeight: 700 }}>
            Pembulatan harga jual
            <select value={data.bulat} onChange={(e) => ubah((d) => { d.bulat = Number(e.target.value); return d; })} style={{ width: 'auto' }}>
              {[0, 100, 500, 1000].map((n) => <option key={n} value={n}>{n ? 'ke atas per ' + rupiah(n) : 'tanpa pembulatan'}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="af-ad-card">
        <h2>Data sekolah / instansi <span style={{ fontSize: '.8rem', color: 'var(--af-ink-3)' }}>({data.sekolah.length})</span></h2>
        <form className="af-ad-baris" onSubmit={tambahSekolah} style={{ borderBottom: '2px solid var(--af-ink)', paddingBottom: 10 }}>
          <input type="text" value={baru.nama} placeholder="Nama sekolah" aria-label="Nama sekolah baru" onChange={(e) => setBaru({ ...baru, nama: e.target.value })} />
          <input type="text" value={baru.kota} placeholder="Kota" aria-label="Kota" onChange={(e) => setBaru({ ...baru, kota: e.target.value })} />
          {segmenSelect(baru.segmen, (v) => setBaru({ ...baru, segmen: v }), 'Segmen sekolah baru')}
          <input type="text" value={baru.catatan} placeholder="Catatan (SPP, kontak, riwayat)" aria-label="Catatan" onChange={(e) => setBaru({ ...baru, catatan: e.target.value })} />
          <button type="submit" className="af-ad-btn kecil utama">Tambah</button>
        </form>
        {data.sekolah.length > 5 ? (
          <input type="search" value={cari} placeholder="Cari sekolah, kota, atau catatan…" aria-label="Cari sekolah" onChange={(e) => setCari(e.target.value)} style={{ margin: '10px 0' }} />
        ) : null}
        {tampil.map(({ s, i }) => (
          <div key={s.id} className="af-ad-baris">
            <input type="text" value={s.nama} aria-label="Nama sekolah" onChange={(e) => ubah((d) => { d.sekolah[i].nama = e.target.value; return d; })} />
            <input type="text" value={s.kota} aria-label="Kota" onChange={(e) => ubah((d) => { d.sekolah[i].kota = e.target.value; return d; })} />
            {segmenSelect(s.segmen, (v) => ubah((d) => { d.sekolah[i].segmen = v; return d; }), 'Segmen ' + s.nama)}
            <input type="text" value={s.catatan} aria-label="Catatan" onChange={(e) => ubah((d) => { d.sekolah[i].catatan = e.target.value; return d; })} />
            <button type="button" className="af-ad-btn kecil bahaya" onClick={() => {
              if (window.confirm('Hapus ' + s.nama + '?')) ubah((d) => { d.sekolah.splice(i, 1); return d; });
            }}>Hapus</button>
          </div>
        ))}
        {!data.sekolah.length ? <p className="af-ad-hint" style={{ marginTop: 10 }}>Belum ada sekolah. Tambahkan di baris atas.</p> : null}
      </section>
    </div>
  );
}

function Backup({ data, setData }) {
  const fileRef = React.useRef(null);
  function ekspor() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hpp-agatha-felix-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function impor(file) {
    const r = new FileReader();
    r.onload = () => {
      let d = null;
      try { d = JSON.parse(r.result); } catch (_) {}
      if (!d || d.versi !== VERSI || typeof d.hpp !== 'object') { window.alert('File ini bukan backup kalkulator HPP.'); return; }
      if (window.confirm('Ganti SEMUA data di browser ini dengan isi file "' + file.name + '"?')) setData(lengkapi(d));
    };
    r.readAsText(file);
  }
  return (
    <section className="af-ad-card">
      <h2>Backup &amp; pindah perangkat</h2>
      <p style={{ fontSize: '.9rem', marginTop: 0 }}>
        Harga perintilan, segmen, dan data sekolah hanya tersimpan di browser ini
        {data.disimpan ? ' (terakhir diubah ' + new Date(data.disimpan).toLocaleString('id-ID') + ')' : ''}. Data hilang kalau riwayat browser
        dihapus. Ekspor file backup secara berkala, simpan di tempat aman, dan jangan dibagikan: isinya harga modal.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className="af-ad-btn utama" onClick={ekspor}>Ekspor file backup</button>
        <button type="button" className="af-ad-btn" onClick={() => fileRef.current.click()}>Impor dari file…</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { if (e.target.files[0]) impor(e.target.files[0]); e.target.value = ''; }} />
        <button type="button" className="af-ad-btn bahaya" onClick={() => {
          if (window.confirm('Hapus SEMUA data kalkulator di browser ini? Ekspor backup dulu kalau masih perlu.')) setData(lengkapi({}));
        }}>Hapus semua data</button>
      </div>
      <p className="af-ad-hint" style={{ marginTop: 12 }}>Pindah ke HP/PC lain: ekspor di sini, kirim filenya ke perangkat itu, lalu buka halaman ini di sana dan impor.</p>
    </section>
  );
}

function AdminApp() {
  const [data, setData] = React.useState(muat);
  const [tersimpan, setTersimpan] = React.useState(true);
  const [tab, setTab] = React.useState('kalkulator');
  const [slugHarga, setSlugHarga] = React.useState(AC.CUSTOM_PRODUK[0].slug);
  const [kalk, setKalk] = React.useState({
    slug: AC.CUSTOM_PRODUK[0].slug, raw: {}, qty: 100, sekolahId: '', segmenId: '', markup: null, lainPcs: null, lainSekali: null,
  });
  const pertama = React.useRef(true);
  React.useEffect(() => {
    if (pertama.current) { pertama.current = false; return; }
    setTersimpan(simpan(data));
  }, [data]);
  const ubah = (fn) => setData((d) => ({ ...fn(JSON.parse(JSON.stringify(d))), disimpan: new Date().toISOString() }));
  const keTab = (t, slug) => { if (slug) setSlugHarga(slug); setTab(t); window.scrollTo(0, 0); };
  const TABS = [['kalkulator', 'Kalkulator'], ['harga', 'Harga Perintilan'], ['sekolah', 'Sekolah & Segmen'], ['backup', 'Backup']];

  return (
    <div className="af-ad">
      <header className="af-ad-top">
        <div className="af-ad-wrap">
          <img src="/assets/logo-agatha-felix.png" alt="Agatha Felix" />
          <div><h1>Kalkulator HPP</h1><p>Halaman admin · bukan untuk pelanggan</p></div>
        </div>
      </header>
      <div className="af-ad-wrap" style={{ paddingBottom: 48 }}>
        <p className={'af-ad-banner' + (tersimpan ? '' : ' gagal')}>
          {tersimpan
            ? 'Semua angka di halaman ini hanya tersimpan di browser ini, tidak terkirim ke mana pun. Ekspor backup secara berkala.'
            : 'Browser ini tidak bisa menyimpan data. Perubahan hilang saat halaman ditutup: ekspor backup sekarang di tab Backup.'}
        </p>
        <nav className="af-ad-tabs" aria-label="Bagian admin">
          {TABS.map(([id, label]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => keTab(id)}>{label}</button>)}
        </nav>
        {tab === 'kalkulator' ? <Kalkulator data={data} kalk={kalk} setKalk={setKalk} keTab={keTab} /> : null}
        {tab === 'harga' ? <HargaPerintilan data={data} ubah={ubah} slug={slugHarga} setSlug={setSlugHarga} /> : null}
        {tab === 'sekolah' ? <SekolahSegmen data={data} ubah={ubah} /> : null}
        {tab === 'backup' ? <Backup data={data} setData={setData} /> : null}
      </div>
    </div>
  );
}

if (typeof document !== 'undefined' && document.getElementById('af-admin')) {
  ReactDOM.createRoot(document.getElementById('af-admin')).render(<AdminApp />);
}

Object.assign(window, { AfAdmin: { TINGKAT, grupHpp, lengkapi, nilai, hitungHpp, hargaJual, teksPenawaran } });
