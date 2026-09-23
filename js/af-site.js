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
  window.AFTracking = { trackWhatsApp: trackWhatsApp };

  // Local previews never send page views or test conversions to Google Ads.
  // A direct visit/reload of the thank-you page is not a fresh form submission.
  if (production && (!thankYou || window.AF_LEAD_PREPARED)) {
    window.gtag('js', new Date());
    window.gtag('config', config.googleAdsId, thankYou ? {
      page_location: location.origin + location.pathname,
    } : {});
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.googleAdsId);
    document.head.appendChild(script);
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
    if (url.protocol !== 'https:' || !/^(wa\.me|api\.whatsapp\.com)$/.test(url.hostname)) return;
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
