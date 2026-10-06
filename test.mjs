import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const read = (file) => fs.readFileSync(file, 'utf8');
const tag = read('project/static/js/af-site.js');
const handoff = read('project/static/js/lead-handoff.js');
const config = { googleAdsId: 'AW-18374325686', waConversionLabel: 'AW-18374325686/elV-CN2Bhe4cELbrx7lE' };
// Pass the window from prepare() to run both scripts on one page, as the browser does.
function tracking(hostname = 'localhost', pathname = '/', window = {}, settings = config) {
  const listeners = [], scripts = [], timers = [], navigations = [], loads = [];
  window.AF_TRACKING = settings;
  window.addEventListener = (type, fn) => { if (type === 'load') loads.push(fn); };
  const context = vm.createContext({ window, URL, Date,
    location: { hostname, pathname, origin: 'https://' + hostname, assign: (url) => navigations.push(url) },
    document: { readyState: 'interactive', createElement: () => ({}), head: { appendChild: (el) => scripts.push(el) },
      addEventListener: (_, fn) => listeners.push(fn) },
    setTimeout: (fn) => timers.push(fn),
  });
  vm.runInContext(tag, context);
  // attrs: the button's attributes, plus its visible text as `text`.
  function click(href, target = '_blank', attrs = {}) {
    const link = { href, target, textContent: attrs.text || '', getAttribute: (name) => attrs[name] ?? null };
    const event = { target: { closest: () => link }, preventDefault() { this.defaultPrevented = true; } };
    listeners[0](event);
    return event;
  }
  return { context, window, listeners, scripts, timers, navigations, loads, click };
}
const withClarity = { ...config, clarityId: 'tq1clarity' };
// Clarity's queue holds `arguments` objects from the page's realm; compare them as plain arrays.
const clarityCalls = (window) => JSON.parse(JSON.stringify(window.clarity.q.map((call) => Array.from(call))));

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
test('Clarity starts after load, cookieless, only in production and never on the thank-you page', () => {
  const live = tracking('agatha-felix.com', '/', {}, withClarity);
  assert.equal(live.scripts.length, 1, 'only the Google tag before the page has loaded');
  assert.deepEqual(clarityCalls(live.window)[0], ['consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' }]);
  assert.equal(live.loads.length, 1);
  live.loads[0]();
  assert.equal(live.scripts[1].src, 'https://www.clarity.ms/tag/tq1clarity');
  assert.equal(live.scripts[1].async, true);
  for (const [host, page, settings] of [['localhost', '/', withClarity], ['agatha-felix.com', '/raporsekolah/terima-kasih.html', withClarity], ['agatha-felix.com', '/', config]]) {
    const off = tracking(host, page, {}, settings);
    assert.equal(off.window.clarity, undefined, host + page);
    assert.equal(off.loads.length, 0, host + page);
  }
});
test('contact clicks are counted per button in Clarity, never with the message in the link', () => {
  const live = tracking('agatha-felix.com', '/raporsekolah/', {}, withClarity);
  const queued = () => clarityCalls(live.window).slice(1);
  live.click('https://wa.me/6282219472613?text=Nama%20PIC%3A%20Budi', '_blank', { 'data-wa': 'hero', text: 'Kirim Contoh' });
  assert.deepEqual(queued(), [['event', 'klik_whatsapp'], ['set', 'tombol_whatsapp', 'hero']]);
  assert.ok(!JSON.stringify(live.window.clarity.q).includes('Budi'));
  assert.equal(live.window.dataLayer.at(-1)[2].send_to, config.waConversionLabel, 'the Ads conversion still fires');
  const ads = live.window.dataLayer.length;
  const call = live.click('tel:+6282219472613', '', { text: '\n  Telepon  ' });
  assert.equal(call.defaultPrevented, undefined, 'a phone link opens as usual');
  assert.deepEqual(queued().slice(2), [['event', 'klik_telepon'], ['set', 'tombol_telepon', 'Telepon']]);
  assert.equal(live.window.dataLayer.length, ads, 'a phone call is not an Ads conversion');
  live.click('https://example.com/', '_blank', { text: 'Lainnya' });
  assert.equal(queued().length, 4);
});
test('a typed message kept out of the page opens in full and counts once', () => {
  const live = tracking('agatha-felix.com', '/produk-custom/', {}, withClarity);
  const opened = [];
  live.window.open = (...args) => opened.push(args);
  const link = { href: 'https://wa.me/6282219472613', textContent: 'Minta Penawaran via WhatsApp', getAttribute: () => null };
  const url = 'https://wa.me/6282219472613?text=' + encodeURIComponent('Sekolah / instansi: SD Budi');
  live.window.AFTracking.openWhatsApp(link, url);
  assert.deepEqual(opened, [[url, '_blank', 'noopener']]);
  // React cancelled the click before it bubbled up to the document listener.
  live.listeners[0]({ target: { closest: () => link }, defaultPrevented: true, preventDefault() {} });
  assert.equal(live.window.dataLayer.filter((e) => e[1] === 'conversion').length, 1);
  assert.deepEqual(clarityCalls(live.window).slice(1), [['event', 'klik_whatsapp'], ['set', 'tombol_whatsapp', 'Minta Penawaran via WhatsApp']]);
  live.window.AFTracking.openWhatsApp(link, 'https://evil.example/?text=x');
  assert.equal(opened.length, 1, 'only WhatsApp links are opened');
});
test('messages carrying what the visitor typed never sit in an href (Clarity records links)', () => {
  const kit = (file) => read('project/ui_kits/website_v2/' + file);
  assert.match(kit('CustomProduk.jsx'), /\{\.\.\.window\.waPribadi\(waText\)\}/);
  assert.match(kit('Simulator.jsx'), /\{\.\.\.window\.waPribadi\(pesanWA\)\}/);
  assert.match(kit('Simulator.jsx'), /className="af-sim-preview" data-clarity-mask="true"/, 'the preview shows the typed name and logo');
  // pesanCustom() and the simulator's pesanWA hold typed input; the standard sheet's waText does not.
  for (const file of fs.readdirSync('project/ui_kits/website_v2').filter((f) => f.endsWith('.jsx') && f !== 'ProdukStandarSections.jsx')) {
    assert.ok(!/waLink\((waText|pesanWA)\)/.test(kit(file)), file + ' puts a typed message into an href');
  }
  const html = read('dist/produk-custom/index.html');
  const simulator = html.slice(html.indexOf('id="simulator"'));
  assert.match(simulator, /href="https:\/\/wa\.me\/6282219472613"/, 'the prerendered simulator button keeps the bare number');
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
  // The tag marks the lead measured later, so read storage when asked.
  return { window, cleaned, get saved() { return saved; } };
}
const thanks = 'https://agatha-felix.com/raporsekolah/terima-kasih.html';
const thanksPath = '/raporsekolah/terima-kasih.html';
const wa = 'https://wa.me/6282219472613?text=Local%20test';

const withAnalytics = { ...withClarity, googleAnalyticsId: 'G-F2P4YVFY6P' };
const googleCalls = (window) => JSON.parse(JSON.stringify(window.dataLayer.map((call) => Array.from(call))));

test('GA4 shares the Google loader and contact events never carry the WhatsApp message', () => {
  const live = tracking('agatha-felix.com', '/produk-custom/', {}, withAnalytics);
  vm.runInContext(tag, live.context);
  assert.equal(live.scripts.length, 1, 'one loader even if the shared script runs twice');
  assert.deepEqual(googleCalls(live.window).filter((e) => e[0] === 'config').map((e) => e[1]),
    [config.googleAdsId, withAnalytics.googleAnalyticsId]);
  live.click(wa, '', { 'data-wa': 'hero' });
  live.click('tel:+6282219472613', '', { text: 'Telepon' });
  const events = googleCalls(live.window).filter((e) => e[0] === 'event');
  assert.deepEqual(events.filter((e) => e[1] !== 'conversion'), [
    ['event', 'klik_whatsapp', { send_to: withAnalytics.googleAnalyticsId, button_label: 'hero' }],
    ['event', 'klik_telepon', { send_to: withAnalytics.googleAnalyticsId, button_label: 'Telepon' }],
  ]);
  assert.equal(events.filter((e) => e[1] === 'conversion').length, 1);
  assert.ok(!JSON.stringify(events).includes('Local%20test'));
  live.timers[0]();
  live.window.dataLayer.find((e) => e[1] === 'conversion')[2].event_callback();
  assert.equal(live.navigations.length, 1, 'GA4 does not disrupt the Ads navigation callback');
  const preview = tracking('localhost', '/', {}, withAnalytics);
  preview.click(wa);
  assert.equal(preview.scripts.length, 0);
  assert.ok(!googleCalls(preview.window).some((e) => e[2]?.send_to === withAnalytics.googleAnalyticsId));
});

test('GA4 counts a fresh form handoff once, with no form values or URL parameters', () => {
  const first = prepare(thanks, { url: wa, created: Date.now(), measured: false });
  const live = tracking('agatha-felix.com', thanksPath, first.window, withAnalytics);
  const calls = googleCalls(live.window);
  assert.deepEqual(calls.find((e) => e[0] === 'config' && e[1] === withAnalytics.googleAnalyticsId)[2], { page_location: thanks });
  assert.deepEqual(calls.filter((e) => e[1] === 'generate_lead'), [
    ['event', 'generate_lead', { send_to: withAnalytics.googleAnalyticsId, method: 'whatsapp_form' }],
  ]);
  live.scripts[0].onload();
  for (const pending of [first.saved, null]) {
    const visit = prepare(thanks, pending);
    const quiet = tracking('agatha-felix.com', thanksPath, visit.window, withAnalytics);
    assert.ok(!googleCalls(quiet.window).some((e) => e[1] === 'generate_lead'));
    assert.equal(googleCalls(quiet.window).find((e) => e[1] === withAnalytics.googleAnalyticsId)[2].send_page_view, false);
  }
});
test('a fresh handoff counts once the tag loads, and a failed load is retried', () => {
  const first = prepare(thanks, { url: wa, created: Date.now(), measured: false });
  assert.equal(first.window.AF_LEAD_URL, wa);
  assert.equal(first.window.AF_LEAD_PREPARED, true);
  assert.equal(first.saved.measured, false, 'opening the page is not a measurement');
  const failed = tracking('agatha-felix.com', thanksPath, first.window);
  assert.equal(failed.scripts.length, 1);
  assert.equal(failed.window.dataLayer[1][2].page_location, thanks);
  assert.ok(!('send_page_view' in failed.window.dataLayer[1][2]));
  // The tag never loaded (blocked or offline), so a reload sends the page view again.
  const retry = prepare(thanks, first.saved);
  assert.equal(retry.window.AF_LEAD_MEASURED, false);
  const loaded = tracking('agatha-felix.com', thanksPath, retry.window);
  assert.ok(!('send_page_view' in loaded.window.dataLayer[1][2]));
  loaded.scripts[0].onload();
  assert.equal(retry.saved.measured, true);
  // Once measured, a reload keeps the message but sends no second form conversion.
  const reload = prepare(thanks, retry.saved);
  assert.equal(reload.window.AF_LEAD_URL, wa);
  const quiet = tracking('agatha-felix.com', thanksPath, reload.window);
  assert.equal(quiet.window.dataLayer[1][2].send_page_view, false);
  assert.equal(quiet.scripts[0].onload, undefined);
  quiet.click(wa);
  assert.equal(quiet.window.dataLayer.length, 2, 'WhatsApp retry must not double-count the prepared form');
});
test('direct and expired thank-you visits deliver WhatsApp clicks without a form conversion', () => {
  for (const pending of [null, { url: wa, created: Date.now() - 31 * 60 * 1000, measured: false }]) {
    const visit = prepare(thanks, pending);
    assert.ok(!visit.window.AF_LEAD_URL);
    const result = tracking('agatha-felix.com', thanksPath, visit.window);
    assert.equal(result.scripts.length, 1, 'the tag must load so the click is sent');
    assert.equal(result.window.dataLayer[1][2].send_page_view, false);
    assert.equal(result.window.dataLayer[1][2].page_location, thanks);
    assert.equal(result.click('https://wa.me/6282219472613', '').defaultPrevented, true);
    assert.equal(result.window.dataLayer.at(-1)[1], 'conversion');
    assert.equal(result.window.dataLayer.at(-1)[2].send_to, config.waConversionLabel);
  }
});
test('storage fallback and old links remove contact details before tracking', () => {
  const fallback = prepare(thanks + '#wa=' + encodeURIComponent(wa), null, false);
  assert.equal(fallback.window.AF_LEAD_URL, wa);
  assert.equal(fallback.cleaned, thanks);
  assert.equal(fallback.window.AF_LEAD_PREPARED, true);
  assert.equal(fallback.window.AF_LEAD_MEASURED, false);
  const stored = prepare(thanks + '#wa=' + encodeURIComponent(wa), null);
  assert.deepEqual([stored.saved.url, stored.saved.measured], [wa, false], 'kept for a retry when storage works here');
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

// Runs the landing page's own inline script against a stub form.
function landingForm(fields, { blocked = false } = {}) {
  const html = read('project/static/raporsekolah/index.html');
  const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]).find((script) => script.includes("getElementById('leadForm')"));
  const out = { location: {}, links: [] };
  const element = { addEventListener() {}, classList: { add() {}, remove() {} }, hidden: true };
  const input = () => ({ style: {}, focus() { out.focused = true; } });
  const form = { addEventListener: (_, fn) => { out.submit = fn; }, elements: { sekolah: input(), jumlah: input(), kota: input() } };
  const link = (wa, msg) => ({ href: '', addEventListener() {}, getAttribute: (k) => ({ 'data-wa': wa, 'data-msg': msg }[k] ?? null) });
  out.links = [link('header', 'tanya'), link('hero', null)];
  vm.runInNewContext(code, { window: { open: (url) => { out.opened = url; } }, location: out.location,
    document: { addEventListener() {}, querySelectorAll: (sel) => sel === '[data-wa]' ? out.links : [],
      getElementById: (id) => id === 'leadForm' ? form : id === 'leadErr' ? (out.err = element) : element },
    addEventListener() {}, setTimeout() {},
    sessionStorage: { setItem: (_, value) => { if (blocked) throw Error('storage blocked'); out.saved = JSON.parse(value); } },
    FormData: class { get(key) { return fields[key]; } },
  });
  out.submit({ preventDefault() {} });
  return out;
}
const leadFields = { sekolah: 'Test School', jumlah: '120', kota: 'Test City', waktu: 'Test', contoh: 'ada', pic: '' };

// Runs the built landing page's inline scripts and af-site.js on one shared
// window in production, as the browser does. A click reaches the link's own
// listeners first, then the document's, as in the DOM.
function landingPage() {
  const html = read('dist/raporsekolah/index.html');
  const documentClicks = [];
  const link = (href, text, attrs) => {
    const el = { href, target: '', textContent: text, clicks: [], getAttribute: (k) => attrs[k] ?? null,
      addEventListener: (type, fn) => { if (type === 'click') el.clicks.push(fn); } };
    el.closest = () => el;
    return el;
  };
  const tel = [link('tel:+6282219472613', 'Telepon 0822-1947-2613', { 'data-tel': '' })];
  const wa = [link('https://wa.me/6282219472613', 'Kirim Contoh', { 'data-wa': 'hero' })];
  const stub = { addEventListener() {}, classList: { add() {} }, elements: {}, style: {} };
  const page = { URL, Date, setTimeout() {}, addEventListener() {},
    location: { hostname: 'agatha-felix.com', pathname: '/raporsekolah/', origin: 'https://agatha-felix.com' },
    document: { readyState: 'interactive', createElement: () => ({}), head: { appendChild() {} },
      addEventListener: (type, fn) => { if (type === 'click') documentClicks.push(fn); },
      querySelectorAll: (sel) => (sel === '[data-tel]' ? tel : sel === '[data-wa]' ? wa : []),
      getElementById: () => stub },
  };
  page.window = page;
  const context = vm.createContext(page);
  for (const [, code] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(code, context);
  vm.runInContext(read('dist/js/af-site.js'), context);
  function click(el) {
    const event = { target: el, preventDefault() { this.defaultPrevented = true; } };
    for (const fn of [...el.clicks, ...documentClicks]) fn.call(el, event);
    return event;
  }
  return { page, tel, wa, click };
}
test('one phone click on the landing page sends one klik_telepon to GA4, with its button label', () => {
  const { page, tel, wa, click } = landingPage();
  const ga4 = page.AF_TRACKING.googleAnalyticsId;
  assert.match(ga4, /^G-/, 'the build carries the GA4 ID');
  const events = (name) => googleCalls(page).filter((e) => e[0] === 'event' && e[1] === name);
  // An event without send_to goes to every configured destination, GA4 included.
  const toGa4 = (e) => !e[2] || !e[2].send_to || e[2].send_to === ga4;
  const call = click(tel[0]);
  assert.equal(call.defaultPrevented, undefined, 'the tel: link still dials');
  assert.deepEqual(events('klik_telepon').filter(toGa4), [['event', 'klik_telepon', { send_to: ga4, button_label: 'Telepon 0822-1947-2613' }]]);
  assert.deepEqual(clarityCalls(page).slice(1), [['event', 'klik_telepon'], ['set', 'tombol_telepon', 'Telepon 0822-1947-2613']]);
  // WhatsApp on the same page still counts one Ads conversion and one GA4 event.
  click(wa[0]);
  assert.equal(events('conversion').length, 1);
  assert.deepEqual(events('klik_whatsapp').filter(toGa4), [['event', 'klik_whatsapp', { send_to: ga4, button_label: 'hero' }]]);
  assert.equal(events('klik_telepon').length, 1, 'a WhatsApp click adds no phone event');
});
test('the real form prepares the message and hands off even when storage is blocked', () => {
  for (const blocked of [false, true]) {
    const { opened, location, saved } = landingForm(leadFields, { blocked });
    assert.ok(opened.startsWith('https://wa.me/6282219472613?text='));
    const text = decodeURIComponent(opened);
    for (const line of ['Sekolah/lembaga: Test School', 'Jumlah: 120 pcs', 'Kota pengiriman: Test City', 'foto contoh map']) assert.ok(text.includes(line), line);
    assert.ok(!/Nama PIC|No\. HP/.test(text), 'an empty PIC and the removed phone field stay out of the message');
    assert.ok(!location.href.includes('?'));
    if (blocked) assert.equal(new URLSearchParams(location.href.split('#')[1]).get('wa'), opened);
    else { assert.equal(location.href, 'terima-kasih.html'); assert.equal(saved.url, opened); }
  }
  assert.match(decodeURIComponent(landingForm({ ...leadFields, contoh: 'belum', pic: 'Bu Test' }).opened), /Nama PIC: Bu Test[\s\S]*belum punya contoh/);
});
test('the form asks for the order size, not a phone number, and holds back orders under 50 pcs', () => {
  const html = read('project/static/raporsekolah/index.html');
  const form = html.slice(html.indexOf('<form class="lead'), html.indexOf('</form>'));
  assert.ok(!/name="hp"|type="tel"/.test(form), 'the visitor already writes from their own WhatsApp');
  assert.match(form, /name="jumlah"[^>]*min="50"/);
  for (const jumlah of ['49', '', 'abc']) {
    const result = landingForm({ ...leadFields, jumlah });
    assert.equal(result.opened, undefined, `jumlah "${jumlah}" must not open WhatsApp`);
    assert.equal(result.location.href, undefined);
    assert.equal(result.err.hidden, false);
    assert.ok(result.focused);
  }
  assert.match(landingForm({ ...leadFields, jumlah: '30' }).err.innerHTML, /50 pcs[\s\S]*\/produk-standar\//);
});
test('landing CTAs carry the sample checklist; the header asks a plain question', () => {
  const { links } = landingForm(leadFields);
  const [header, hero] = links.map((l) => decodeURIComponent(l.href.split('?text=')[1]));
  assert.ok(links.every((l) => l.href.startsWith('https://wa.me/6282219472613?text=')));
  assert.match(hero, /foto contoh map[\s\S]*Jumlah: \.\.\. pcs \(minimal 50\)[\s\S]*Dibutuhkan tanggal[\s\S]*Kota pengiriman/);
  assert.ok(!header.includes('foto contoh'));
});
test('the landing page opens with the sample CTA and minimum order, and never pops up on its own', () => {
  const html = read('project/static/raporsekolah/index.html');
  const hero = html.slice(html.indexOf('<section id="hero"'), html.indexOf('<form class="lead'));
  const cta = hero.indexOf('data-wa="hero"');
  assert.ok(cta > 0 && cta < hero.indexOf('class="pricebar"'), 'the WhatsApp CTA comes before the price bar and photos');
  assert.match(hero.slice(cta, cta + 2600), /Kirim Contoh &amp; Minta Harga via WhatsApp<\/a>\s*<p class="cta-note"><strong>Minimal 50 pcs<\/strong>/);
  assert.ok(!/id="offer"|offer_tampil|setTimeout\(show|mouseout/.test(html), 'the automatic pop-up is gone');
  // No Google tag call may run when the page opens: every gtag() sits inside a click handler.
  for (const [line] of html.matchAll(/^.*gtag\(.*$/gm)) assert.match(line, /addEventListener\('click'/, line);
});

test('pages load self-hosted fonts and inline CSS; nothing render-blocking comes from Google Fonts', () => {
  for (const file of ['index.html', 'produk-standar/index.html', 'produk-custom/index.html', 'raporsekolah/index.html', 'raporsekolah/terima-kasih.html']) {
    const html = read('dist/' + file);
    assert.ok(!html.includes('fonts.googleapis.com') && !html.includes('fonts.gstatic.com'), file);
    assert.ok(!html.includes('<!-- AF_FONTS -->'), file + ' kept the font marker');
    assert.ok(!/<link rel="stylesheet"/.test(html), file + ' has a render-blocking stylesheet');
    assert.match(html, /<link rel="preload" href="\/assets\/fonts\/plus-jakarta-sans-latin\.woff2" as="font" type="font\/woff2" crossorigin>/);
    assert.match(html, /@font-face\{font-family:"Baloo 2"[^}]*src:url\(\/assets\/fonts\/baloo-2-latin\.woff2\)/);
    assert.match(html, /<script async src="\/js\/af-site\.js"><\/script>/, file + ' must not block on the tracking script');
    assert.ok(!/<script src="\/js\/af-site/.test(html));
  }
  // Thank-you: the parser runs the synchronous handoff before it even finds the async tag script.
  const thanks = read('dist/raporsekolah/terima-kasih.html');
  assert.ok(thanks.indexOf('<script src="/js/lead-handoff.js">') < thanks.indexOf('af-site.js'));
  assert.ok(!read('dist/tokens/fonts.css').includes('googleapis'));
});
test('every srcset candidate exists, and photos are lighter than the originals', () => {
  assert.match(read('dist/produk-custom/index.html'), /srcset="\/assets\/portfolio\/[\w-]+-480\.webp 480w/i, 'portfolio cards ask for a narrower copy');
  for (const file of ['index.html', 'produk-custom/index.html', 'raporsekolah/index.html']) {
    const html = read('dist/' + file);
    for (const [, set] of html.matchAll(/srcset="([^"]+)"/gi)) {
      for (const candidate of set.split(',')) {
        const [raw, w] = candidate.trim().split(/\s+/);
        const local = path.join('dist', new URL(raw, 'https://local.test/' + file).pathname);
        assert.ok(fs.existsSync(local), file + ' srcset references missing ' + raw);
        assert.match(w, /^\d+w$/);
      }
    }
    assert.ok(!html.includes('rel="preload" as="image"'), 'the hero text is the LCP element; no image preload competes with the fonts');
  }
  assert.ok(fs.statSync('dist/raporsekolah/img/stack-alazhar-480.webp').size < fs.statSync('dist/raporsekolah/img/stack-alazhar.webp').size / 3);
  for (const [logo, max] of [['logo-agatha-felix', 40e3], ['logo-mark-white', 15e3]]) {
    assert.ok(fs.statSync(`dist/assets/${logo}.webp`).size < max, logo + ' WebP is too heavy');
  }
  for (const file of ['index.html', 'produk-standar/index.html', 'produk-custom/index.html']) {
    assert.ok(!/logo-(agatha-felix|mark-white)\.png/.test(read('dist/' + file).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')), file + ' still shows a PNG logo');
  }
});
test('every WhatsApp link on the site uses the business number', () => {
  const files = ['index.html', 'produk-standar/index.html', 'produk-custom/index.html', 'raporsekolah/index.html', 'raporsekolah/terima-kasih.html',
    ...fs.readdirSync('dist/js').map((f) => 'js/' + f)];
  for (const file of files) {
    for (const [url] of read('dist/' + file).matchAll(/(?:wa\.me|api\.whatsapp\.com)\/[^\s"'`?)]*/g)) {
      assert.match(url, /^wa\.me\/6282219472613$|^wa\.me\/$/, file + ': ' + url);
    }
  }
  const custom = read('dist/produk-custom/index.html');
  const moq = custom.indexOf('Minimal 50 pcs</strong> per desain'), cta = custom.indexOf('Kirim Contoh &amp; Minta Harga via WhatsApp');
  assert.ok(moq > 0 && moq < cta && cta - moq < 2500, 'the minimum order is shown right before the hero WhatsApp button');
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
test('standard prices point at real catalogue types and are shown on the page', () => {
  const window = {};
  vm.runInNewContext(read('dist/js/HargaStandar.js'), { window });
  const hs = window.HARGA_STANDAR;
  const ids = new Set(hs.daftar.flatMap((g) => g.barang.map((b) => b[0])));
  const cols = hs.clearHolder.ukuran.map(([key]) => 'ch:' + key);
  const katalog = read('project/ui_kits/website_v2/ProdukStandarSections.jsx');
  for (const [slug, map] of Object.entries(hs.tipe)) {
    assert.ok(katalog.includes(`tipe('${slug}'`), slug + ' is not a catalogue type');
    for (const ref of typeof map === 'string' ? [map] : map) assert.ok(cols.includes(ref) || ids.has(ref), slug + ' -> ' + ref);
  }
  for (const [, row] of hs.clearHolder.isi) assert.equal(row.length, hs.clearHolder.ukuran.length);
  const html = read('dist/produk-standar/index.html');
  assert.match(html, /id="daftar-harga"/);
  assert.match(html, /belum termasuk PPN/);
  for (const [, nama, , , harga] of hs.daftar.flatMap((g) => g.barang)) assert.ok(html.includes('Rp' + harga.toLocaleString('id-ID')), nama);
  assert.ok(html.includes('Mulai Rp13.500/pcs'), 'Clear Holder card shows its lowest price');
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
// Admin HPP calculator: product definitions + calculator logic, without a DOM.
// Every number below is a test value, never a real cost.
function adminKit() {
  const window = {};
  const context = vm.createContext({ window, console });
  for (const f of ['dist/js/CustomProduk.js', 'dist/js/AdminHpp.js']) vm.runInContext(read(f), context);
  return { admin: window.AfAdmin, kit: window.AfCustom };
}
test('HPP: tiers fall back, inner costs per sheet, one-time costs are spread over the order', () => {
  const { admin, kit } = adminKit();
  const data = admin.lengkapi({});
  const press = kit.CUSTOM_PRODUK.find((p) => p.slug === 'map-press');
  const hp = data.hpp['map-press'];
  assert.ok(admin.hitungHpp(press, {}, 100, hp).kurang.length, 'an empty table is reported, not costed as zero');
  Object.assign(hp.harga.dasar.f4, { 50: 20000, 100: 18000, 500: 15000 });
  hp.harga.bahan['tpk-urat'][50] = 5000;
  hp.harga.poly.emas[50] = 3000;
  Object.assign(hp.harga['inner-tipe'].mika, { 50: 200, 300: 150 });
  hp.harga.karton.k2[50] = 2000;
  hp.harga.busa.b3[50] = 1000;
  hp.harga.punggung['ring-15'][50] = 6000;
  hp.sekali[0].biaya = 300000;
  const pick = { bahan: 'tpk-urat', poly: 'emas', 'inner-tipe': 'mika', 'inner-jumlah': '40' };
  const r = admin.hitungHpp(press, pick, 100, hp);
  assert.deepEqual([...r.kurang], []);
  // 18,000 + 5,000 + 3,000 + 40 × 200 + 2,000 + 1,000; klise 300,000 ÷ 100.
  assert.equal(r.perPcs, 37000);
  assert.equal(r.hppPcs, 40000);
  // 300 pcs: the empty base tier uses the 100 column; inner drops to 150; klise 1,000 each.
  assert.equal(admin.hitungHpp(press, pick, 300, hp).hppPcs, 18000 + 5000 + 3000 + 40 * 150 + 2000 + 1000 + 1000);
  const ring = admin.hitungHpp(press, { ...pick, 'inner-jumlah': '80', punggung: 'ring' }, 100, hp);
  assert.ok(ring.rincian.some((x) => x.label === 'Ring D 1,5 inci' && x.perPcs === 6000), 'ring size follows the sheet count');
  const lain = admin.hitungHpp(press, { ...pick, 'inner-jumlah': 'lain', 'inner-jumlah-lain': 110 }, 100, hp);
  assert.ok(lain.rincian.some((x) => x.perPcs === 110 * 200), 'a custom sheet count is costed per sheet');
  assert.ok(admin.hitungHpp(press, { ...pick, poly: 'silver' }, 100, hp).kurang.some((k) => k.startsWith('Warna poly logo: Silver')));

  const zip = kit.CUSTOM_PRODUK.find((p) => p.slug === 'zipper-bag-print');
  const zh = data.hpp['zipper-bag-print'].harga;
  zh.dasar.polos[50] = 9000;
  zh.metode.dtf[50] = 0;
  zh.sisi.depan[50] = 2500;
  zh.sisi.belakang[50] = 2500;
  zh['warna-cetak'].full[50] = 0;
  const z = admin.hitungHpp(zip, { tipe: 'polos', metode: 'dtf', sisi: ['depan', 'belakang'], 'warna-cetak': 'full' }, 100, data.hpp['zipper-bag-print']);
  assert.deepEqual([...z.kurang], []);
  assert.equal(z.hppPcs, 14000, 'each printed side adds its cost');
  assert.ok(admin.hitungHpp(zip, { tipe: 'polos', sisi: ['depan'], 'warna-cetak': 'full' }, 100, data.hpp['zipper-bag-print'])
    .kurang.some((k) => k.startsWith('Cara cetak')), '"rekomendasikan" needs a real method before costing');
});
test('HPP: selling price, customer quote, and saved data that survives new options', () => {
  const { admin, kit } = adminKit();
  assert.equal(admin.hargaJual(40000, 30, 500), 52000);
  assert.equal(admin.hargaJual(40100, 30, 500), 52500, 'rounded up, never down');
  assert.equal(admin.hargaJual(40000, null, 500), null);
  assert.equal(admin.hargaJual(33333, 0, 0), 33333);
  const press = kit.CUSTOM_PRODUK.find((p) => p.slug === 'map-press');
  const sel = kit.customSel(press, { bahan: 'tpk-urat', poly: 'emas', 'inner-tipe': 'mika', 'inner-jumlah': '40' });
  const t = admin.teksPenawaran(press, sel, 100, 52000, { nama: 'SMP Contoh', kota: 'Bekasi' }, ['Klise / plat poly']);
  for (const line of ['Untuk: SMP Contoh, Bekasi', '*Map Press*', '- Jumlah inner: 40 lembar', 'Harga: Rp52.000/pcs', 'Total: Rp5.200.000', 'termasuk klise']) {
    assert.ok(t.includes(line), 'quote is missing: ' + line + '\n' + t);
  }
  assert.ok(!/HPP|markup/i.test(t), 'the quote never shows cost or markup');

  const saved = admin.lengkapi({});
  saved.hpp['map-press'].harga.dasar.f4[100] = 18000;
  saved.hpp['map-press'].harga.lama = { x: { 50: 1 } };
  delete saved.hpp['map-press'].harga.busa;
  saved.sekolah.push({ id: 'a', nama: 'SMP Contoh', kota: '', segmen: 'premium', catatan: '' });
  const again = admin.lengkapi(JSON.parse(JSON.stringify(saved)));
  assert.equal(again.hpp['map-press'].harga.dasar.f4[100], 18000);
  assert.equal(again.hpp['map-press'].harga.busa.tanpa[50], 0, 'a new option starts empty, "tanpa" at zero');
  assert.deepEqual({ ...again.hpp['map-press'].harga.lama.x }, { 50: 1 }, 'rows for removed options are kept');
  assert.equal(again.sekolah.length, 1);
  assert.deepEqual(again.segmen.map((s) => s.markup), [null, null, null], 'no margin is assumed');
});
test('admin page stays private: noindex, untracked, unlinked, not in the sitemap', () => {
  const html = read('dist/admin/index.html');
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  assert.ok(!html.includes('af-site.js') && !html.includes('googletagmanager'), 'no Google tag on the admin page');
  assert.ok(!html.includes('clarity'), 'no Clarity on the admin page: recordings would show cost prices');
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) assert.ok(fs.existsSync(path.join('dist', raw)), 'admin references missing ' + raw);
  assert.ok(!read('dist/sitemap.xml').includes('/admin/'));
  for (const file of ['index.html', 'produk-standar/index.html', 'produk-custom/index.html', 'raporsekolah/index.html']) {
    assert.ok(!read('dist/' + file).includes('/admin/'), file + ' links to the admin page');
  }
});
test('the privacy page names every measuring tool and every public page links to it', () => {
  const html = read('dist/kebijakan-privasi/index.html');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/agatha-felix\.com\/kebijakan-privasi\/">/);
  assert.ok(!html.includes('<!-- AF_FONTS -->') && !html.includes('<!-- AF_GOOGLE_TAG -->'), 'the build fills both markers');
  assert.match(html, /<script async src="\/js\/af-site\.js"><\/script>/);
  for (const tool of ['Google Ads', 'Google Analytics', 'Microsoft Clarity']) assert.ok(html.includes('<h3>' + tool + '</h3>'), tool);
  assert.ok(!html.includes('wa.me'), 'a data request must not count as a WhatsApp conversion');
  for (const [, raw] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    assert.ok(fs.existsSync(path.join('dist', raw.endsWith('/') ? raw + 'index.html' : raw)), 'missing ' + raw);
  }
  assert.ok(read('dist/sitemap.xml').includes('<loc>https://agatha-felix.com/kebijakan-privasi/</loc>'));
  for (const file of ['index.html', 'produk-standar/index.html', 'produk-custom/index.html', 'raporsekolah/index.html', 'raporsekolah/terima-kasih.html']) {
    assert.ok(read('dist/' + file).includes('href="/kebijakan-privasi/"'), file + ' does not link the privacy page');
  }
  assert.match(read('dist/raporsekolah/index.html'), /id="privasi"[\s\S]*Google Analytics[\s\S]*Microsoft Clarity/);
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
