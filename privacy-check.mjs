// Clarity privacy check. Runs the real Clarity recorder on the built site in
// headless Chrome, types marker values into every field a visitor fills in,
// uploads a logo, clicks the WhatsApp buttons, and fails if a marker or the
// logo reaches a link in the page or anything Clarity would upload. It also
// checks that every WhatsApp button still opens the full message and counts
// exactly one Google Ads conversion.
//
//   node build.mjs && node privacy-check.mjs
//
// Needs Chrome (CHROME_PATH overrides the default path) and network access to
// download Clarity's recorder. Nothing reaches Clarity, Google or WhatsApp:
// Chrome resolves their hosts to nowhere, and the Clarity requests are answered
// locally, with each upload handed to this script instead of Microsoft.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SITE_PORT = 4199, DEBUG_PORT = 9339;
const WA = 'https://wa.me/6282219472613';
const MARK = {
  sekolah: 'ZzSekolahRahasia', kota: 'ZzKotaRahasia', warna: 'ZzWarnaRahasia', simulasi: 'ZzNamaSimulasi',
  formSekolah: 'ZzFormSekolah', formKota: 'ZzFormKota', formPic: 'ZzFormPic',
};
const MARKED = /zz(sekolah|kota|warna|nama|form)/i;
// A 1×1 PNG; its pixel data must never be uploaded.
const LOGO = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const LOGO_DATA = 'DUlEQVR42mNk+M9QDwADhgGAWjR9aw';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const config = JSON.parse(fs.readFileSync('dist/index.html', 'utf8').match(/window\.AF_TRACKING=(\{.*?\});/)[1]);
if (!config.clarityId) throw new Error('SITE.clarityId is empty: there is nothing to check');

// The recorder and settings Clarity serves this project today, with uploads
// redirected to this script.
const tag = await (await fetch('https://www.clarity.ms/tag/' + config.clarityId)).text();
const recorderUrl = tag.match(/https:\/\/scripts\.clarity\.ms\/[^"]+\/clarity\.js/)[0];
const recorder = await (await fetch(recorderUrl)).text();
// The settings object closes the loader call; the loader may add statements
// after it (a console.warn when the project excludes this IP, for one).
const settings = tag.match(/"script",(\{.*?\})\)/)[1];
const loader = `(function () {
  var cfg = ${settings};
  cfg.upload = function (payload) { window.__afUpload(payload); };
  window.clarity.q = window.clarity.q || [];
  window.clarity.q.unshift(['start', cfg]);
  var s = document.createElement('script');
  s.src = ${JSON.stringify(recorderUrl)};
  document.head.appendChild(s);
})();`;

const logoFile = path.join(os.tmpdir(), 'af-privacy-logo.png');
fs.writeFileSync(logoFile, Buffer.from(LOGO, 'base64'));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'af-privacy-'));
const server = spawn(process.execPath, ['preview.mjs'], { env: { ...process.env, PORT: String(SITE_PORT) }, stdio: 'ignore' });
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--window-size=1280,900',
  '--disable-features=HttpsUpgrades,HttpsFirstBalancedModeAutoEnable',
  `--host-resolver-rules=MAP agatha-felix.com 127.0.0.1:${SITE_PORT}, MAP wa.me ~NOTFOUND, MAP *.whatsapp.com ~NOTFOUND, MAP *.clarity.ms ~NOTFOUND, ` +
    'MAP *.googletagmanager.com ~NOTFOUND, MAP *.google-analytics.com ~NOTFOUND, MAP *.googleadservices.com ~NOTFOUND, MAP *.doubleclick.net ~NOTFOUND',
  'about:blank',
], { stdio: 'ignore' });
process.on('exit', () => {
  chrome.kill();
  server.kill();
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
});
setTimeout(() => { console.error('privacy check timed out'); process.exit(2); }, 180000).unref();

async function poll(fn, ms, what) {
  for (const end = Date.now() + ms; Date.now() < end; await sleep(200)) {
    try { const v = await fn(); if (v) return v; } catch {}
  }
  throw new Error('timed out: ' + what);
}
await poll(async () => (await fetch(`http://127.0.0.1:${SITE_PORT}/`)).ok, 10000, 'preview server');
const targets = await poll(async () => (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json(), 15000, 'Chrome');
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));

