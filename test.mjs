import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const read = (file) => fs.readFileSync(file, 'utf8');
const tag = read('project/static/js/af-site.js');
const handoff = read('project/static/js/lead-handoff.js');
const config = { googleAdsId: 'AW-18374325686', waConversionLabel: 'AW-18374325686/elV-CN2Bhe4cELbrx7lE' };
function tracking(hostname = 'localhost', pathname = '/', fresh = false) {
  const listeners = [], scripts = [], timers = [], navigations = [];
  const window = { AF_TRACKING: config, AF_LEAD_PREPARED: fresh };
  const context = vm.createContext({ window, URL, Date,
    location: { hostname, pathname, origin: 'https://' + hostname, assign: (url) => navigations.push(url) },
    document: { createElement: () => ({}), head: { appendChild: (el) => scripts.push(el) },
      addEventListener: (_, fn) => listeners.push(fn) },
    setTimeout: (fn) => timers.push(fn),
  });
  vm.runInContext(tag, context);
  function click(href, target = '_blank') {
    const event = { target: { closest: () => ({ href, target }) }, preventDefault() { this.defaultPrevented = true; } };
    listeners[0](event);
    return event;
  }
  return { context, window, listeners, scripts, timers, navigations, click };
}

test('production tag retains its Ads ID; previews do not contact Google', () => {
  assert.equal(tracking().scripts.length, 0);
  const result = tracking('agatha-felix.com');
  assert.equal(result.scripts.length, 1);
  assert.ok(result.scripts[0].src.endsWith(config.googleAdsId));
  assert.equal(result.window.dataLayer[1][1], config.googleAdsId);
  assert.equal(tracking('agatha-felix.com.evil.example').scripts.length, 0);
});
test('WhatsApp clicks are measured once; ordinary and lookalike links are ignored', () => {
  const result = tracking();
  vm.runInContext(tag, result.context);
  assert.equal(result.listeners.length, 1);
  result.click('https://wa.me/6282219472613');
  result.click('https://example.com/');
  result.click('https://wa.me.evil.example/');
  assert.equal(result.window.dataLayer.length, 1);
  assert.equal(result.window.dataLayer[0][1], 'conversion');
  assert.equal(result.window.dataLayer[0][2].send_to, config.waConversionLabel);
});
test('same-tab WhatsApp navigation survives a blocked tag and callback races', () => {
  const result = tracking('agatha-felix.com');
  assert.equal(result.click('https://wa.me/6282219472613', '').defaultPrevented, true);
  result.timers[0]();
  result.window.dataLayer.at(-1)[2].event_callback();
  assert.equal(result.navigations.length, 1);
});

function prepare(href, pending, storageAvailable = true) {
  const window = {};
  let saved = pending;
  let cleaned;
  vm.runInNewContext(handoff, { window, URL, URLSearchParams, Date, location: { href },
    sessionStorage: {
      getItem: () => { if (!storageAvailable) throw Error('storage blocked'); return JSON.stringify(saved); },
      setItem: (_, value) => { if (!storageAvailable) throw Error('storage blocked'); saved = JSON.parse(value); },
    }, history: { replaceState: (_, __, value) => { cleaned = value; } },
  });
  return { window, saved, cleaned };
}
const thanks = 'https://agatha-felix.com/raporsekolah/terima-kasih.html';
const wa = 'https://wa.me/6282219472613?text=Local%20test';
test('a fresh handoff is recognized once, without counting refreshes or direct visits', () => {
  const first = prepare(thanks, { url: wa, created: Date.now(), measured: false });
  assert.equal(first.window.AF_LEAD_URL, wa);
  assert.equal(first.window.AF_LEAD_PREPARED, true);
  assert.equal(prepare(thanks, first.saved).window.AF_LEAD_PREPARED, false);
  assert.equal(tracking('agatha-felix.com', '/raporsekolah/terima-kasih.html').scripts.length, 0);
  const fresh = tracking('agatha-felix.com', '/raporsekolah/terima-kasih.html', true);
  assert.equal(fresh.scripts.length, 1);
  assert.equal(fresh.window.dataLayer[1][2].page_location, thanks);
  fresh.window.AF_LEAD_URL = wa;
  fresh.click(wa);
  assert.equal(fresh.window.dataLayer.length, 2, 'WhatsApp retry must not double-count the prepared form');
});
test('storage fallback and old links remove contact details before tracking', () => {
  const fallback = prepare(thanks + '#wa=' + encodeURIComponent(wa), null, false);
  assert.equal(fallback.window.AF_LEAD_URL, wa);
  assert.equal(fallback.cleaned, thanks);
  assert.equal(fallback.window.AF_LEAD_PREPARED, true);
  const old = prepare(thanks + '?wa=' + encodeURIComponent(wa));
  assert.equal(old.cleaned, thanks);
  assert.equal(old.window.AF_LEAD_URL, wa);
  assert.ok(!old.window.AF_LEAD_PREPARED);
});
test('expired or redirected handoffs are rejected', () => {
  for (const pending of [
    { url: wa, created: Date.now() - 31 * 60 * 1000 },
    { url: 'https://wa.me/999999999', created: Date.now() },
    { url: 'javascript:alert(1)', created: Date.now() },
  ]) assert.ok(!prepare(thanks, pending).window.AF_LEAD_URL);
});

