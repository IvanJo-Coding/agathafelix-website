// Photo zoom for product and portfolio photos, on the React pages and the
// landing page alike. Any element with data-zoom (the large image's URL) opens
// that photo in a <dialog>; the large file is fetched only then. Inside a
// [data-zoom-group], the prev/next buttons, arrow keys and swipes walk the
// group's photos. The close button, Escape, or a tap beside the photo close
// it, and focus returns to the photo that opened it. Triggers carry
// role="button" and tabindex="0" in the markup, so Enter and Space open them.
(function () {
  if (window.AFZoom || typeof HTMLDialogElement === 'undefined') return;
  var dialog, img, caption, count, prev, next;
  var items = [], index = 0, opener = null, startX = null;

  var style = document.createElement('style');
  style.textContent =
    '[data-zoom]{cursor:zoom-in}' +
    '[data-zoom]:focus-visible{outline:3px solid #1D87BD;outline-offset:2px}' +
    '.afz{padding:0;border:0;margin:0;width:100vw;height:100vh;height:100dvh;max-width:none;max-height:none;background:#141210;overflow:hidden}' +
    '.afz::backdrop{background:rgba(20,18,16,.92)}' +
    '.afz-fig{margin:0;height:100%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:68px 16px 76px}' +
    '.afz-img{max-width:100%;max-height:100%;min-height:0;object-fit:contain;border-radius:12px;background:#fff;touch-action:pan-y pinch-zoom}' +
    '.afz-cap{color:#fff;font:600 14px/1.45 system-ui,sans-serif;text-align:center;max-width:640px}' +
    '.afz-btn{position:absolute;width:48px;height:48px;border-radius:999px;border:2px solid #2B2A28;background:#fff;color:#2B2A28;' +
      'font:700 28px/1 system-ui,sans-serif;cursor:pointer;display:grid;place-items:center;box-shadow:0 3px 0 rgba(0,0,0,.35)}' +
    '.afz-btn[hidden]{display:none}' +
    '.afz-btn:focus-visible{outline:3px solid #F5D920;outline-offset:2px}' +
    '.afz-close{top:12px;right:12px}' +
    '.afz-prev{left:12px;top:50%;transform:translateY(-50%)}' +
    '.afz-next{right:12px;top:50%;transform:translateY(-50%)}' +
    '.afz-count{position:absolute;top:26px;left:18px;color:#fff;font:700 14px system-ui,sans-serif}' +
    '@media (max-width:640px){.afz-prev,.afz-next{top:auto;bottom:16px;transform:none}' +
      '.afz-prev{left:calc(50% - 64px)}.afz-next{right:calc(50% - 64px)}}';
  document.head.appendChild(style);

  function altOf(el) {
    var pic = el.tagName === 'IMG' ? el : el.querySelector('img');
    return (pic && pic.getAttribute('alt')) || '';
  }

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'afz';
    dialog.setAttribute('aria-label', 'Foto diperbesar');
    dialog.innerHTML =
      '<figure class="afz-fig"><img class="afz-img" alt="" decoding="async"><figcaption class="afz-cap"></figcaption></figure>' +
      '<span class="afz-count" aria-live="polite"></span>' +
      '<button type="button" class="afz-btn afz-prev" aria-label="Foto sebelumnya">&#8249;</button>' +
      '<button type="button" class="afz-btn afz-next" aria-label="Foto berikutnya">&#8250;</button>' +
      '<button type="button" class="afz-btn afz-close" aria-label="Tutup foto">&times;</button>';
    document.body.appendChild(dialog);
    img = dialog.querySelector('.afz-img');
    caption = dialog.querySelector('.afz-cap');
    count = dialog.querySelector('.afz-count');
    prev = dialog.querySelector('.afz-prev');
    next = dialog.querySelector('.afz-next');
    dialog.querySelector('.afz-close').addEventListener('click', function () { dialog.close(); });
    prev.addEventListener('click', function () { show(index - 1); });
    next.addEventListener('click', function () { show(index + 1); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    // Keys stay in here: the product sheet underneath closes on Escape and
    // loops Tab through listeners on document.
    dialog.addEventListener('keydown', function (e) {
      e.stopPropagation();
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });
    dialog.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    dialog.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      startX = null;
      if (items.length > 1 && Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    });
    dialog.addEventListener('close', function () {
      img.removeAttribute('src');
      if (opener && opener.focus) opener.focus({ preventScroll: true });
      opener = null;
    });
  }

  function show(i) {
    index = (i + items.length) % items.length;
    var el = items[index];
    img.src = el.getAttribute('data-zoom');
    img.alt = altOf(el);
    caption.textContent = img.alt;
    var many = items.length > 1;
    prev.hidden = !many;
    next.hidden = !many;
    count.textContent = many ? (index + 1) + ' / ' + items.length : '';
  }

  function open(el) {
    if (!dialog) build();
    var group = el.closest('[data-zoom-group]');
    items = group ? Array.prototype.slice.call(group.querySelectorAll('[data-zoom]')) : [el];
    opener = el;
    show(Math.max(0, items.indexOf(el)));
    dialog.showModal();
    dialog.querySelector('.afz-close').focus();
  }

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-zoom]') : null;
    if (!el || e.defaultPrevented) return;
    e.preventDefault();
    open(el);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target;
    if (!el || !el.hasAttribute || !el.hasAttribute('data-zoom') || /^(A|BUTTON)$/.test(el.tagName)) return;
    e.preventDefault();
    open(el);
  });
  window.AFZoom = { open: open };
})();