let lastId = 0;
const pending = new Map(), handlers = {}, uploads = [];
ws.addEventListener('message', (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id) { const p = pending.get(msg.id); pending.delete(msg.id); if (p) msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result); }
  else if (handlers[msg.method]) handlers[msg.method](msg.params);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++lastId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
});
async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}

handlers['Runtime.bindingCalled'] = ({ name, payload }) => { if (name === '__afUpload') uploads.push(payload); };
handlers['Fetch.requestPaused'] = ({ requestId, request }) => {
  const body = request.url.startsWith('https://www.clarity.ms/tag/') ? loader : request.url === recorderUrl ? recorder : null;
  if (body === null) return send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
  send('Fetch.fulfillRequest', { requestId, responseCode: 200, body: Buffer.from(body).toString('base64'),
    responseHeaders: [{ name: 'Content-Type', value: 'text/javascript' }] });
};
// A plain target="_blank" link opens a tab (its WhatsApp host resolves nowhere);
// close it, or the page under test sits in the background.
handlers['Target.targetCreated'] = ({ targetInfo }) => {
  if (targetInfo.type === 'page' && targetInfo.targetId !== page.id) send('Target.closeTarget', { targetId: targetInfo.targetId }).catch(() => {});
};
await send('Target.setDiscoverTargets', { discover: true });
await send('Runtime.enable');
await send('Page.enable');
await send('DOM.enable');
await send('Runtime.addBinding', { name: '__afUpload' });
await send('Fetch.enable', { patterns: [{ urlPattern: '*clarity.ms*' }] });
// window.open is how a WhatsApp message kept out of the page is opened; record it.
await send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.__afOpened = []; window.open = function (u) { window.__afOpened.push(String(u)); return null; };' });

async function visit(url, ready) {
  // Through about:blank, so a change of hash alone still loads a fresh page.
  await send('Page.navigate', { url: 'about:blank' });
  await send('Page.navigate', { url });
  await poll(() => evaluate(`document.readyState === 'complete' && (${ready})`), 20000, url);
  await poll(() => evaluate('!!(window.clarity && window.clarity.v)'), 20000, 'Clarity recorder on ' + url);
}
async function type(selector, text) {
  await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.scrollIntoView({ block: 'center' }); el.focus(); return true; })()`);
  await send('Input.insertText', { text });
}
// A real, trusted click in the middle of the element, so Clarity records it as a
// visitor's click. The page scrolls smoothly, so scroll instantly and make sure
// nothing covers the element before clicking.
async function click(finder) {
  await send('Page.bringToFront');
  const at = await evaluate(`(async () => {
    const el = ${finder};
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 100));
    const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const top = document.elementFromPoint(x, y);
    if (!el.contains(top)) throw new Error('covered by ' + (top ? top.outerHTML.slice(0, 120) : 'nothing'));
    return { x, y };
  })()`);
  for (const t of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type: t, x: at.x, y: at.y, button: 'left', clickCount: 1 });
}
// Every attribute a recorder can read, apart from input values (Clarity masks
// those in every mode; the uploads are checked for them below).
const markedAttributes = () => evaluate(`(() => {
  const hits = [];
  for (const el of document.querySelectorAll('*')) for (const a of el.attributes) {
    if (a.name === 'value' && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) continue;
    if (${MARKED}.test(decodeURIComponent(a.value.replace(/%(?![0-9a-f]{2})/gi, '%25')))) hits.push(el.tagName.toLowerCase() + '[' + a.name + '] = ' + a.value.slice(0, 90));
  }
  return hits;
})()`);
const tracked = () => evaluate(`({ opened: window.__afOpened.slice(),
  conversions: (window.dataLayer || []).filter((e) => e[0] === 'event' && e[1] === 'conversion').length })`);
async function settle() {
  const count = uploads.length;
  await poll(async () => uploads.length > count, 10000, 'a Clarity upload').catch(() => {});
  await sleep(1500);
}

const failures = [];
const check = (ok, what) => { console.log((ok ? '  ok   ' : '  FAIL ') + what); if (!ok) failures.push(what); };
function checkOpened(state, markers) {
  if (process.env.DEBUG) console.log(state.opened.map((u) => decodeURIComponent(u)));
  check(state.opened.length === 1, `opens WhatsApp once (opened ${state.opened.length})`);
  const text = state.opened[0] ? decodeURIComponent(state.opened[0].split('?text=')[1] || '') : '';
  check(!!state.opened[0] && state.opened[0].startsWith(WA + '?text=') && markers.every((m) => text.includes(m)), 'the opened message carries everything typed');
  check(state.conversions === 1, `counts one Ads conversion (counted ${state.conversions})`);
}

console.log('/produk-custom/ product sheet (Map Jahit)');
await visit(`http://agatha-felix.com/produk-custom/#custom-map-jahit`, `!!document.querySelector('.af-sheet')`);
await type('.af-sheet input[placeholder="cth: SDIT Al-Furqon"]', MARK.sekolah);
await type('.af-sheet input[placeholder="cth: Bekasi"]', MARK.kota);
await type('.af-sheet input[placeholder="cth: navy, maroon, hijau botol"]', MARK.warna);
await sleep(300);
check((await markedAttributes()).length === 0, 'no link or attribute holds what was typed: ' + JSON.stringify(await markedAttributes()));
await click(`[...document.querySelectorAll('.af-sheet a')].find((a) => /Minta Penawaran/.test(a.textContent))`);
await settle();
checkOpened(await tracked(), [MARK.sekolah, MARK.kota, MARK.warna]);

