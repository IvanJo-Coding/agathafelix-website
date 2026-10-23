(function () {
  if (window.AFTracking) return;
  var config = window.AF_TRACKING;
  if (!config) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  var production = /^(www\.)?agatha-felix\.com$/.test(location.hostname);
  var thankYou = location.pathname === '/raporsekolah/terima-kasih.html';
  var later = [];
  var loadTag = function () {};

  function trackWhatsApp(callback, transactionId) {
    loadTag();
    var params = {
      send_to: config.waConversionLabel,
      event_callback: callback,
    };
    if (/^afw-[a-z0-9-]{12,60}$/i.test(transactionId || '')) params.transaction_id = transactionId;
    window.gtag('event', 'conversion', params);
  }
  // For a message the page keeps out of its HTML (waPribadi in Shell.jsx). The
  // page has already cancelled the click, so the listener below skips it: count
  // it here once and open the message in a new tab, as the link would have.
  function openWhatsApp(link, url) {
    var target;
    try { target = new URL(url); } catch (_) { return; }
    if (target.protocol !== 'https:' || target.hostname !== 'wa.me') return;
    noteContact(link, true);
    trackWhatsApp();
    window.open(target.href, '_blank', 'noopener');
  }
  // A testimonial clip played on the page instead of on Instagram. GA4's own
  // video_start name, so it lands in GA4's video reports.
  function noteVideo(title) {
    if (production && config.googleAnalyticsId) window.gtag('event', 'video_start', {
      send_to: config.googleAnalyticsId,
      video_title: title,
      video_provider: 'agatha-felix.com',
    });
    if (!useClarity) return;
    window.clarity('event', 'putar_video');
    window.clarity('set', 'video', title);
  }
  // Steps before contact. Only these names, and only enum values or a product
  // slug from the code: nothing a visitor typed can be passed through here.
  // The rapor form: quote_start (first field), quote_form_error (a failed
  // submit), quote_form_submit (valid, handed to WhatsApp; GA4 also counts it
  // as generate_lead on the thank-you page). None of these is an Ads goal.
  var STEPS = {
    product_detail_open: { product_id: 'slug', cta_position: ['kartu', 'tautan', 'navigasi'] },
    quote_start: { product_id: 'slug', quote_mode: ['detail', 'bantu', 'form'] },
    quote_form_error: { error_type: ['data_kurang', 'di_bawah_minimum'] },
    quote_form_submit: { model: ['jahit', 'press', 'belum'] },
    model_select: { model: ['jahit', 'press'] },
    simulator_start: { sim_source: ['konfigurator', 'langsung'] },
  };
  // Clarity tags for the values worth filtering recordings by.
  var TAGS = { product_id: 'produk', model: 'model_rapor', error_type: 'form_error', sim_source: 'simulator_dari' };
  function noteStep(name, params) {
    var spec = STEPS[name];
    if (!spec) return false;
    var clean = {};
    for (var key in spec) {
      var value = params && params[key];
      var ok = spec[key] === 'slug' ? /^[a-z0-9-]{2,40}$/.test(value || '') : spec[key].indexOf(value) >= 0;
      if (!ok) return false;
      clean[key] = value;
    }
    if (useClarity) {
      window.clarity('event', name);
      for (var tag in TAGS) if (clean[tag]) window.clarity('set', TAGS[tag], clean[tag]);
    }
    if (production && config.googleAnalyticsId) {
      clean.send_to = config.googleAnalyticsId;
      window.gtag('event', name, clean);
    }
    return true;
  }
  // A WhatsApp chat opened without a link click: the rapor form's handoff,
  // which Google Ads counts once on a prepared thank-you page. GA4 and
  // Clarity get it as klik_whatsapp from the form.
  function noteWhatsApp(label) {
    if (label === 'form') noteButton(label, true);
  }
  window.AFTracking = { trackWhatsApp: trackWhatsApp, openWhatsApp: openWhatsApp, noteVideo: noteVideo, noteStep: noteStep,
    noteWhatsApp: noteWhatsApp, setClarityConsent: setConsent };

  // Only a fresh handoff may send the form's primary WhatsApp conversion.
  // The existing thank-you URL action remains secondary, for observation. Direct
  // visits and reloads still load the tag, without a page view, so a WhatsApp
  // click there is delivered instead of waiting in dataLayer.
  var formConversion = thankYou && window.AF_LEAD_PREPARED && !window.AF_LEAD_MEASURED;

  // Local previews never send page views or test conversions to Google Ads.
  if (production) {
    var params = {};
    if (thankYou) params.page_location = location.origin + location.pathname;
    if (thankYou && !formConversion) params.send_page_view = false;
    window.gtag('js', new Date());
    window.gtag('config', config.googleAdsId, params);
    // Both destinations share one loader. Explicit routing below keeps GA4
    // contact events separate from the existing Ads conversion goals.
    if (config.googleAnalyticsId) {
      window.gtag('config', config.googleAnalyticsId, params);
      if (formConversion) window.gtag('event', 'generate_lead', {
        send_to: config.googleAnalyticsId,
        method: 'whatsapp_form',
      });
    }
    var tagState = 'idle', tagAttempts = 0, activeTag = null;
    loadTag = function () {
      if (tagState === 'loading' || tagState === 'loaded' || tagAttempts >= 3) return;
      tagState = 'loading';
      tagAttempts++;
      var script = document.createElement('script');
      activeTag = script;
      script.async = true;
      script.onload = function () {
        if (activeTag === script) tagState = 'loaded';
      };
      script.onerror = function () {
        if (activeTag !== script) return;
        tagState = 'failed';
        if (script.parentNode) script.parentNode.removeChild(script);
      };
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.googleAdsId);
      document.head.appendChild(script);
    };
    // The same handoff keeps its non-personal ID on reload, so a retry does
    // not create another primary conversion. A tag load alone is not event
    // processing: keep the handoff retryable until the conversion callback.
    if (formConversion && window.AF_LEAD_ID) trackWhatsApp(function () {
      window.AF_LEAD_MARK_MEASURED();
    }, window.AF_LEAD_ID);
    // The thank-you page loads the tag at once. Elsewhere it waits for load or
    // the first tap or key press: fetched early (about 346 KB for both
    // destinations) it held the hero text back some 6 s in mobile lab runs.
    // Anything sent before then stays in dataLayer, including after a failed
    // download. A later interaction may retry, at most three attempts per page.
    if (thankYou) loadTag();
    else {
      later.push(loadTag);
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (type) {
        window.addEventListener(type, loadTag, { once: true, passive: true, capture: true });
      });
    }
  }

  // Microsoft Clarity: click, scroll and attention heatmaps, time on page, and
  // recordings with form fields masked. It skips the thank-you page, whose
  // WhatsApp link carries the visitor's message, and waits for the load event
  // so it never competes with the first paint.
  //
  // Consent (Clarity Consent API v2): the project keeps Cookies OFF, which is
  // Microsoft's consent mode, so without a "granted" signal Clarity sets no
  // cookie and every page view is its own session. A visitor who taps Izinkan
  // in the bar below, or on /kebijakan-privasi/, grants analytics storage only:
  // Clarity's first-party cookies then join their pages into one session. Ads
  // storage stays denied. The choice lives in this browser's localStorage.
  var CONSENT_KEY = 'af-clarity-consent';
  var useClarity = production && !!config.clarityId && !thankYou;
  var bar = null;
  function readConsent() {
    try {
      var value = localStorage.getItem(CONSENT_KEY);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch (_) { return null; }
  }
  function sendConsent(granted) {
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: granted ? 'granted' : 'denied' });
  }
  // Also the bar's and the privacy page's buttons. Denying after a grant makes
  // Clarity delete its cookies and start a new cookieless session.
  function setConsent(granted) {
    try { localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied'); } catch (_) {}
    if (useClarity) sendConsent(granted);
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    bar = null;
    showChoice();
  }
  // The privacy page shows the current choice next to its buttons.
  function showChoice() {
    var value = readConsent();
    var text = value === 'granted' ? 'Diizinkan' : value === 'denied' ? 'Ditolak (tanpa cookie)' : 'Belum dipilih (tanpa cookie)';
    document.querySelectorAll('[data-af-consent-status]').forEach(function (el) { el.textContent = text; });
    document.querySelectorAll('button[data-af-consent]').forEach(function (el) {
      el.setAttribute('aria-pressed', String(el.getAttribute('data-af-consent') === value));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showChoice);
  else showChoice();
  // A small bar, never a pop-up: fixed at the bottom, clear of the WhatsApp
  // bubble and the landing page's sticky bar, shown from the first scroll on
  // each page until a choice is made. Text and buttons share one row, so on a
  // phone it stays about 70px tall (it was 156px at 360px and covered the
  // product cards). It steps aside while a form field has the keyboard.
  var BAR_CSS = '#af-consent{position:fixed;z-index:58;left:16px;bottom:16px;max-width:440px;display:flex;align-items:center;gap:10px;' +
    'padding:9px 10px 9px 14px;background:#fff;color:#2B2A28;border:2px solid #2B2A28;border-radius:14px;box-shadow:0 3px 0 #2B2A28;' +
    'font:500 13px/1.4 "Plus Jakarta Sans","Plus Jakarta Sans Fallback",system-ui,sans-serif}' +
    '#af-consent p{margin:0;flex:1 1 auto;min-width:0}#af-consent a{color:#13668F;font-weight:700}#af-consent div{display:flex;gap:6px;flex:none}' +
    '#af-consent button{min-height:36px;padding:6px 12px;border-radius:999px;border:2px solid #2B2A28;background:#fff;color:#2B2A28;cursor:pointer;' +
    'font:800 13.5px/1 "Baloo 2","Baloo 2 Fallback",sans-serif}#af-consent button[data-af-consent="granted"]{background:#2B2A28;color:#fff}' +
    'body:has(input:focus,select:focus,textarea:focus) #af-consent{display:none}' +
    '@media (max-width:680px){#af-consent{left:12px;right:12px;bottom:94px;max-width:none;font-size:12.5px}}' +
    '@media (max-width:700px){body:has(.stickybar) #af-consent{left:12px;right:12px;bottom:84px;max-width:none}}';
  function showBar() {
    if (bar || readConsent()) return;
    bar = document.createElement('div');
    bar.id = 'af-consent';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Izin cookie Microsoft Clarity');
    bar.innerHTML = '<style>' + BAR_CSS + '</style><p>Boleh pakai cookie Microsoft Clarity untuk analisis kunjungan? ' +
      '<a href="/kebijakan-privasi/#izin-clarity">Detail</a></p>' +
      '<div><button type="button" data-af-consent="granted">Izinkan</button><button type="button" data-af-consent="denied">Tidak</button></div>';
    document.body.appendChild(bar);
  }
  if (useClarity) {
    // typeof, not ||: an element with id="clarity" is also window.clarity.
    if (typeof window.clarity !== 'function') window.clarity = function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    sendConsent(readConsent() === 'granted');
    later.push(function () {
      var clarity = document.createElement('script');
      clarity.async = true;
      clarity.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(config.clarityId);
      document.head.appendChild(clarity);
    }, function () {
      // Not before the first scroll, so the first screen of an ad landing page stays clear.
      window.addEventListener('scroll', showBar, { once: true, passive: true });
    });
  }
  // Tags that wait for the page: started together after the load event, once
  // a frame has been painted (so never ahead of the hero text, even where the
  // first frame is late) and the browser is idle (at most 2 s later).
  if (later.length) {
    var startLater = function () {
      var start = function () { later.forEach(function (fn) { fn(); }); };
      var idle = function () {
        if (window.requestIdleCallback) window.requestIdleCallback(start, { timeout: 2000 });
        else setTimeout(start, 1);
      };
      if (window.requestAnimationFrame) window.requestAnimationFrame(function () { setTimeout(idle, 0); });
      else idle();
    };
    if (document.readyState === 'complete') startLater();
    else window.addEventListener('load', startLater);
  }

  // The landing page names its buttons in data-wa; elsewhere the visible text
  // does. Never the href, which can carry a prepared message.
  function buttonName(link) {
    var name = link.getAttribute('data-wa') || link.getAttribute('aria-label') || link.textContent || '';
    return name.replace(/\s+/g, ' ').trim().slice(0, 60) || 'tanpa label';
  }
  // Where a WhatsApp button sits, from its data-wa label: the rapor form, the
  // simulator, a product sheet, the floating bubble or the landing page's
  // sticky bar, the header, the footer's contact line, or anywhere else on the page.
  var SOURCES = { form: 'formulir', simulator: 'simulator', 'sheet-detail': 'konfigurator', 'sheet-bantu': 'konfigurator',
    'sheet-standar': 'konfigurator', bubble: 'mengambang', sticky: 'mengambang', header: 'header', menu: 'header',
    'kontak-footer': 'footer' };
  // Clarity ranks contact buttons across the whole site, beyond one page's heatmap.
  function noteContact(link, whatsapp) {
    noteButton(buttonName(link), whatsapp);
  }
  function noteButton(name, whatsapp) {
    var params = { send_to: config.googleAnalyticsId, button_label: name };
    if (whatsapp) params.cta_source = SOURCES[name] || 'halaman';
    if (production && config.googleAnalyticsId) window.gtag('event', whatsapp ? 'klik_whatsapp' : 'klik_telepon', params);
    if (!useClarity) return;
    window.clarity('event', whatsapp ? 'klik_whatsapp' : 'klik_telepon');
    window.clarity('set', whatsapp ? 'tombol_whatsapp' : 'tombol_telepon', name);
    if (whatsapp) window.clarity('set', 'sumber_whatsapp', params.cta_source);
  }

  document.addEventListener('click', function (event) {
    var target = event.target.closest ? event.target : event.target.parentElement;
    var choice = target && target.closest('[data-af-consent]');
    var consent = choice && choice.getAttribute('data-af-consent');
    if (consent === 'granted' || consent === 'denied') {
      setConsent(consent === 'granted');
      return;
    }
    var link = target && target.closest('a[href]');
    if (!link || event.defaultPrevented) return;
    var url;
    try { url = new URL(link.href); } catch (_) { return; }
    var whatsapp = url.protocol === 'https:' && /^(wa\.me|api\.whatsapp\.com)$/.test(url.hostname);
    // The prepared form already uses the thank-you URL conversion. Its retry
    // button continues that same lead; it must not add a second WhatsApp goal.
    // A phone call from that page is still counted.
    if (whatsapp && thankYou && window.AF_LEAD_URL) return;
    if (whatsapp || url.protocol === 'tel:') noteContact(link, whatsapp);
    if (!whatsapp) return;
    if (link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      trackWhatsApp();
      return;
    }
    event.preventDefault();
    var navigated = false;
    function go() {
      if (navigated) return;
      navigated = true;
      location.assign(link.href);
    }
    trackWhatsApp(go);
    setTimeout(go, production ? 1200 : 0);
  });
})();
