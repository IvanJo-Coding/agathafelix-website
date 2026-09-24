// Website v2 — shared product detail sheet: bottom sheet on phones, centred
// dialog on desktop, full screen on landscape phones. Used by the Produk
// Standar catalogue and the custom products on Custom & Rapor.
const SHEET_CSS_ID = 'af-sheet';
(function injectSheetCss() {
  if (typeof document === 'undefined' || document.getElementById(SHEET_CSS_ID)) return;
  const tag = document.createElement('style');
  tag.id = SHEET_CSS_ID;
  tag.textContent = `
  .af-sheet-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(43, 42, 40, .55);
    display: flex; align-items: center; justify-content: center; padding: 32px 24px;
    animation: af-fade 160ms ease-out; }
  .af-sheet { position: relative; width: min(980px, 100%); max-height: calc(100vh - 64px); max-height: calc(100dvh - 64px);
    display: flex; flex-direction: column; background: var(--af-paper); border: 2px solid var(--af-ink);
    border-radius: var(--radius-xl); box-shadow: 0 8px 0 var(--af-ink); overflow: hidden;
    animation: af-pop 220ms var(--ease-pop); }
  .af-sheet-top { display: flex; align-items: center; gap: 8px; padding: 10px 12px 10px 20px;
    border-bottom: 2px solid var(--af-ink); background: #fff; touch-action: none; }
  .af-sheet-grip { display: none; }
  .af-sheet-iconbtn { width: 44px; height: 44px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    background: #fff; color: var(--af-ink); border: 2px solid var(--af-ink); border-radius: 50%; cursor: pointer;
    box-shadow: 0 3px 0 var(--af-ink); font: inherit; }
  .af-sheet-iconbtn:active { transform: translateY(2px); box-shadow: 0 1px 0 var(--af-ink); }
  .af-sheet-iconbtn:disabled { opacity: .35; cursor: default; }
  .af-sheet-iconbtn svg { width: 20px; height: 20px; }
  .af-sheet-scroll { flex: 1; overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }
  .af-sheet-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 28px; padding: 24px; align-items: start; }
  .af-sheet-gallery { position: sticky; top: 0; display: flex; flex-direction: column; gap: 10px; }
  .af-sheet-track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
    border: 2px solid var(--af-ink); border-radius: var(--radius-lg); background: #f4ede1; }
  .af-sheet-track::-webkit-scrollbar { display: none; }
  .af-sheet-track img { flex: 0 0 100%; width: 100%; aspect-ratio: 1 / 1; max-height: 58vh; object-fit: contain; background: #fff; scroll-snap-align: center; }
  .af-sheet-thumbs { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 4px; margin: -4px; }
  .af-sheet-thumbs::-webkit-scrollbar { display: none; }
  .af-sheet-thumbs button { flex: 0 0 auto; width: 64px; height: 64px; padding: 0; overflow: hidden; cursor: pointer; background: #f4ede1;
    border: 2px solid var(--af-ink); border-radius: var(--radius-sm); opacity: .6; }
  .af-sheet-thumbs button[aria-current="true"] { opacity: 1; outline: 3px solid var(--af-green); outline-offset: 1px; }
  .af-sheet-thumbs img { width: 100%; height: 100%; object-fit: contain; background: #fff; }
  .af-sheet-body { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  .af-sheet-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-sheet-chip { display: inline-flex; align-items: center; gap: 6px; font-size: .78rem; font-weight: 700;
    border-radius: 999px; padding: 6px 12px; border: 1.5px solid; }
  .af-sheet-h { font-family: var(--font-display); font-weight: 800; font-size: .95rem; margin: 0 0 8px; color: var(--af-ink); }
  .af-sheet-variants { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-sheet-variants button { min-height: 40px; padding: 7px 16px; cursor: pointer; font-family: var(--font-display);
    font-weight: 800; font-size: .88rem; color: var(--af-ink); background: #fff; border: 2px solid var(--af-ink); border-radius: 999px; }
  .af-sheet-variants button[aria-pressed="true"] { background: var(--af-ink); color: #fff; box-shadow: 0 3px 0 var(--af-orange); }
  .af-sheet-swatches { display: flex; flex-wrap: wrap; gap: 8px; }
  .af-sheet-swatch { width: 38px; height: 38px; padding: 0; cursor: pointer; border-radius: 50%; border: 2px solid var(--af-ink);
    display: flex; align-items: center; justify-content: center;
    background: repeating-conic-gradient(#dfe4e8 0 25%, #fff 0 50%) 50% / 10px 10px; }
  .af-sheet-swatch[aria-pressed="true"] { outline: 3px solid var(--af-blue); outline-offset: 2px; }
  .af-sheet-swatch svg { width: 16px; height: 16px; }
  .af-sheet-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .af-sheet-spec { background: #fff; border: 2px solid var(--af-ink); border-radius: var(--radius-md); padding: 10px 12px; }
  .af-sheet-foot { display: flex; gap: 10px; align-items: center; padding: 12px 20px; background: #fff;
    border-top: 2px solid var(--af-ink); }
  .af-sheet-foot .af-btn { flex: 1; min-width: 0; }
  @media (max-width: 350px) { .af-sheet-xs-hide { display: none; } }

  @media (max-width: 760px) {
    .af-sheet-backdrop { align-items: flex-end; padding: 0; }
    .af-sheet { width: 100%; max-height: 92vh; max-height: 92dvh; border-radius: 24px 24px 0 0;
      border-bottom: none; box-shadow: none; animation: af-rise 260ms cubic-bezier(.2, .9, .3, 1); }
    .af-sheet-top { position: relative; padding: 18px 12px 10px 16px; }
    .af-sheet-grip { display: block; position: absolute; top: 6px; left: 50%; width: 44px; height: 5px;
      margin-left: -22px; border-radius: 99px; background: var(--af-line, #EADFD2); }
    .af-sheet-grid { gap: 20px; padding: 18px; }
    .af-sheet-thumbs button { width: 52px; height: 52px; }
    .af-sheet-foot { padding: 10px 16px calc(10px + env(safe-area-inset-bottom)); }
    .af-sheet-foot .af-btn { padding: 14px 18px !important; font-size: .95rem !important; }
  }
  /* Portrait phones: photo on top, details below. From 560px up the sheet
     keeps photo and details side by side, so the photo never fills it. */
  @media (max-width: 559px) {
    .af-sheet-grid { grid-template-columns: 1fr; gap: 18px; padding: 16px; }
    .af-sheet-gallery { position: static; }
  }
  /* Landscape phones and short windows: use the whole screen, compact bars,
     photo beside the details and sized to the height that is left. */
  @media (max-height: 520px) {
    .af-sheet-backdrop { padding: 0; align-items: stretch; }
    .af-sheet { width: 100%; height: 100%; max-height: 100%; border: none; border-radius: 0; box-shadow: none;
      animation: af-fade 160ms ease-out; }
    .af-sheet-top { padding: 6px max(12px, env(safe-area-inset-right)) 6px max(16px, env(safe-area-inset-left)); }
    .af-sheet-grip { display: none; }
    .af-sheet-iconbtn { width: 38px; height: 38px; box-shadow: 0 2px 0 var(--af-ink); }
    .af-sheet-grid { grid-template-columns: minmax(0, .85fr) 1fr; gap: 18px;
      padding: 12px max(16px, env(safe-area-inset-right)) 16px max(16px, env(safe-area-inset-left)); }
    .af-sheet-gallery { position: sticky; top: 0; }
    .af-sheet-track img { aspect-ratio: auto; height: calc(100vh - 160px); height: calc(100dvh - 160px); min-height: 150px; max-height: none; }
    .af-sheet-thumbs { display: none; }
    .af-sheet-foot { padding: 6px max(16px, env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); }
    .af-sheet-foot .af-btn { padding: 10px 18px !important; font-size: .92rem !important; }
  }
  @keyframes af-fade { from { opacity: 0; } }
  @keyframes af-pop { from { opacity: 0; transform: scale(.96); } }
  @keyframes af-rise { from { transform: translateY(100%); } }
  @media (prefers-reduced-motion: reduce) {
    .af-sheet, .af-sheet-backdrop { animation: none !important; transition: none !important; }
  }`;
  document.head.appendChild(tag);
})();

