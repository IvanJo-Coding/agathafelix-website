(function () {
  var key = 'af-rapor-lead';
  var url = new URL(location.href);
  var fallback = new URLSearchParams(url.hash.slice(1)).get('wa');
  var legacy = url.searchParams.get('wa');
  var pending;
  try { pending = JSON.parse(sessionStorage.getItem(key)); } catch (_) {}
  if (fallback) pending = { url: fallback, created: Date.now(), measured: false };
  if (pending && Date.now() - pending.created < 30 * 60 * 1000) {
    window.AF_LEAD_URL = pending.url;
    window.AF_LEAD_PREPARED = !pending.measured;
    pending.measured = true;
    try { sessionStorage.setItem(key, JSON.stringify(pending)); } catch (_) {}
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
  // Remove contact details before analytics loads or external links are opened.
  url.searchParams.delete('wa');
  if (fallback) url.hash = '';
  if (url.href !== location.href) history.replaceState(null, '', url.href);
})();
