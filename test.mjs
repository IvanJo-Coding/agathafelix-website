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
test('largest portfolio photos are served as compact WebP assets', () => {
  for (const name of ['clearholder-permata', 'rapor-penabur-cordura']) {
    const small = fs.statSync(`dist/assets/portfolio/${name}.webp`).size;
    const original = fs.statSync(`project/assets/portfolio/${name}.png`).size;
    assert.ok(small < original / 10);
    assert.ok(read('dist/produk-custom/index.html').includes(name + '.webp'));
  }
});