const AfIcon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((path) => <path key={path} d={path} />)}
  </svg>
);

// Dark tick on light swatches, white tick on dark ones.
function afIsLight(hex) {
  if (!hex) return true;
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 160;
}

// The frame: backdrop, dialog, top bar (position, prev/next, close), a
// scrolling body and a fixed footer. Handles focus, Escape, a Tab loop, page
// scroll lock, and drag-down-to-close on touch. `resetKey` scrolls the body
// back to the top when the shown product changes.
function AfSheet({ pos, total, onClose, onStep, resetKey, footer, labelledBy = 'af-sheet-title', children }) {
  const sheetRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const drag = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [resetKey]);

  React.useEffect(() => {
    const previous = document.activeElement;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const close = sheetRef.current.querySelector('[data-close]');
    if (close) close.focus({ preventScroll: true });
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = [...sheetRef.current.querySelectorAll('a[href], button:not([disabled]), input, select, summary, [tabindex="0"]')];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      root.style.overflow = overflow;
      if (previous && previous.focus) previous.focus({ preventScroll: true });
    };
  }, []);

  function dragStart(e) {
    if (e.pointerType !== 'touch' || e.target.closest('button')) return;
    drag.current = { y: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    sheetRef.current.style.transition = 'none';
  }
  function dragMove(e) {
    if (!drag.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y);
    sheetRef.current.style.transform = `translateY(${drag.current.dy}px)`;
  }
  function dragEnd() {
    if (!drag.current) return;
    const { dy } = drag.current;
    drag.current = null;
    const sheet = sheetRef.current;
    sheet.style.transition = 'transform 200ms ease';
    if (dy > 110) { onClose(); return; }
    sheet.style.transform = '';
  }

  return (
    <div className="af-sheet-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={sheetRef} className="af-sheet" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <div className="af-sheet-top" onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnd} onPointerCancel={dragEnd}>
          <span className="af-sheet-grip" aria-hidden="true"></span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '.85rem', color: 'var(--text-muted)', marginRight: 'auto' }}>
            Produk {pos + 1} dari {total}
          </span>
          <button type="button" className="af-sheet-iconbtn" aria-label="Produk sebelumnya" disabled={total < 2} onClick={() => onStep(-1)}>
            <AfIcon d={['M15 18l-6-6 6-6']} />
          </button>
          <button type="button" className="af-sheet-iconbtn" aria-label="Produk berikutnya" disabled={total < 2} onClick={() => onStep(1)}>
            <AfIcon d={['M9 18l6-6-6-6']} />
          </button>
          <button type="button" className="af-sheet-iconbtn" data-close aria-label="Tutup detail" onClick={onClose} style={{ marginLeft: 6 }}>
            <AfIcon d={['M6 6l12 12', 'M18 6L6 18']} />
          </button>
        </div>
        <div className="af-sheet-scroll" ref={scrollRef}>{children}</div>
        <div className="af-sheet-foot">{footer}</div>
      </div>
    </div>
  );
}

