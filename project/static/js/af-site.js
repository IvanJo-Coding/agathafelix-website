(function () {
  if (window.AFTracking) return;
  var config = window.AF_TRACKING;
  if (!config) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  var production = /^(www\.)?agatha-felix\.com$/.test(location.hostname);
  var thankYou = location.pathname === '/raporsekolah/terima-kasih.html';

  function trackWhatsApp(callback) {
    window.gtag('event', 'conversion', {
      send_to: config.waConversionLabel,
      event_callback: callback,
    });
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
  window.AFTracking = { trackWhatsApp: trackWhatsApp, openWhatsApp: openWhatsApp };

  // A thank-you page view is the form conversion (a URL rule in Google Ads), so
  // only a fresh handoff that has not been measured yet may send one. Direct
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
    var script = document.createElement('script');
    script.async = true;
    // Loading the tag sends the queued page view; until then a reload retries.
    if (formConversion) script.onload = function () { window.AF_LEAD_MARK_MEASURED(); };
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.googleAdsId);
    document.head.appendChild(script);
  }

  // Microsoft Clarity: click, scroll and attention heatmaps, time on page, and
  // recordings with form fields masked. The project keeps its cookies off and
  // this call says so too, so a visitor is never followed across pages or
  // visits. It skips the thank-you page, whose WhatsApp link carries the
  // visitor's message, and waits for the load event so it never competes with
  // the first paint.
  var useClarity = production && !!config.clarityId && !thankYou;
  if (useClarity) {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
    var startClarity = function () {
      var clarity = document.createElement('script');
      clarity.async = true;
      clarity.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(config.clarityId);
      document.head.appendChild(clarity);
    };
    if (document.readyState === 'complete') startClarity();
    else window.addEventListener('load', startClarity);
  }

  // The landing page names its buttons in data-wa; elsewhere the visible text
  // does. Never the href, which can carry a prepared message.
  function buttonName(link) {
    var name = link.getAttribute('data-wa') || link.getAttribute('aria-label') || link.textContent || '';
    return name.replace(/\s+/g, ' ').trim().slice(0, 60) || 'tanpa label';
  }
  // Clarity ranks contact buttons across the whole site, beyond one page's heatmap.
  function noteContact(link, whatsapp) {
    var name = buttonName(link);
    if (production && config.googleAnalyticsId) window.gtag('event', whatsapp ? 'klik_whatsapp' : 'klik_telepon', {
      send_to: config.googleAnalyticsId,
      button_label: name,
    });
    if (!useClarity) return;
    window.clarity('event', whatsapp ? 'klik_whatsapp' : 'klik_telepon');
    window.clarity('set', whatsapp ? 'tombol_whatsapp' : 'tombol_telepon', name);
  }

  document.addEventListener('click', function (event) {
    // The prepared form already uses the thank-you URL conversion. Its retry
    // button continues that same lead; it must not add a second WhatsApp goal.
    if (thankYou && window.AF_LEAD_URL) return;
    var target = event.target.closest ? event.target : event.target.parentElement;
    var link = target && target.closest('a[href]');
    if (!link || event.defaultPrevented) return;
    var url;
    try { url = new URL(link.href); } catch (_) { return; }
    var whatsapp = url.protocol === 'https:' && /^(wa\.me|api\.whatsapp\.com)$/.test(url.hostname);
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