test('the real form prepares the message and hands off even when storage is blocked', () => {
  const html = read('project/static/raporsekolah/index.html');
  const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]).find((script) => script.includes("getElementById('leadForm')"));
  for (const blocked of [false, true]) {
    let submit, saved, opened;
    const location = {};
    const fields = { pic: 'Local Test', sekolah: 'Test School', kota: 'Test City', hp: '0000000000', waktu: 'Test' };
    const element = { addEventListener() {}, classList: { add() {}, remove() {} } };
    const form = { addEventListener: (_, fn) => { submit = fn; } };
    vm.runInNewContext(code, { window: { open: (url) => { opened = url; } }, location,
      document: { addEventListener() {}, querySelectorAll: () => [], getElementById: (id) => id === 'leadForm' ? form : element },
      addEventListener() {}, setTimeout() {},
      sessionStorage: { setItem: (_, value) => { if (blocked) throw Error('storage blocked'); saved = JSON.parse(value); } },
      FormData: class { get(key) { return fields[key]; } },
    });
    submit({ preventDefault() {} });
    assert.ok(opened.startsWith('https://wa.me/6282219472613?text='));
    assert.ok(decodeURIComponent(opened).includes('Local Test'));
    assert.ok(!location.href.includes('?'));
    if (blocked) assert.equal(new URLSearchParams(location.href.split('#')[1]).get('wa'), opened);
    else { assert.equal(location.href, 'terima-kasih.html'); assert.equal(saved.url, opened); }
  }
});