// Swipeable photo strip with counter and thumbnails. Controlled: the parent
// owns `slide` (so a colour choice can jump to its photo); swipes report back
// through onSlide.
function AfGallery({ imgs, slide, onSlide, fit = 'contain' }) {
  const trackRef = React.useRef(null);
  React.useEffect(() => {
    const t = trackRef.current;
    if (!t || !t.clientWidth || Math.round(t.scrollLeft / t.clientWidth) === slide) return;
    t.scrollTo({ left: slide * t.clientWidth, behavior: 'smooth' });
  }, [slide, imgs.length && imgs[0][0]]);
  return (
    <div className="af-sheet-gallery">
      <div style={{ position: 'relative' }}>
        <div
          className="af-sheet-track" ref={trackRef}
          onScroll={(e) => {
            const t = e.currentTarget;
            const i = Math.round(t.scrollLeft / t.clientWidth);
            if (i !== slide) onSlide(i);
          }}
        >
          {imgs.map(([src, alt], i) => <img key={src} src={src} alt={alt} decoding="async" loading={i ? 'lazy' : 'eager'} style={fit === 'cover' ? { objectFit: 'cover' } : undefined} />)}
        </div>
        {imgs.length > 1 ? (
          <span aria-hidden="true" style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(43,42,40,.75)', color: '#fff', borderRadius: 999, fontSize: 12, fontWeight: 700, padding: '3px 10px' }}>{slide + 1}/{imgs.length}</span>
        ) : null}
      </div>
      {imgs.length > 1 ? (
        <div className="af-sheet-thumbs">
          {imgs.map(([src, alt], i) => (
            <button key={src} type="button" aria-label={'Foto ' + (i + 1) + ': ' + alt} aria-current={i === slide} onClick={() => onSlide(i)}>
              <img src={src} alt="" loading="lazy" decoding="async" style={fit === 'cover' ? { objectFit: 'cover' } : undefined} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Native share sheet on phones, copy-link fallback on desktop. Deliberately
// not a WhatsApp link, so sharing is never counted as an Ads conversion.
function AfShareButton({ url, title }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => setCopied(false), [url]);
  async function share() {
    try {
      if (navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (_) { /* dismissed share sheet or blocked clipboard */ }
  }
  return (
    <button type="button" className="af-sheet-iconbtn" aria-label={copied ? 'Link disalin' : 'Bagikan produk ini'} title={copied ? 'Link disalin' : 'Bagikan'} onClick={share}>
      {copied ? <AfIcon d={['M20 6L9 17l-5-5']} /> : <AfIcon d={['M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7', 'M16 6l-4-4-4 4', 'M12 2v13']} />}
    </button>
  );
}

Object.assign(window, { AfSheet, AfGallery, AfShareButton, AfIcon, afIsLight });
