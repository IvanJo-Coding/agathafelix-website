(function () {
  var key = 'af-rapor-lead';
  var url = new URL(location.href);
  var fallback = new URLSearchParams(url.hash.slice(1)).get('wa');
  var legacy = url.searchParams.get('wa');
  var pending;
  try { pending = JSON.parse(sessionStorage.getItem(key)); } catch (_) {}
  if (fallback) {
    pending = { url: fallback, created: Date.now(), measured: false };
    // Storage may work on this page even if the form could not use it.
    try { sessionStorage.setItem(key, JSON.stringify(pending)); } catch (_) {}
  }
  if (pending && Date.now() - pending.created < 30 * 60 * 1000) {
    // Two separate states: the message is prepared (the WhatsApp button keeps
    // it for 30 minutes), and the form conversion has been measured. The second
    // is recorded when the primary conversion callback runs. A failed load
    // stays retryable; a stable handoff ID deduplicates reloads in Google Ads.
    window.AF_LEAD_URL = pending.url;
    window.AF_LEAD_PREPARED = true;
    window.AF_LEAD_MEASURED = !!pending.measured;
    window.AF_LEAD_MARK_MEASURED = function () {
      pending.measured = window.AF_LEAD_MEASURED = true;
      try { sessionStorage.setItem(key, JSON.stringify(pending)); } catch (_) {}
    };
  } else if (legacy) {
    // Preserve old bookmarked links without counting them as new submissions.
    window.AF_LEAD_URL = legacy;
  }
  try {
    var destination = new URL(window.AF_LEAD_URL);
    if (destination.protocol !== 'https:' || destination.hostname !== 'wa.me' || destination.pathname !== '/6282219472613') {
      window.AF_LEAD_URL = null;
      window.AF_LEAD_PREPARED = false;
    }
  } catch (_) { window.AF_LEAD_URL = null; window.AF_LEAD_PREPARED = false; }
  if (window.AF_LEAD_PREPARED) {
    if (!/^afw-[a-z0-9-]{12,60}$/i.test(pending.id || '')) {
      var random = window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      pending.id = 'afw-' + random;
    }
    window.AF_LEAD_ID = pending.id;
    try { sessionStorage.setItem(key, JSON.stringify(pending)); } catch (_) {}
  }
  // Remove contact details before analytics loads or external links are opened.
  url.searchParams.delete('wa');
  if (fallback) url.hash = '';
  if (url.href !== location.href) history.replaceState(null, '', url.href);
})();