console.log('/produk-custom/ rapor simulator');
await visit(`http://agatha-felix.com/produk-custom/#simulator`, `!!document.querySelector('#simulator')`);
await type('#simulator input[aria-label="Nama sekolah atau tempat les"]', MARK.simulasi);
const { root } = await send('DOM.getDocument', { depth: 0 });
const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '#simulator input[type=file]' });
await send('DOM.setFileInputFiles', { nodeId, files: [logoFile] });
await poll(() => evaluate(`!!document.querySelector('#simulator img[src^="data:image"]')`), 5000, 'the logo preview');
await sleep(300);
check((await markedAttributes()).length === 0, 'no link or attribute holds the school name: ' + JSON.stringify(await markedAttributes()));
await click(`[...document.querySelectorAll('#simulator a')].find((a) => a.href.startsWith(${JSON.stringify(WA)}))`);
await settle();
checkOpened(await tracked(), [MARK.simulasi]);

console.log('/raporsekolah/ form');
await visit('http://agatha-felix.com/raporsekolah/', `!!document.querySelector('form.lead')`);
await type('form.lead input[name=sekolah]', MARK.formSekolah);
await type('form.lead input[name=jumlah]', '120');
await type('form.lead input[name=kota]', MARK.formKota);
await type('form.lead input[name=pic]', MARK.formPic);
await settle();
check((await markedAttributes()).length === 0, 'no link or attribute holds the form answers');
await click(`document.querySelector('form.lead [type=submit]')`);
await poll(() => evaluate(`location.pathname === '/raporsekolah/terima-kasih.html' && document.readyState === 'complete'`), 15000, 'the thank-you page');
await sleep(2500);
check(await evaluate('typeof window.clarity === "undefined"'), 'Clarity stays off the thank-you page');

console.log('What Clarity would have uploaded');
const all = uploads.join('\n');
check(uploads.length > 0, `the recorder ran (${uploads.length} uploads)`);
check(all.includes('klik_whatsapp'), 'WhatsApp clicks reached Clarity as events');
check(all.includes(WA), 'clicked WhatsApp links were recorded, so the click path was checked');
const leaks = [...new Set((all.match(/zz(sekolah|kota|warna|nama|form)\w*/gi) || []))];
check(leaks.length === 0, 'nothing typed reached Clarity' + (leaks.length ? ': ' + leaks.join(', ') : ''));
check(!all.includes(LOGO_DATA), 'the uploaded logo did not reach Clarity');

ws.close();
console.log(failures.length ? `\n${failures.length} privacy check(s) failed` : '\nAll privacy checks passed');
process.exit(failures.length ? 1 : 0);