test('built routes expose content, metadata, styles, and valid local assets in raw HTML', () => {
  for (const file of ['index.html', 'produk-standar/index.html', 'produk-custom/index.html', 'raporsekolah/index.html']) {
    const html = read('dist/' + file);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, file);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, file);
    assert.match(html, /name="description"/);
    assert.ok(!html.includes('id="af-loader"'));
    // Retired order claims. Custom minimum is 50 pcs (owner, 2026-09-24).
    assert.ok(!/30[–-]40 pcs|mulai 30 pcs|MOQ 100 pcs|di [Bb]awah Rp 50\.000|&lt;Rp 50rb|[Mm]ulai 1 pcs|>1 pcs</.test(html), file + ' repeats a retired minimum-order claim');
    assert.equal((html.match(/src="\/js\/af-site.js"/g) || []).length, 1);
    assert.ok(!html.includes('tracking.js'), file + ' loads a script name that adblockers drop');
    if (!file.startsWith('raporsekolah')) assert.ok(html.includes('<style id="af-v2-responsive-shell"'), file + ' is missing responsive CSS');
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|tel:|mailto:|#|data:)/.test(raw)) continue;
      const url = new URL(raw.replace(/&amp;/g, '&'), 'https://local.test/' + file);
      const local = path.join('dist', decodeURIComponent(url.pathname));
      assert.ok(fs.existsSync(local), file + ' references missing ' + raw);
    }
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json);
  }
  const home = read('dist/index.html');
  assert.match(home, /<a[^>]+href="https:\/\/wa.me\/6282219472613[^>]+>[\s\S]*?Tanya Kapasitas Produksi/);
  assert.ok(!read('dist/sitemap.xml').includes('lastmod'));
  assert.match(read('dist/raporsekolah/terima-kasih.html'), /noindex/);
});
test('FAQ structured data matches the answers visible on each page', () => {
  for (const file of ['index.html', 'produk-custom/index.html', 'raporsekolah/index.html']) {
    const html = read('dist/' + file);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .flatMap(([, json]) => { const o = JSON.parse(json); return o['@graph'] || [o]; });
    const faq = blocks.find((o) => o['@type'] === 'FAQPage');
    assert.ok(faq && faq.mainEntity.length, file + ' has no FAQPage data');
    // Visible text only: drop scripts and styles, so the JSON-LD cannot match itself.
    const text = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ');
    for (const q of faq.mainEntity) {
      assert.ok(text.includes(q.name), `${file}: question not shown: ${q.name}`);
      assert.ok(text.includes(q.acceptedAnswer.text), `${file}: answer differs from the page: ${q.name}`);
    }
  }
});
// Custom products: load the built price table and product logic without a DOM.
function customKit() {
  const window = {};
  const context = vm.createContext({ window, console });
  for (const f of ['dist/js/CustomHarga.js', 'dist/js/CustomProduk.js']) vm.runInContext(read(f), context);
  return { harga: window.HARGA_CUSTOM, kit: window.AfCustom };
}
test('custom price template has a slot for every priced option', () => {
  const { harga, kit } = customKit();
  for (const p of kit.CUSTOM_PRODUK) {
    const table = harga[p.slug];
    assert.ok(table, p.slug + ' missing from HARGA_CUSTOM');
    const base = p.fields.find((f) => f.id === p.dasarKey);
    for (const op of base.options.filter((x) => !x.noPrice)) assert.ok(table.dasar[op.id], `${p.slug}: no dasar row for ${op.id}`);
    // Options as the page shows them (e.g. Map Jahit has no linen).
    const sel = kit.customSel(p, {});
    for (const f of p.fields) {
      if (f.id === p.dasarKey || f.type === 'teks' || f.priced === false) continue;
      for (const op of kit.optionsOf(f, sel).filter((x) => !x.noPrice && x.id !== 'lain')) {
        assert.ok(table.tambahan[f.id] && op.id in table.tambahan[f.id], `${p.slug}: no tambahan slot for ${f.id}.${op.id}`);
      }
    }
  }
});
test('custom estimate stays hidden until every needed price is filled in', () => {
  const { harga, kit } = customKit();
  const press = kit.CUSTOM_PRODUK.find((p) => p.slug === 'map-press');
  const pick = { bahan: 'tpk-urat', poly: 'emas', 'inner-tipe': 'mika', 'inner-jumlah': '40' };
  assert.equal(kit.perkiraanCustom(press, pick, 100, harga), null, 'the shipped template is all null, so no price is shown');
  const filled = JSON.parse(JSON.stringify(harga));
  const t = filled['map-press'];
  t.dasar.f4 = { 50: 60000, 100: 50000, 300: 45000, 500: 40000 };
  Object.assign(t.tambahan.bahan, { 'tpk-urat': 0, linen: 5000 });
  Object.assign(t.tambahan.poly, { emas: 0 });
  Object.assign(t.tambahan['inner-tipe'], { mika: 0 });
  Object.assign(t.tambahan['inner-jumlah'], { 40: 3000 });
  Object.assign(t.tambahan.karton, { k2: 0 });
  Object.assign(t.tambahan.busa, { b3: 0, tanpa: -1000 });
  t.sekaliBayar.klise = 250000;
  // 120 pcs -> the 100 tier; inner 40 adds 3,000.
  assert.deepEqual({ ...kit.perkiraanCustom(press, pick, 120, filled) }, { perPcs: 53000, sekali: 250000, total: 53000 * 120 + 250000 });
  assert.equal(kit.perkiraanCustom(press, pick, 49, filled), null, 'below the lowest tier');
  // Linen forces "tanpa busa": 50,000 + 5,000 + 3,000 - 1,000.
  assert.equal(kit.perkiraanCustom(press, { ...pick, bahan: 'linen' }, 100, filled).perPcs, 57000);
  assert.equal(kit.perkiraanCustom(press, { ...pick, ukuran: 'lain' }, 100, filled), null, 'custom sizes are quoted by hand');
  assert.equal(kit.perkiraanCustom(press, { ...pick, siku: 'emas-lancip' }, 100, filled), null, 'an unfilled add-on hides the estimate');
});
test('custom options follow the production rules', () => {
  const { kit } = customKit();
  const [jahit, press, exec] = ['map-jahit', 'map-press', 'map-executive'].map((s) => kit.CUSTOM_PRODUK.find((p) => p.slug === s));
  const bahan = (p, raw) => kit.optionsOf(p.fields.find((f) => f.id === 'bahan'), kit.customSel(p, raw)).map((o) => o.id);
  assert.ok(!bahan(jahit, {}).includes('linen'), 'linen cannot be sewn');
  assert.ok(bahan(press, {}).includes('linen'));
  assert.ok(!bahan(exec, {}).includes('linen'), 'Map Executive is always sewn');
  assert.ok(!exec.fields.some((f) => f.id === 'konstruksi'), 'Map Executive has no press/jahit choice');
  const linen = kit.customSel(press, { bahan: 'linen', busa: 'b5' });
  assert.equal(linen.busa, 'tanpa', 'linen takes no foam');
  assert.equal(kit.customSel(press, { bahan: 'tpk-pasir', busa: 'b5' }).busa, 'b5', 'the foam choice returns after leaving linen');
  assert.equal(kit.customSel(press, {}).karton, 'k2');
  assert.equal(kit.customSel(press, {}).busa, 'b3');
  assert.ok(!kit.visibleFields(press, kit.customSel(press, {})).some((f) => f.id === 'benang'));
  assert.ok(kit.visibleFields(exec, kit.customSel(exec, {})).some((f) => f.id === 'benang'), 'Executive always asks for thread colour');
  assert.deepEqual([...[60, 80, 120, 140].map(kit.ringSize)], ['1 inci', '1,5 inci', '1,5 inci', '2 inci']);
});
test('custom WhatsApp message carries the full specification', () => {
  const { kit } = customKit();
  const find = (s) => kit.CUSTOM_PRODUK.find((p) => p.slug === s);
  const msg = kit.pesanCustom(find('map-jahit'), {
    bahan: 'tpk-pasir', 'warna-sampul': ' navy ', benang: 'emas', poly: 'hologram', siku: 'emas-rounded',
    'inner-tipe': 'pp-bening', 'inner-jumlah': 'lain', 'inner-jumlah-lain': '110', punggung: 'ring', jendela: 'pakai',
  }, 250, 5, { sekolah: 'SMP Harapan', kota: 'Bekasi', waktu: 'Dalam 1 bulan' });
  for (const line of ['*Map Jahit*', '- Ukuran: F4 / Folio', '- Bahan sampul: TPK tekstur pasir', '- Warna sampul: navy',
    '- Warna benang jahit: Emas', '- Warna poly logo: Hologram (mohon dikonfirmasi)', '- Siku besi: Emas · rounded',
    '- Jumlah inner: 110 lembar', '- Punggung: Ring D 4-ring (1,5 inci, inner plastik lepas berlubang)',
    '- Jendela nama: Pakai jendela nama', 'Jumlah: 250 pcs (5 warna, minimal 50 pcs per warna)',
    'Sekolah / instansi: SMP Harapan', 'Kota pengiriman: Bekasi', 'Dibutuhkan: Dalam 1 bulan']) {
    assert.ok(msg.includes(line), 'message is missing: ' + line + '\n' + msg);
  }
  assert.ok(!msg.includes('Bahan sampul: Linen'));
  assert.ok(!msg.includes('Kantong dalam'), 'add-ons that were not taken stay out of the message');
  assert.match(kit.pesanCustom(find('clear-holder-print'), {}, 100, 1), /test print/);
  const zip = kit.pesanCustom(find('zipper-bag-print'), { tipe: 'polos', 'warna-zipper': 'ungu', sisi: ['depan', 'belakang'] }, 100, 1);
  assert.ok(zip.includes('- Tipe zipper bag: Polos') && zip.includes('- Warna zipper bag: Ungu') && zip.includes('- Sisi yang dicetak: Depan, Belakang'), zip);
});
test('every photo path used by the page scripts exists in the build', () => {
  for (const file of fs.readdirSync('dist/js')) {
    const code = read('dist/js/' + file);
    for (const [, p] of code.matchAll(/["'`](\/(?:assets|raporsekolah)\/[\w./-]+\.(?:webp|png|jpe?g))["'`]/g)) {
      assert.ok(fs.existsSync(path.join('dist', p)), `${file} points at missing ${p}`);
    }
  }
});
test('largest portfolio photos are served as compact WebP assets', () => {
  for (const name of ['clearholder-permata', 'rapor-penabur-cordura']) {
    const small = fs.statSync(`dist/assets/portfolio/${name}.webp`).size;
    const original = fs.statSync(`project/assets/portfolio/${name}.png`).size;
    assert.ok(small < original / 10);
    assert.ok(read('dist/produk-custom/index.html').includes(name + '.webp'));
  }
});
