import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import os from 'node:os';
import http from 'node:http';
import { spawn } from 'node:child_process';

const read = (file) => fs.readFileSync(file, 'utf8');
const tag = read('project/static/js/af-site.js');
const handoff = read('project/static/js/lead-handoff.js');
const config = { googleAdsId: 'AW-18374325686', waConversionLabel: 'AW-18374325686/elV-CN2Bhe4cELbrx7lE' };
// Pass the window from prepare() to run both scripts on one page, as the browser does.
// consent: the Clarity choice already stored in localStorage ('granted', 'denied' or null).
function tracking(hostname = 'localhost', pathname = '/', window = {}, settings = config, consent = null) {
  const listeners = [], scripts = [], timers = [], navigations = [], loads = [], windowListeners = {}, bars = [], stored = {};
  window.AF_TRACKING = settings;
  window.addEventListener = (type, fn) => { (windowListeners[type] ||= []).push(fn); if (type === 'load') loads.push(fn); };
  window.requestIdleCallback = (fn) => fn();
  const context = vm.createContext({ window, URL, Date,
    location: { hostname, pathname, origin: 'https://' + hostname, assign: (url) => navigations.push(url) },
    document: { readyState: 'interactive', createElement: () => ({ setAttribute() {} }), head: { appendChild: (el) => scripts.push(el) },
      body: { appendChild: (el) => { el.parentNode = { removeChild: () => bars.splice(bars.indexOf(el), 1) }; bars.push(el); } },
      querySelectorAll: () => [], addEventListener: (_, fn) => listeners.push(fn) },
    localStorage: { getItem: (key) => (key in stored ? stored[key] : consent), setItem: (key, value) => { stored[key] = value; } },
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
  return { context, window, listeners, scripts, timers, navigations, loads, windowListeners, bars, stored, click };
}
const withClarity = { ...config, clarityId: 'tq1clarity' };
// Clarity's queue holds `arguments` objects from the page's realm; compare them as plain arrays.
const clarityCalls = (window) => JSON.parse(JSON.stringify(window.clarity.q.map((call) => Array.from(call))));
const withAnalytics = { ...withClarity, googleAnalyticsId: 'G-F2P4YVFY6P' };
const googleCalls = (window) => JSON.parse(JSON.stringify(window.dataLayer.map((call) => Array.from(call))));

test('production tag retains its Ads ID; previews do not contact Google', () => {
  assert.equal(tracking().scripts.length, 0);
  const result = tracking('agatha-felix.com');
  assert.equal(result.scripts.length, 0, 'the tag waits for the page to load');
  result.loads[0]();
  assert.equal(result.scripts.length, 1);
  assert.ok(result.scripts[0].src.endsWith(config.googleAdsId));
  assert.equal(result.window.dataLayer[1][1], config.googleAdsId);
  assert.equal(tracking('agatha-felix.com.evil.example').scripts.length, 0);
});
test('the Google tag waits for the page, but the first tap or a WhatsApp click loads it at once, once', () => {
  const tapped = tracking('agatha-felix.com', '/raporsekolah/');
  assert.equal(tapped.scripts.length, 0);
  for (const fn of tapped.windowListeners.pointerdown) fn();
  assert.equal(tapped.scripts.length, 1);
  tapped.loads[0]();
  for (const fn of tapped.windowListeners.keydown) fn();
  assert.equal(tapped.scripts.length, 1, 'never a second loader');
  const clicked = tracking('agatha-felix.com', '/raporsekolah/');
  clicked.click('https://wa.me/6282219472613');
  assert.equal(clicked.scripts.length, 1, 'a WhatsApp click sends its conversion straight away');
  assert.equal(clicked.window.dataLayer.filter((e) => e[1] === 'conversion').length, 1);
  const thanks = tracking('agatha-felix.com', '/raporsekolah/terima-kasih.html');
  assert.equal(thanks.scripts.length, 1, 'the thank-you page loads it at once');
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
  assert.equal(live.scripts.length, 0, 'nothing loads before the page has loaded');
  assert.deepEqual(clarityCalls(live.window)[0], ['consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' }]);
  assert.equal(live.loads.length, 1);
  assert.equal(live.bars.length, 0, 'the consent bar waits for the page too');
  live.loads[0]();
  assert.ok(live.scripts[0].src.includes('googletagmanager.com/gtag/js'));
  assert.equal(live.scripts[1].src, 'https://www.clarity.ms/tag/tq1clarity');
  assert.equal(live.scripts[1].async, true);
  for (const [host, page, settings] of [['localhost', '/', withClarity], ['agatha-felix.com', '/raporsekolah/terima-kasih.html', withClarity], ['agatha-felix.com', '/', config]]) {
    const off = tracking(host, page, {}, settings);
    for (const fn of off.loads) fn();
    assert.equal(off.window.clarity, undefined, host + page);
    assert.ok(!off.scripts.some((el) => String(el.src).includes('clarity')), host + page);
    assert.equal(off.bars.length, 0, 'no consent bar where Clarity does not run: ' + host + page);
  }
});
// A click on one of the consent buttons (the bar's or the privacy page's).
const consentClick = (live, value) => live.listeners[0]({ target: { closest: (sel) => (sel === '[data-af-consent]'
  ? { getAttribute: (name) => (name === 'data-af-consent' ? value : null) } : null) }, preventDefault() {} });
// The visitor scrolls (after the page has loaded).
const scroll = (live) => { for (const fn of live.windowListeners.scroll || []) fn(); };
test('Clarity consent: a bar until the visitor chooses; only "Izinkan" lets Clarity set its analytics cookies', () => {
  const live = tracking('agatha-felix.com', '/produk-custom/', {}, withClarity);
  live.loads[0]();
  assert.equal(live.bars.length, 0, 'the first screen stays clear');
  scroll(live);
  assert.equal(live.bars.length, 1, 'a first visit shows the bar once the visitor scrolls');
  assert.equal(live.bars[0].id, 'af-consent');
  assert.match(live.bars[0].innerHTML, /data-af-consent="granted">Izinkan<[\s\S]*data-af-consent="denied">Tidak</);
  assert.match(live.bars[0].innerHTML, /href="\/kebijakan-privasi\/#izin-clarity"/);
  assert.ok(!/position:fixed;[^}]*(top|inset):/.test(live.bars[0].innerHTML), 'a bottom bar, never a full-screen pop-up');
  // Text and buttons share one row (156px tall at 360px before), and the bar steps aside while a field has the keyboard.
  assert.ok(!/#af-consent\{[^}]*flex-wrap/.test(live.bars[0].innerHTML), 'one row, not two');
  assert.match(live.bars[0].innerHTML, /body:has\(input:focus,select:focus,textarea:focus\) #af-consent\{display:none\}/);
  consentClick(live, 'granted');
  assert.equal(live.stored['af-clarity-consent'], 'granted');
  assert.deepEqual(clarityCalls(live.window).at(-1), ['consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' }], 'analytics only, never ads');
  assert.equal(live.bars.length, 0, 'the bar goes once a choice is made');
  assert.equal(live.window.dataLayer.filter((e) => e[1] === 'conversion').length, 0, 'a consent click is no WhatsApp conversion');
  // Next page: the stored choice is sent before Clarity loads, and no bar returns.
  const next = tracking('agatha-felix.com', '/raporsekolah/', {}, withClarity, 'granted');
  assert.deepEqual(clarityCalls(next.window)[0], ['consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' }]);
  next.loads[0]();
  scroll(next);
  assert.equal(next.bars.length, 0);
  // Withdrawing it on the privacy page sends "denied", which makes Clarity drop its cookies.
  consentClick(next, 'denied');
  assert.equal(next.stored['af-clarity-consent'], 'denied');
  assert.deepEqual(clarityCalls(next.window).at(-1), ['consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' }]);
  const refused = tracking('agatha-felix.com', '/', {}, withClarity, 'denied');
  refused.loads[0]();
  scroll(refused);
  assert.equal(refused.bars.length, 0, '"Tidak" is remembered too');
  assert.deepEqual(clarityCalls(refused.window)[0], ['consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' }]);
  // An element with id="clarity" is window.clarity in a browser; the queue must still be made.
  const named = tracking('agatha-felix.com', '/kebijakan-privasi/', { clarity: { tagName: 'H2' } }, withClarity);
  assert.deepEqual(clarityCalls(named.window)[0], ['consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' }]);
  // Storage blocked: no choice can be kept, so Clarity stays cookieless.
  const blocked = tracking('agatha-felix.com', '/', {}, withClarity);
  blocked.context.localStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  consentClick(blocked, 'granted');
  assert.deepEqual(clarityCalls(blocked.window).at(-1), ['consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' }], 'this page still follows the choice');
});
test('the privacy page offers the Clarity choice and the bar explains it', () => {
  const html = read('dist/kebijakan-privasi/index.html');
  assert.match(html, /<h2 id="izin-clarity">Izin cookie Microsoft Clarity<\/h2>/);
  assert.match(html, /data-af-consent-status/);
  assert.match(html, /<button type="button" data-af-consent="granted"[^>]*>Izinkan<\/button><button type="button" data-af-consent="denied"[^>]*>Tolak<\/button>/);
  assert.match(html, /<h3>Microsoft Clarity<\/h3>[\s\S]*?Cookie hanya dengan izin Anda/);
  assert.ok(!html.includes('Tanpa cookie</span>'), 'Clarity is no longer described as always cookieless');
  assert.match(read('dist/raporsekolah/index.html'), /id="privasi"[\s\S]*Clarity hanya memakai cookie bila Anda mengizinkannya/);
  // Browsers expose an element's id as a window property, and Clarity's own loader reads window.clarity.
  for (const file of ['index.html', 'produk-standar/index.html', 'produk-custom/index.html', 'raporsekolah/index.html', 'kebijakan-privasi/index.html']) {
    assert.ok(!/\b(id|name)="clarity"/.test(read('dist/' + file)), file + ' has an element named "clarity"');
  }
});
test('contact clicks are counted per button in Clarity, never with the message in the link', () => {
  const live = tracking('agatha-felix.com', '/raporsekolah/', {}, withClarity);
  const queued = () => clarityCalls(live.window).slice(1);
  live.click('https://wa.me/6282219472613?text=Nama%20PIC%3A%20Budi', '_blank', { 'data-wa': 'hero', text: 'Kirim Contoh' });
  assert.deepEqual(queued(), [['event', 'klik_whatsapp'], ['set', 'tombol_whatsapp', 'hero'], ['set', 'sumber_whatsapp', 'halaman']]);
  assert.ok(!JSON.stringify(live.window.clarity.q).includes('Budi'));
  assert.equal(live.window.dataLayer.at(-1)[2].send_to, config.waConversionLabel, 'the Ads conversion still fires');
  const ads = live.window.dataLayer.length;
  const call = live.click('tel:+6282219472613', '', { text: '\n  Telepon  ' });
  assert.equal(call.defaultPrevented, undefined, 'a phone link opens as usual');
  assert.deepEqual(queued().slice(3), [['event', 'klik_telepon'], ['set', 'tombol_telepon', 'Telepon']]);
  assert.equal(live.window.dataLayer.length, ads, 'a phone call is not an Ads conversion');
  live.click('https://example.com/', '_blank', { text: 'Lainnya' });
  assert.equal(queued().length, 5);
});
test('every WhatsApp click says where its button sits: form, simulator, product sheet, floating or page', () => {
  const live = tracking('agatha-felix.com', '/produk-custom/', {}, withAnalytics);
  const source = (label) => {
    live.click('https://wa.me/6282219472613', '_blank', { 'data-wa': label });
    return [live.window.dataLayer.at(-2)[2].cta_source, clarityCalls(live.window).at(-1)];
  };
  assert.deepEqual(source('simulator'), ['simulator', ['set', 'sumber_whatsapp', 'simulator']]);
  assert.deepEqual(source('sheet-bantu')[0], 'konfigurator');
  assert.deepEqual(source('bubble')[0], 'mengambang');
  assert.deepEqual(source('sticky')[0], 'mengambang');
  assert.deepEqual(source('header')[0], 'header');
  assert.deepEqual(source('penutup')[0], 'halaman');
  // The rapor form's handoff opens WhatsApp without a link: GA4 and Clarity
  // count it from the form, and Ads does not (its thank-you URL goal does).
  const ads = live.window.dataLayer.filter((e) => e[1] === 'conversion').length;
  live.window.AFTracking.noteWhatsApp('form');
  assert.deepEqual(googleCalls(live.window).at(-1), ['event', 'klik_whatsapp',
    { send_to: withAnalytics.googleAnalyticsId, button_label: 'form', cta_source: 'formulir' }]);
  assert.deepEqual(clarityCalls(live.window).slice(-3), [['event', 'klik_whatsapp'], ['set', 'tombol_whatsapp', 'form'], ['set', 'sumber_whatsapp', 'formulir']]);
  assert.equal(live.window.dataLayer.filter((e) => e[1] === 'conversion').length, ads);
  const before = live.window.dataLayer.length;
  live.window.AFTracking.noteWhatsApp('SD Budi');
  assert.equal(live.window.dataLayer.length, before, 'only the form label is accepted');
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
  assert.deepEqual(clarityCalls(live.window).slice(1), [['event', 'klik_whatsapp'], ['set', 'tombol_whatsapp', 'Minta Penawaran via WhatsApp'],
    ['set', 'sumber_whatsapp', 'halaman']]);
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


test('GA4 shares the Google loader and contact events never carry the WhatsApp message', () => {
  const live = tracking('agatha-felix.com', '/produk-custom/', {}, withAnalytics);
  vm.runInContext(tag, live.context);
  for (const fn of live.loads) fn();
  assert.equal(live.scripts.length, 2, 'one Google loader (plus Clarity) even if the shared script runs twice');
  assert.equal(live.scripts.filter((el) => String(el.src).includes('googletagmanager')).length, 1);
  assert.deepEqual(googleCalls(live.window).filter((e) => e[0] === 'config').map((e) => e[1]),
    [config.googleAdsId, withAnalytics.googleAnalyticsId]);
  live.click(wa, '', { 'data-wa': 'hero' });
  live.click('tel:+6282219472613', '', { text: 'Telepon' });
  const events = googleCalls(live.window).filter((e) => e[0] === 'event');
  assert.deepEqual(events.filter((e) => e[1] !== 'conversion'), [
    ['event', 'klik_whatsapp', { send_to: withAnalytics.googleAnalyticsId, button_label: 'hero', cta_source: 'halaman' }],
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
test('on a prepared thank-you page a phone call still counts; the WhatsApp retry adds no second goal', () => {
  const visit = prepare(thanks, { url: wa, created: Date.now(), measured: false });
  const live = tracking('agatha-felix.com', thanksPath, visit.window, withAnalytics);
  const before = googleCalls(live.window).length;
  const retry = live.click(wa, '', { text: 'Buka WhatsApp Sekarang' });
  assert.ok(!retry.defaultPrevented, 'the button opens WhatsApp by itself');
  assert.equal(googleCalls(live.window).length, before, 'no Ads conversion and no klik_whatsapp for the lead the form already counted');
  live.click('tel:+6282219472613', '', { text: '0822-1947-2613' });
  assert.deepEqual(googleCalls(live.window).slice(before), [
    ['event', 'klik_telepon', { send_to: withAnalytics.googleAnalyticsId, button_label: '0822-1947-2613' }],
  ]);
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
function landingForm(fields, { blocked = false, before, hash = '' } = {}) {
  const html = read('project/static/raporsekolah/index.html');
  const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]).find((script) => script.includes("getElementById('leadForm')"));
  const out = { location: {}, links: [] };
  const element = { addEventListener() {}, classList: { add() {}, remove() {} }, hidden: true };
  const input = () => ({ style: {}, focus() { out.focused = true; } });
  // hidden: true, as the markup starts it.
  const form = { hidden: true, addEventListener: (type, fn) => { out[type] = fn; }, elements: { sekolah: input(), jumlah: input(), kota: input() } };
  const toggle = { attrs: {}, addEventListener: (type, fn) => { if (type === 'click') out.toggleClick = fn; }, setAttribute(k, v) { this.attrs[k] = v; } };
  Object.assign(out, { form, toggle, steps: [] });
  const link = (wa, msg) => ({ href: '', addEventListener() {}, getAttribute: (k) => ({ 'data-wa': wa, 'data-msg': msg }[k] ?? null) });
  out.links = [link('header', 'tanya'), link('hero', null), link('hero-bantu', 'bantu'), link('kontak-footer', 'tanya')];
  const location = { hash, set href(v) { out.steps.push('navigate'); out.location.href = v; }, get href() { return out.location.href; } };
  const AFTracking = {
    noteStep: (name, params) => { const v = params && (params.quote_mode || params.error_type || params.model); out.steps.push(v ? name + ':' + v : name); },
    noteWhatsApp: (label) => out.steps.push('wa:' + label),
  };
  vm.runInNewContext(code, { window: { open: (url) => { out.opened = url; }, AFTracking }, AFTracking, location,
    document: { addEventListener: (type, fn) => { if (type === 'click') out.docClick = fn; }, querySelectorAll: (sel) => sel === '[data-wa]' ? out.links : [],
      getElementById: (id) => id === 'leadForm' ? form : id === 'leadErr' ? (out.err = element) : id === 'formToggle' ? toggle : element },
    addEventListener() {}, setTimeout() {},
    sessionStorage: { setItem: (_, value) => { if (blocked) throw Error('storage blocked'); out.saved = JSON.parse(value); } },
    FormData: class { get(key) { return fields[key]; } },
  });
  // before(out): what the visitor does before submitting, e.g. picking a model.
  if (before) before(out);
  out.submit({ preventDefault() {} });
  return out;
}
const leadFields = { sekolah: 'Test School', jumlah: '120', kota: 'Test City', waktu: 'Test', contoh: 'ada', pic: '', model: 'belum' };

// Runs the built landing page's inline scripts and af-site.js on one shared
// window in production, as the browser does. A click reaches the link's own
// listeners first, then the document's, as in the DOM.
function landingPage({ cards = [] } = {}) {
  const html = read('dist/raporsekolah/index.html');
  const video = { src: '', played: 0, pause() {}, load() {}, play() { this.played++; return Promise.resolve(); },
    removeAttribute(name) { if (name === 'src') this.src = ''; } };
  const modal = { open: false, listeners: {}, video, showModal() { this.open = true; },
    close() { this.open = false; for (const fn of this.listeners.close || []) fn(); },
    querySelector: (sel) => (sel === 'video' ? video : { addEventListener() {} }),
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); } };
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
    document: { readyState: 'interactive', createElement: () => ({ setAttribute() {} }), head: { appendChild() {} },
      addEventListener: (type, fn) => { if (type === 'click') documentClicks.push(fn); },
      querySelectorAll: (sel) => ({ '[data-tel]': tel, '[data-wa]': wa, '[data-ig]': cards, '.igvid[data-video]': cards }[sel] || []),
      getElementById: (id) => (id === 'vidModal' ? modal : stub) },
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
  return { page, tel, wa, click, link, modal };
}
test('the landing page matches the "Rapor & Ijazah" campaign, and a missing clip is no empty box', () => {
  const html = read('dist/raporsekolah/index.html');
  assert.match(html, /<title>Sampul Rapor &amp; Ijazah [^<]*<\/title>/);
  assert.match(html, /<span class="eyebrow">Mulai 50 pcs · [^<]*<\/span>\s*<h1 [^>]*>Map Rapor &amp; Ijazah Berlogo Sekolah, /);
  assert.match(html, /<summary>Bisa untuk map ijazah juga\?<\/summary>/);
  // The build drops data-video for a clip that is not in the repo; CSS then shows a compact card.
  for (const [card] of html.matchAll(/<a class="igvid"[^>]*>/g)) {
    const clip = card.match(/data-video="([^"]+)"/);
    if (clip) assert.ok(fs.existsSync(path.join('dist/raporsekolah', clip[1])), card);
  }
  assert.match(html, /\.igvid:not\(\[data-video\]\)\{display:flex\}/);
});
test('client logos are square 240 px tiles, light, and all present', async () => {
  const sharp = (await import('sharp')).default;
  const html = read('dist/raporsekolah/index.html');
  const logos = [...html.matchAll(/<li( class="lg-extra")?><img src="(img\/klien\/[\w-]+\.webp)" width="240" height="240" loading="lazy" decoding="async" alt="([^"]+)"/g)]
    .map(([, extra, src, alt]) => [extra, src, alt]);
  assert.ok(logos.length >= 10, 'the client row shows the logos');
  // Phones show the first ten, schools and education first (owner, 2026-10-17).
  assert.equal(logos.filter(([extra]) => !extra).length, 10);
  assert.ok(logos.some(([extra, src]) => extra && src.includes('badan-pertanahan-nasional')), 'the one non-education client is the first to go');
  assert.match(html, /\.logos li\.lg-extra\{display:none\}/);
  // The proof numbers moved from their own band into the logo label.
  assert.match(html, /<p class="clients-label">Dipercaya <b>500\+ sekolah &amp; institusi<\/b> · <b>20 Juta\+ unit<\/b> diproduksi<\/p>/);
  assert.ok(!html.includes('class="trust"'));
  for (const [, src, alt] of logos) {
    const file = path.join('dist/raporsekolah', src);
    const { width, height } = await sharp(file).metadata();
    assert.deepEqual([width, height], [240, 240], alt);
    assert.ok(fs.statSync(file).size < 20e3, alt + ' logo is too heavy');
  }
});
test('the landing photos follow the CTA on a phone; logos, then Jahit vs Press, then the optional form', () => {
  const html = read('dist/raporsekolah/index.html');
  const at = (marker) => html.indexOf(marker);
  assert.ok(at('class="hero-main"') < at('class="hero-photo"') && at('class="hero-photo"') < at('class="hero-more"'));
  assert.match(html, /grid-template-areas:"main" "photo" "more"/, 'phones show the photos right after the CTA');
  assert.ok(at('id="leadForm"') > at('</section>'), 'the form left the hero');
  assert.ok(at('<div class="clients">') > 0 && at('<div class="clients">') < at('id="model"'), 'the logos come right after the hero');
  assert.ok(at('id="model"') < at('data-model="jahit"') && at('data-model="press"') < at('id="formToggle"') && at('id="formToggle"') < at('id="leadForm"'),
    'the two models come before the form, which opens from a button under them');
  // Two small cards side by side, also on phones; no second model block further down.
  assert.match(html, /\.models\{display:grid;grid-template-columns:1fr 1fr;/);
  assert.ok(!/@media[^{]*\{[^}]*\.models,/.test(html), 'phones keep both models in one row');
  assert.equal((html.match(/data-model="/g) || []).length, 2);
});
test('the optional form starts closed; its button, a #leadForm link or the address open it', () => {
  const html = read('project/static/raporsekolah/index.html');
  assert.match(html, /<button class="btn btn-ghost btn-form" type="button" id="formToggle" aria-expanded="false" aria-controls="leadForm">Isi detail pesanan \(opsional\)<\/button>/);
  assert.match(html, /<form class="lead card" id="leadForm" novalidate hidden>/);
  const click = (href) => ({ target: { closest: () => ({ getAttribute: (k) => (k === 'href' ? href : null) }) } });
  landingForm(leadFields, { before: (o) => {
    o.toggleClick();
    assert.deepEqual([o.form.hidden, o.toggle.attrs['aria-expanded']], [false, 'true']);
    o.toggleClick();
    assert.deepEqual([o.form.hidden, o.toggle.attrs['aria-expanded']], [true, 'false'], 'the button closes it again');
    o.docClick(click('#model'));
    assert.equal(o.form.hidden, true, 'another link leaves it closed');
    o.docClick(click('#leadForm'));
    assert.equal(o.form.hidden, false);
  } });
  assert.equal(landingForm(leadFields, { hash: '#leadForm' }).form.hidden, false, 'an address ending in #leadForm opens it');
  assert.equal(landingForm(leadFields).form.hidden, true);
  // Typing in the form hides the phone's sticky bar, so it never covers a field.
  assert.match(html, /body:has\(form\.lead :focus\) \.stickybar\{display:none\}/);
});
test('a testimonial clip plays on the page, not on Instagram, and counts once', () => {
  const card = { href: 'https://www.instagram.com/p/DdDqBuSStgs/', target: '_blank', clicks: [], dataset: { video: 'img/testi-cikeas.mp4' },
    classList: { add() {} }, getAttribute: (k) => ({ 'data-ig': '', 'data-video': 'img/testi-cikeas.mp4' }[k] ?? null),
    addEventListener: (type, fn) => { if (type === 'click') card.clicks.push(fn); },
    querySelector: (sel) => (sel === '.igvid-name' ? { textContent: 'Sekolah Alam Cikeas' } : { appendChild() {} }) };
  card.closest = () => card;
  const { page, click, modal } = landingPage({ cards: [card] });
  const ga4 = page.AF_TRACKING.googleAnalyticsId;
  assert.equal(click(card).defaultPrevented, true, 'Instagram does not open');
  assert.ok(modal.open);
  assert.deepEqual([modal.video.src, modal.video.played], ['img/testi-cikeas.mp4', 1]);
  assert.deepEqual(googleCalls(page).filter((e) => e[0] === 'event'),
    [['event', 'video_start', { send_to: ga4, video_title: 'Sekolah Alam Cikeas', video_provider: 'agatha-felix.com' }]], 'no klik_instagram');
  assert.deepEqual(clarityCalls(page).slice(1), [['event', 'putar_video'], ['set', 'video', 'Sekolah Alam Cikeas']]);
  modal.close();
  assert.equal(modal.video.src, '', 'closing stops the download');
});
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
  assert.deepEqual(events('klik_whatsapp').filter(toGa4), [['event', 'klik_whatsapp', { send_to: ga4, button_label: 'hero', cta_source: 'halaman' }]]);
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
test('landing CTAs open a short sample message; "belum punya contoh" asks for help; contact links ask a plain question', () => {
  const { links } = landingForm(leadFields);
  const [header, hero, bantu, footer] = links.map((l) => decodeURIComponent(l.href.split('?text=')[1]));
  assert.ok(links.every((l) => l.href.startsWith('https://wa.me/6282219472613?text=')));
  // One line to start the chat; quantity, date and city follow there (owner, 2026-10-17).
  assert.equal(hero, 'Halo Agatha Felix, saya mau minta harga map rapor / ijazah custom. Saya kirim foto contohnya ya.');
  assert.ok(!/\.\.\.|Jumlah|Kota|\n/.test(hero), 'no questionnaire to fill in before the chat starts');
  // A visitor without a sample has their own link, which never says a photo follows.
  assert.equal(bantu, 'Halo Agatha Felix, saya mau buat map rapor / ijazah custom, tapi belum punya contoh. Mohon dibantu pilih modelnya ya.');
  for (const plain of [header, footer]) assert.ok(!/foto|Model/.test(plain), plain);
});
test('the landing page opens with the sample CTA, the minimum order and help without a sample, and never pops up on its own', () => {
  const html = read('project/static/raporsekolah/index.html');
  const hero = html.slice(html.indexOf('<section id="hero"'), html.indexOf('</section>', html.indexOf('<section id="hero"')));
  const cta = hero.indexOf('data-wa="hero"');
  assert.ok(cta > 0 && cta < hero.indexOf('class="pricebar"'), 'the WhatsApp CTA comes before the price bar and photos');
  // The CTA speaks to schools that already have a sample (owner, 2026-10-17); right under it,
  // a visitor without one gets a WhatsApp link of their own.
  assert.match(hero.slice(cta, cta + 2800), /Kirim Contoh Map &amp; Minta Harga<\/a>\s*<p class="cta-note"><strong>Minimal 50 pcs<\/strong>[^]*?<p class="cta-help"><a href="https:\/\/wa\.me\/6282219472613" [^>]*data-wa="hero-bantu" data-msg="bantu">Belum punya contoh\? Kami bantu pilih model\.<\/a><\/p>/);
  assert.match(hero, /<p class="kirim"><b>Cukup kirim foto map contoh<\/b>[^<]*Jumlah, tanggal, dan kota bisa menyusul di chat\.<\/p>/);
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
  const moq = custom.indexOf('Minimal 50 pcs</strong> per desain'), cta = custom.indexOf('Minta Harga &amp; Mockup Gratis');
  assert.ok(moq > 0 && moq < cta && cta - moq < 2500, 'the minimum order is shown right before the hero WhatsApp button');
  assert.ok(custom.indexOf('Belum punya contoh? Kami bantu pilih model.') > cta);
  const heroLink = custom.match(/<a [^>]*data-wa="hero"[^>]*>/)[0];
  const heroText = decodeURIComponent(heroLink.match(/href="([^"]+)"/)[1].split('?text=')[1]);
  assert.match(heroText, /Kalau ada, saya kirim foto contohnya[\s\S]*Kalau belum ada, mohon dibantu pilih modelnya/);
  assert.ok(!/^Saya kirim foto/m.test(heroText));
});

test('the footer number is a WhatsApp link, and iPhone Safari leaves the page text alone', () => {
  for (const file of ['index.html', 'produk-standar/index.html', 'produk-custom/index.html', 'raporsekolah/index.html']) {
    const html = read('dist/' + file);
    // Safari wraps a plain phone number in a tel: link before React hydrates; the HTML then
    // no longer matches and React re-renders the page (errors #418, #425, #423).
    assert.match(html, /<meta name="format-detection" content="telephone=no"\/?>/, file);
    const footer = html.slice(html.lastIndexOf('<footer'));
    assert.match(footer, /<a href="https:\/\/wa\.me\/6282219472613[^"]*"[^>]*data-wa="kontak-footer"[^>]*>WhatsApp:? (\+62 822-1947-2613|0822-1947-2613)<\/a>/, file);
  }
  assert.match(read('project/static/js/af-site.js'), /'kontak-footer': 'footer'/, 'GA4 reports these clicks as cta_source footer');
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
  assert.ok(html.includes('Update <!-- -->' + hs.update), 'price list shows its date');
  assert.doesNotMatch(html, /PPN/, 'prices are final, no PPN note');
  for (const [, nama, , , harga] of hs.daftar.flatMap((g) => g.barang)) assert.ok(html.includes('Rp' + harga.toLocaleString('id-ID')), nama);
  assert.ok(html.includes('Mulai Rp20.000/pcs'), 'Clear Holder card shows its lowest price');
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
test('a malformed address hash (#%) opens no product instead of blanking the page; deep links still open', () => {
  const { kit } = customKit();
  assert.equal(kit.slugFromHash('#custom-map-press'), 'map-press');
  assert.equal(kit.slugFromHash('#custom-map%2Dpress'), 'map-press', 'an escaped link still decodes');
  for (const hash of ['', '#', '#%', '#custom-%', '#custom-%E0%A4%A', '#custom-tidak-ada', '#map-press']) assert.equal(kit.slugFromHash(hash), null, hash);
  const window = {};
  vm.runInNewContext(read('dist/js/ProdukStandarSections.js'), { window });
  const standar = window.AfStandar;
  assert.equal(standar.slugFromHash('#clear-holder'), 'clear-holder');
  assert.equal(standar.slugFromHash('#clear-holder-a4'), 'clear-holder-a4');
  for (const hash of ['', '#%', '#clear-holder%', '#%E0%A4%A', '#tidak-ada']) assert.equal(standar.slugFromHash(hash), null, hash);
  // The hash is decoded nowhere else, so no URIError can escape a React effect and empty #root.
  for (const f of ['CustomProduk', 'ProdukStandarSections']) {
    const src = read('project/ui_kits/website_v2/' + f + '.jsx');
    assert.equal((src.match(/decodeURIComponent\(/g) || []).length, 1, f);
    assert.match(src, /const sync = \(\) => setOpenSlug\(slugFromHash\(location\.hash\)\);/, f);
  }
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

// --- Audit 2026-10-07: steps before contact, quick quote, zoom, labels, layout -----

// The React pages list their hydration scripts in one inline loader that starts
// them after the first paint.
const afterPaint = (html) => JSON.parse(html.match(/<script>\(function\(\)\{var s=(\[[^\]]*\]);/)[1]);
// Scripts started at the same moment that need no React and run as soon as they arrive.
const afterPaintAlone = (html) => JSON.parse(html.match(/<script>\(function\(\)\{var s=\[[^\]]*\];var a=(\[[^\]]*\]);/)[1]);
test('React pages load their hydration scripts after the first paint, in order, and every one exists', () => {
  for (const [file, page] of [['index.html', 'index'], ['produk-standar/index.html', 'produk-standar'], ['produk-custom/index.html', 'produk-custom']]) {
    const html = read('dist/' + file);
    assert.ok(!/<script defer src=/.test(html), file + ' still requests a script at parse time');
    const list = afterPaint(html);
    assert.deepEqual(list.slice(0, 3), ['/vendor/react.production.min.js', '/vendor/react-dom.production.min.js', '/_ds_bundle.js']);
    assert.equal(list.at(-1), '/js/page-' + page + '.js', 'the page glue runs after every module it uses');
    for (const src of [...list, ...afterPaintAlone(html)]) assert.ok(fs.existsSync(path.join('dist', src)), file + ': missing ' + src);
    assert.match(html, /e\.async=false/, 'dynamic scripts keep their order');
    assert.match(html, /requestAnimationFrame\(function\(\)\{setTimeout\(go,0\);\}\)/);
  }
});

test('steps before contact send only known names and enum values, never typed text', () => {
  const ga4 = withAnalytics.googleAnalyticsId;
  const live = tracking('agatha-felix.com', '/produk-custom/', {}, withAnalytics);
  const step = live.window.AFTracking.noteStep;
  assert.equal(step('product_detail_open', { product_id: 'map-jahit', cta_position: 'kartu' }), true);
  assert.equal(step('quote_start', { product_id: 'map-jahit', quote_mode: 'bantu' }), true);
  assert.equal(step('quote_form_submit', { model: 'jahit' }), true);
  assert.equal(step('quote_form_error', { error_type: 'di_bawah_minimum' }), true);
  assert.equal(step('simulator_start', { sim_source: 'konfigurator' }), true);
  assert.equal(step('model_select', { model: 'press' }), true);
  for (const [name, params] of [
    ['product_detail_open', { product_id: 'SD Budi Luhur', cta_position: 'kartu' }],
    ['product_detail_open', { product_id: 'map-jahit', cta_position: 'tombol lain' }],
    ['quote_start', { product_id: 'map-jahit', quote_mode: 'detail', sekolah: 'SD Budi' }],
    ['klik_bebas', { product_id: 'map-jahit' }],
    ['quote_form_submit', {}],
    ['quote_form_error', { error_type: 'Test School kurang' }],
    ['model_select', { model: 'bordir' }],
    ['simulator_start', { sim_source: 'SD Budi' }],
  ]) {
    const before = live.window.dataLayer.length;
    const sent = step(name, params);
    if (name === 'quote_start') {
      // Extra keys are dropped, not passed through.
      assert.equal(sent, true);
      assert.ok(!JSON.stringify(googleCalls(live.window)).includes('SD Budi'));
    } else {
      assert.equal(sent, false, name + ' ' + JSON.stringify(params));
      assert.equal(live.window.dataLayer.length, before);
    }
  }
  const events = googleCalls(live.window).filter((e) => e[0] === 'event');
  assert.deepEqual(events.slice(0, 6), [
    ['event', 'product_detail_open', { product_id: 'map-jahit', cta_position: 'kartu', send_to: ga4 }],
    ['event', 'quote_start', { product_id: 'map-jahit', quote_mode: 'bantu', send_to: ga4 }],
    ['event', 'quote_form_submit', { model: 'jahit', send_to: ga4 }],
    ['event', 'quote_form_error', { error_type: 'di_bawah_minimum', send_to: ga4 }],
    ['event', 'simulator_start', { sim_source: 'konfigurator', send_to: ga4 }],
    ['event', 'model_select', { model: 'press', send_to: ga4 }],
  ]);
  assert.ok(events.every((e) => e[2].send_to === ga4), 'never an Ads destination');
  assert.deepEqual(clarityCalls(live.window).slice(1, 14), [['event', 'product_detail_open'], ['set', 'produk', 'map-jahit'],
    ['event', 'quote_start'], ['set', 'produk', 'map-jahit'], ['event', 'quote_form_submit'], ['set', 'model_rapor', 'jahit'],
    ['event', 'quote_form_error'], ['set', 'form_error', 'di_bawah_minimum'], ['event', 'simulator_start'], ['set', 'simulator_dari', 'konfigurator'],
    ['event', 'model_select'], ['set', 'model_rapor', 'press'], ['event', 'quote_start']]);
  const preview = tracking('localhost', '/produk-custom/', {}, withAnalytics);
  preview.window.AFTracking.noteStep('quote_start', { product_id: 'map-jahit', quote_mode: 'detail' });
  assert.ok(!googleCalls(preview.window).some((e) => e[1] === 'quote_start'), 'previews send nothing');
});

test('the rapor form tells apart starting, a failed check, and a valid handoff to WhatsApp', () => {
  // landingForm() submits once, as a visitor would.
  const ok = landingForm(leadFields);
  assert.deepEqual(ok.steps, ['quote_form_submit:belum', 'wa:form', 'navigate'], 'counted after the handoff, before leaving the page');
  ok.focusin();
  assert.equal(ok.steps.at(-1), 'quote_start:form', 'the first field starts the quote');
  for (const [fields, error] of [[{ ...leadFields, jumlah: '20' }, 'di_bawah_minimum'], [{ ...leadFields, sekolah: '' }, 'data_kurang']]) {
    const bad = landingForm(fields);
    assert.deepEqual(bad.steps, ['quote_form_error:' + error], 'a failed check is its own event, never a submit');
    assert.equal(bad.location.href, undefined);
  }
});

test('the quick quote path sends only what the buyer picked, never defaults as their choice', () => {
  const { kit } = customKit();
  const press = kit.CUSTOM_PRODUK.find((p) => p.slug === 'map-press');
  const none = kit.pesanBantu(press, {}, 100, 1, {});
  assert.match(none, /Map Press[\s\S]*belum tahu bahan dan finishing-nya[\s\S]*Jumlah: 100 pcs[\s\S]*Kalau ada, saya kirim foto contoh atau logo/);
  assert.ok(!none.includes('Yang sudah saya pilih') && !none.includes('Spesifikasi:'), 'no defaults listed');
  const some = kit.pesanBantu(press, { ukuran: 'a4', 'warna-sampul': 'navy' }, 150, 1, { sekolah: 'SD Contoh', kota: 'Bekasi', waktu: 'Dalam 1 bulan' });
  assert.match(some, /Yang sudah saya pilih:\n- Ukuran: [^\n]+\n- Warna sampul: navy/);
  assert.equal((some.match(/^- /gm) || []).length, 2, 'only the two picks');
  assert.match(some, /Jumlah: 150 pcs\nSekolah \/ instansi: SD Contoh\nKota pengiriman: Bekasi\nDibutuhkan: Dalam 1 bulan/);
  // The detail path still lists the full specification, defaults included.
  assert.match(kit.pesanCustom(press, {}, 100, 1, {}), /Spesifikasi:\n- Ukuran:/);
  // Only rapor/ijazah maps quote the owner's 100 pcs average.
  assert.deepEqual(JSON.parse(JSON.stringify(kit.CUSTOM_PRODUK.filter((p) => p.kisaran100).map((p) => p.slug))), ['map-jahit', 'map-press']);
  assert.ok(!read('project/ui_kits/website_v2/CustomProduk.jsx').includes('Harga dikirim di penawaran'));
});

// --- 2026-10-13: configurator drafts, simulator handoff, rapor model, tracking ----

const plain = (value) => JSON.parse(JSON.stringify(value));
test('the quantity advice follows the colour minimum: 3 colours start at 150 pcs, without "Disarankan 100 pcs"', () => {
  const { kit } = customKit();
  assert.deepEqual(plain(kit.jumlahSaran(1)), { min: 50, pilihan: [50, 100, 300, 500], teks: 'Disarankan 100 pcs agar harga per pcs lebih ekonomis.' });
  assert.deepEqual(plain(kit.jumlahSaran(2)).pilihan, [100, 300, 500], '100 pcs is still allowed, so it stays the advice');
  const tiga = plain(kit.jumlahSaran(3));
  assert.deepEqual([tiga.min, tiga.pilihan], [150, [150, 300, 500]], 'the quick picks start at the minimum');
  assert.ok(!tiga.teks.includes('100') && tiga.teks.includes('150 pcs untuk 3 warna'), tiga.teks);
  assert.deepEqual(plain(kit.jumlahSaran(20)).pilihan, [1000]);
  const sheet = read('project/ui_kits/website_v2/CustomProduk.jsx');
  assert.match(sheet, /<p className="af-cp-hint">\{saran\.teks\}<\/p>/);
  assert.ok(!sheet.includes('>Disarankan 100 pcs agar harga per pcs lebih ekonomis.<'), 'no fixed advice left in the sheet');
});
test('Map Press, 3 colours, 150 pcs: the simulator message carries the whole sheet, and the page keeps the draft', () => {
  const window = {};
  const context = vm.createContext({ window, console });
  for (const f of ['dist/js/CustomHarga.js', 'dist/js/CustomProduk.js', 'dist/js/Simulator.js']) vm.runInContext(read(f), context);
  const kit = window.AfCustom, sim = window.AfSimulator;
  const press = kit.CUSTOM_PRODUK.find((p) => p.slug === 'map-press');
  const draft = { ...kit.DRAFT_BARU, warnaCount: 3, jumlah: 150, raw: { ukuran: 'a4' }, info: { sekolah: 'SD Uji', kota: 'Bekasi', waktu: '' } };
  assert.equal(kit.ringkasDraft(draft), '3 warna · 150 pcs');
  assert.equal(kit.pesanDraft(press, draft), kit.pesanCustom(press, draft.raw, 150, 3, draft.info), 'the same message as the sheet');
  const msg = sim.pesanSimulator({ sampul: 'Hijau', tulisan: 'Emas', nama: '' }, press, draft);
  assert.match(msg, /^Halo Agatha Felix! Saya mau minta penawaran \*Map Press\*/);
  assert.match(msg, /- Ukuran: A4[\s\S]*\nJumlah: 150 pcs \(3 warna, minimal 50 pcs per warna\)\nSekolah \/ instansi: SD Uji\nKota pengiriman: Bekasi\n\nDesain dari simulator rapor:\n- Warna sampul: Hijau\n- Warna tulisan: Emas\n\n/);
  assert.equal(msg.split('\n').at(-1), press.fileNote, 'the logo note still closes the message');
  assert.match(kit.pesanDraft(press, { ...kit.DRAFT_BARU, warnaCount: 3, jumlah: 100 }), /Jumlah: 150 pcs \(3 warna/, 'raised to the colour minimum, as the sheet does');
  const bantu = sim.pesanSimulator({ sampul: 'Biru', tulisan: 'Putih', nama: 'SD Uji' }, press, { ...draft, bantu: true });
  assert.match(bantu, /belum tahu bahan[\s\S]*Jumlah: 150 pcs[\s\S]*- Nama sekolah di sampul: SD Uji\n\nKalau ada, saya kirim foto contoh atau logo/);
  // One cover colour, never two: a colour typed in the sheet wins over the simulator's
  // preview, and a swatch picked in the simulator is written into the sheet.
  const navy = sim.pesanSimulator({ sampul: 'Oranye', tulisan: 'Emas', nama: '' }, press, { ...draft, raw: { 'warna-sampul': 'Navy' } });
  assert.deepEqual(navy.match(/Warna sampul: .*/g), ['Warna sampul: Navy']);
  assert.match(navy, /Desain dari simulator rapor:\n- Warna tulisan: Emas\n/);
  assert.deepEqual(msg.match(/Warna sampul: .*/g), ['Warna sampul: Hijau'], 'without a sheet colour, the simulator names it');
  const simSrc = read('project/ui_kits/website_v2/Simulator.jsx');
  assert.match(simSrc, /if \(dari\) order\.ubah\(dari, \{ raw: \{ \.\.\.draft\.raw, 'warna-sampul': SIM_COLORS\[i\]\[0\] \} \}\);/);
  assert.match(simSrc, /onClick=\{\(\) => pilihSampul\(i\)\}/);
  // Straight to the simulator, no product: the quantity is asked for, never left blank.
  const lepas = sim.pesanSimulator({ sampul: 'Oranye', tulisan: 'Kuning', nama: '' });
  assert.match(lepas, /\nJumlah: \.\.\. pcs \(minimal 50 pcs per warna\)\n/);
  assert.ok(!/^Jumlah: *$/m.test(lepas));
  // The drafts live in the page and both the sheets and the simulator read them,
  // so reopening a sheet shows the same colours and quantity.
  const page = read('project/ui_kits/website_v2/ProdukCustomSections.jsx');
  assert.match(page, /const order = window\.useCustomDrafts\(\);/);
  assert.match(page, /<window\.CustomProdukSection order=\{order\} \/>/);
  assert.match(page, /<window\.SimulatorRapor order=\{order\} \/>/);
  const sheet = read('project/ui_kits/website_v2/CustomProduk.jsx');
  const body = sheet.slice(sheet.indexOf('function CustomSheet('), sheet.indexOf('function CustomProdukSection('));
  assert.ok(!/React\.useState\((100|1|\{\}|false)\)/.test(body), 'the sheet keeps no order state of its own');
  // Typing in a text field (cover colour, sheet count) starts the quote like a chip does.
  assert.match(body, /const setRaw = \(next\) => \{ mulai\(\); onDraft\(\{ raw: next \}\); \};/);
  assert.match(read('project/ui_kits/website_v2/Simulator.jsx'), /<strong>\{dari\.name\} · \{C\.ringkasDraft\(draft\)\}<\/strong>/, 'the simulator shows what it sends along');
});
test('a rapor model picked on the landing page goes into the form and every quote message', () => {
  const html = read('project/static/raporsekolah/index.html');
  for (const m of ['jahit', 'press']) assert.match(html, new RegExp('<button class="btn btn-pilih" type="button" data-model="' + m + '" aria-pressed="false">'));
  const form = html.slice(html.indexOf('<form class="lead'), html.indexOf('</form>'));
  assert.match(form, /name="model" value="jahit"[\s\S]*name="model" value="press"[\s\S]*name="model" value="belum" checked/);
  // The visitor picks Jahit (a card or the form both land here), then submits.
  const out = landingForm({ ...leadFields, model: 'jahit' }, { before: (o) => o.change({ target: { name: 'model', value: 'jahit' } }) });
  assert.match(decodeURIComponent(out.opened), /Sekolah\/lembaga: Test School\nModel: Rapor Jahit\nJumlah: 120 pcs/);
  assert.deepEqual(out.steps, ['model_select:jahit', 'quote_form_submit:jahit', 'wa:form', 'navigate']);
  const [header, hero, bantu] = out.links.map((l) => decodeURIComponent(l.href.split('?text=')[1]));
  assert.equal(hero, 'Halo Agatha Felix, saya mau minta harga map rapor / ijazah custom model Rapor Jahit. Saya kirim foto contohnya ya.', 'the shared quote buttons name the model');
  assert.match(bantu, /custom model Rapor Jahit, tapi belum punya contoh\. Mohon dibantu ya\.$/, 'no request to pick a model once one is picked');
  assert.ok(!header.includes('model'), 'the header question stays plain');
  // Back to "Belum tahu": the model goes again.
  const reset = landingForm(leadFields, { before: (o) => { o.change({ target: { name: 'model', value: 'press' } }); o.change({ target: { name: 'model', value: 'belum' } }); } });
  assert.ok(!decodeURIComponent(reset.links[1].href).includes(' model '));
  assert.match(decodeURIComponent(reset.opened), /Model: belum tahu, mohon disarankan/);
  assert.deepEqual(reset.steps.slice(0, 2), ['model_select:press', 'quote_form_submit:belum'], '"Belum tahu" is no model choice');
});

test('product and portfolio photos open large; every zoom target exists and is reachable by keyboard', () => {
  // The zoom script works on the prerendered HTML, so it runs on its own: queued
  // behind React, a photo tapped before hydration did nothing (a Clarity dead click).
  for (const file of ['index.html', 'produk-standar/index.html', 'produk-custom/index.html']) {
    const html = read('dist/' + file);
    assert.deepEqual(afterPaintAlone(html), ['/js/af-zoom.js'], file);
    assert.ok(!afterPaint(html).includes('/js/af-zoom.js'), file + ' still waits for React');
  }
  assert.match(read('project/ui_kits/website_v2/Sheet.jsx'), /data-zoom=\{src\} role="button" tabIndex=\{i === slide \? 0 : -1\}/, 'sheet photos zoom; only the one in view takes focus');
  for (const [file, min] of [['raporsekolah/index.html', 15], ['produk-custom/index.html', 8]]) {
    const html = read('dist/' + file);
    assert.ok(file.startsWith('raporsekolah') ? /<script defer src="\/js\/af-zoom\.js"><\/script>/.test(html) : afterPaintAlone(html).includes('/js/af-zoom.js'), file);
    const triggers = [...html.matchAll(/<img [^>]*data-zoom="([^"]+)"[^>]*>/g)];
    assert.ok(triggers.length >= min, `${file}: ${triggers.length} zoomable photos`);
    for (const [tag, src] of triggers) {
      const local = path.join('dist', new URL(src, 'https://local.test/' + file).pathname);
      assert.ok(fs.existsSync(local), `${file}: zoom target missing ${src}`);
      assert.match(tag, /role="button"/);
      assert.match(tag, /tabindex="0"|tabIndex="0"/i);
      assert.match(tag, /aria-label="Perbesar foto: [^"]+"/);
    }
  }
  // The simulator preview (typed name, uploaded logo) is never a zoom target and stays masked.
  const custom = read('dist/produk-custom/index.html');
  const sim = custom.slice(custom.indexOf('id="simulator"'), custom.indexOf('id="simulator"') + 9000);
  assert.ok(!sim.includes('data-zoom='));
  assert.match(sim, /class="af-sim-preview" data-clarity-mask="true"/);
  const zoom = read('dist/js/af-zoom.js');
  assert.match(zoom, /showModal\(\)/);
  assert.match(zoom, /e\.stopPropagation\(\)/, 'keys stay out of the product sheet underneath');
  assert.match(zoom, /opener\.focus/, 'focus goes back to the photo');
});

test('every WhatsApp button carries a fixed data-wa label', () => {
  for (const file of ['index.html', 'produk-standar/index.html', 'produk-custom/index.html', 'raporsekolah/index.html']) {
    const html = read('dist/' + file);
    for (const [tag] of html.matchAll(/<a [^>]*href="https:\/\/wa\.me\/[^"]*"[^>]*>/g)) {
      assert.match(tag, /data-wa="[a-z-]+"/, file + ': ' + tag.slice(0, 120));
    }
  }
  for (const f of fs.readdirSync('project/ui_kits/website_v2').filter((f) => f.endsWith('.jsx'))) {
    for (const [line] of read('project/ui_kits/website_v2/' + f).matchAll(/^.*color="wa".*$/gm)) assert.match(line, /data-wa=/, f + ': ' + line.trim().slice(0, 100));
  }
});

test('contrast: WhatsApp buttons use dark text, muted and deep text colours meet WCAG AA', () => {
  const lum = (hex) => {
    const c = hex.match(/\w\w/g).map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const tokens = read('project/tokens/colors.css');
  const v = (name) => tokens.match(new RegExp('--' + name + ':\\s*(#[0-9A-Fa-f]{6})'))[1];
  assert.ok(ratio(v('af-wa-ink'), v('af-wa')) >= 4.5);
  assert.ok(ratio(v('af-ink-3'), '#FFFFFF') >= 4.5 && ratio(v('af-ink-3'), v('af-paper')) >= 4.5);
  assert.ok(ratio(v('af-orange-deep'), v('af-orange-soft')) >= 4.5);
  assert.ok(ratio(v('af-green-deep'), v('af-green-tint')) >= 4.5);
  assert.ok(ratio(v('af-blue-deep'), v('af-blue-tint')) >= 4.5 && ratio(v('af-blue-deep'), '#FFFFFF') >= 4.5);
  assert.ok(ratio(v('af-blue-deep'), v('af-blue-soft')) >= 4.5, 'blue badges');
  assert.ok(ratio(v('af-yellow-ink'), v('af-yellow-soft')) >= 4.5, 'yellow badges');
  assert.match(read('project/components/core/Badge.jsx'), /yellow: \['var\(--af-yellow-soft\)', 'var\(--af-yellow-ink\)'\]/);
  assert.match(read('project/components/content/SectionHeader.jsx'), /blue: 'var\(--af-blue-deep\)'/);
  assert.match(read('project/components/core/Button.jsx'), /wa: +\['var\(--af-wa\)', +'var\(--af-wa-deep\)', 'var\(--af-wa-ink\)'\]/);
  const rapor = read('project/static/raporsekolah/index.html');
  assert.match(rapor, /\.btn-wa\{background:var\(--wa\);color:var\(--ink\)/);
  assert.ok(ratio(rapor.match(/--ink3:(#\w{6})/)[1], '#FFFFFF') >= 4.5);
});

test('landing rapor has one main landmark; the custom page shows proof before the simulator', () => {
  const rapor = read('dist/raporsekolah/index.html');
  assert.equal((rapor.match(/<main\b/g) || []).length, 1);
  assert.ok(rapor.indexOf('<main') < rapor.indexOf('<section id="hero"') && rapor.indexOf('</main>') < rapor.indexOf('<footer'));
  const custom = read('dist/produk-custom/index.html');
  const at = (marker) => custom.indexOf(marker);
  assert.ok(at('class="af-pc-klien"') > 0 && at('class="af-pc-klien"') < at('id="produk-custom"'), 'client logos under the hero');
  assert.ok(at('id="karya"') > 0 && at('id="karya"') < at('id="simulator"'), 'portfolio before the simulator');
  for (const [, src] of custom.matchAll(/<img src="(\/raporsekolah\/img\/klien\/[\w-]+\.webp)"/g)) assert.ok(fs.existsSync(path.join('dist', src)), src);
});

// Runs preview.mjs on a free port over a throwaway dist/, with a "dist-…" file
// and folder beside it that must stay unreadable.
async function previewServer() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'af-preview-'));
  const dist = path.join(root, 'dist');
  fs.mkdirSync(path.join(dist, 'produk-custom'), { recursive: true });
  fs.mkdirSync(path.join(root, 'dist-backup'));
  fs.writeFileSync(path.join(dist, 'index.html'), '<p>beranda</p>');
  fs.writeFileSync(path.join(dist, 'produk-custom', 'index.html'), '<p>custom</p>');
  fs.writeFileSync(path.join(dist, '404.html'), '<p>tidak ada</p>');
  fs.writeFileSync(path.join(root, 'dist-audit-marker.txt'), 'RAHASIA-LUAR');
  fs.writeFileSync(path.join(root, 'dist-backup', 'secret.txt'), 'RAHASIA-BACKUP');
  const child = spawn(process.execPath, ['preview.mjs'], { env: { ...process.env, PORT: '0', PREVIEW_DIST: dist } });
  const stop = () => { child.kill(); fs.rmSync(root, { recursive: true, force: true }); };
  let port;
  try {
    port = await new Promise((ok, fail) => {
      let out = '';
      child.stdout.on('data', (d) => { out += d; const m = out.match(/localhost:(\d+)/); if (m) ok(Number(m[1])); });
      child.on('exit', (code) => fail(new Error('preview exited with ' + code)));
    });
  } catch (err) { stop(); throw err; }
  // http.get sends the path exactly as written; fetch would normalise it first.
  const get = (p) => new Promise((ok, fail) => http.get({ host: '127.0.0.1', port, path: p }, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (d) => { body += d; });
    res.on('end', () => ok({ status: res.statusCode, body }));
  }).on('error', fail));
  return { get, child, stop };
}
test('the preview server serves dist/ only: no traversal, no "dist-…" sibling', async () => {
  const server = await previewServer();
  try {
    assert.deepEqual(await server.get('/'), { status: 200, body: '<p>beranda</p>' });
    assert.deepEqual(await server.get('/produk-custom'), { status: 200, body: '<p>custom</p>' });
    for (const p of ['/..%5Cdist-audit-marker.txt', '/%2E%2E/dist-audit-marker.txt', '/%2E%2E%2Fdist-audit-marker.txt',
      '/../dist-audit-marker.txt', '/..%5Cdist-backup%5Csecret.txt', '/%2E%2E/dist-backup/secret.txt']) {
      const res = await server.get(p);
      assert.equal(res.status, 404, p);
      assert.ok(!res.body.includes('RAHASIA'), p);
    }
  } finally { server.stop(); }
});
test('a malformed URL gets 400 and the preview keeps serving the requests after it', async () => {
  const server = await previewServer();
  try {
    for (const p of ['/%', '/%E0%A4%A', '/produk%ZZ']) assert.equal((await server.get(p)).status, 400, p);
    assert.deepEqual(await server.get('/'), { status: 200, body: '<p>beranda</p>' });
    assert.equal(server.child.exitCode, null, 'the process is still running');
  } finally { server.stop(); }
});
