// Website v2 — shared shell: header, footer, floating WA, decorations.
const DS2 = window.AgathaFelixDesignSystem_3557c1;

// Single source of truth for the WhatsApp number + link builder.
const WA_NUMBER = '6282219472613';
function waLink(text) {
  return 'https://wa.me/' + WA_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
}

// --- Responsive layer (inline-styled components → overridden via !important) ---
// This layer is included in prerendered HTML and reused during hydration.
const V2_RESPONSIVE_ID = 'af-v2-responsive-shell';

(function injectV2Responsive() {
  if (typeof document === 'undefined' || document.getElementById(V2_RESPONSIVE_ID)) return;
  const css = `
  /* Tablet & below: collapse 2-col text/feature sections + 4-col grids */
  @media (max-width: 900px) {
    [style*="grid-template-columns: 1.1fr 1fr"],
    [style*="grid-template-columns: 1.2fr 1fr"],
    [style*="grid-template-columns: 1fr 1.1fr"],
    [style*="grid-template-columns: 1fr 1.3fr"],
    [style*="grid-template-columns: 1fr 1.4fr"],
    [style*="grid-template-columns: 1fr 1fr"] {
      grid-template-columns: 1fr !important;
      gap: 28px !important;
    }
    [style*="grid-template-columns: repeat(4, 1fr)"] {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    /* Center hero / simulator text when stacked */
    #hero > div > div:first-child,
    #simulator [style*="flex-direction: column"] { align-items: flex-start; }
    /* Rapor cover stack is decorative + fixed-positioned → scale to fit */
    #sekolah [style*="height: 320px"] { transform: scale(.82); transform-origin: top left; }
    /* Factory photos: even 3-up strip, no squashing */
    #pabrik [style*="grid-template-columns: repeat(3, 1fr)"] { gap: 12px !important; }
    #pabrik figure img { height: 150px !important; }
    /* Tablet header: logo + 3 nav pills + CTA outrun the viewport in the band
       above the 680px hamburger swap (iPad portrait sat 26px over). Tighten the
       pills through that band instead of losing the nav a breakpoint early. */
    header > div { gap: 10px !important; }
    header nav[aria-label="Navigasi"] { gap: 2px !important; }
    header nav[aria-label="Navigasi"] a { padding: 7px 10px !important; font-size: 0.86rem !important; }
    header .af-desktop-cta .af-btn { padding: 8px 13px !important; font-size: 0.84rem !important; }
    header img[alt="Agatha Felix"] { height: 40px !important; }
  }
  /* Phone: single column everywhere, tighter rhythm */
  @media (max-width: 680px) {
    [style*="grid-template-columns: repeat(4, 1fr)"],
    [style*="grid-template-columns: repeat(3, 1fr)"] {
      grid-template-columns: 1fr 1fr !important;
    }
    [style*="grid-template-columns: 1.4fr 1fr 1fr 1.2fr"] {
      grid-template-columns: 1fr 1fr !important;
      gap: 24px !important;
    }
    /* section vertical padding eased */
    main section > div { padding-top: 48px !important; padding-bottom: 48px !important; }
    /* Factory photos: full-width stacked, BIG & clear on phones */
    #pabrik [style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; gap: 18px !important; }
    #pabrik figure { transform: none !important; }
    #pabrik figure img { height: 300px !important; }
    /* swap desktop nav + CTA for the hamburger */
    header nav[aria-label="Navigasi"] { display: none !important; }
    header .af-desktop-cta { display: none !important; }
    header .af-burger { display: flex !important; }
    /* giant hero map shrinks so it never clips */
    #hero [role="img"] { transform: scale(.8); transform-origin: top center; height: 460px !important; }
  }
  /* Small phones: the simulator's rapor board is a fixed 300px. Plus the
     container padding that is wider than a 320px screen, and because it sets the
     grid column's min width, it dragged the whole simulator right and clipped
     its own "Pesan Desain Ini via WA" button. Shrink the board proportionally;
     its contents are centred and have room to spare at this size. */
  @media (max-width: 360px) {
    #simulator [style*="width: 300px"] {
      width: 252px !important; height: 345px !important; padding: 20px !important;
    }
    /* The CTA label is nowrap, so its min-content width (268px) set the grid
       column's floor and dragged the whole simulator past the right edge —
       clipping that very button. Let it wrap at this size. */
    #simulator .af-btn { white-space: normal !important; }
  }
  @media (max-width: 460px) {
    [style*="grid-template-columns: repeat(4, 1fr)"],
    [style*="grid-template-columns: repeat(3, 1fr)"],
    [style*="grid-template-columns: 1.4fr 1fr 1fr 1.2fr"] {
      grid-template-columns: 1fr !important;
    }
  }`;
  const tag = document.createElement('style');
  tag.id = V2_RESPONSIVE_ID;
  // React's server renderer omits the space after a style property colon;
  // browser style updates add it. Match both serializations at every breakpoint.
  tag.textContent = css.replace(/\[style\*="([^":]+): ([^"]+)"\]/g,
    (_, property, value) => `:is([style*="${property}: ${value}"], [style*="${property}:${value}"])`);
  document.head.appendChild(tag);
})();

const WaGlyph2 = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size, flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const V2_LINKS = [
  ['index.html', 'Beranda'],
  ['produk-standar.html', 'Produk Standar'],
  ['produk-custom.html', 'Custom & Rapor'],
];

function HeaderV2({ active }) {
  const { Button } = DS2;
  const [open, setOpen] = React.useState(false);
  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,248,238,.92)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', borderBottom: '2px solid var(--af-ink)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)', margin: '0 auto', height: 72,
          padding: '0 var(--container-pad)', display: 'flex', alignItems: 'center', gap: 18,
        }}
      >
        <a href="index.html" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img src="../../assets/logo-agatha-felix.png" alt="Agatha Felix" style={{ height: 48 }} />
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }} aria-label="Navigasi">
          {V2_LINKS.map(([href, label]) => {
            const isActive = href === active;
            return (
              <a
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700,
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'var(--af-ink)',
                  background: isActive ? 'var(--af-orange)' : 'transparent',
                  border: '2px solid ' + (isActive ? 'var(--af-ink)' : 'transparent'),
                  boxShadow: isActive ? 'var(--shadow-sticker)' : 'none',
                  padding: '7px 16px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
                }}
              >
                {label}
              </a>
            );
          })}
        </nav>
        <div className="af-desktop-cta" style={{ display: 'flex' }}>
          <Button color="wa" size="sm" href={waLink('Halo Agatha Felix! Saya mau tanya-tanya soal produk map.')} target="_blank" rel="noopener noreferrer"><WaGlyph2 size={15} /> Chat Kami</Button>
        </div>
        {/* Hamburger — shown only on mobile via responsive CSS */}
        <button
          className="af-burger"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'none', marginLeft: 'auto', width: 46, height: 46, flexShrink: 0,
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            background: open ? 'var(--af-orange)' : '#fff', color: open ? '#fff' : 'var(--af-ink)',
            border: '2px solid var(--af-ink)', borderRadius: 'var(--radius-sm)',
            boxShadow: '0 3px 0 var(--af-ink)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 24, height: 24 }}>
            {open ? <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open ? (
        <div
          className="af-mobile-menu"
          style={{
            borderTop: '2px solid var(--af-ink)', background: 'var(--af-paper)',
            padding: '16px var(--container-pad) 22px', display: 'flex', flexDirection: 'column', gap: 10,
          }}
        >
          {V2_LINKS.map(([href, label]) => {
            const isActive = href === active;
            return (
              <a
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textDecoration: 'none',
                  color: isActive ? '#fff' : 'var(--af-ink)',
                  background: isActive ? 'var(--af-orange)' : '#fff',
                  border: '2px solid var(--af-ink)', boxShadow: '0 3px 0 var(--af-ink)',
                  padding: '13px 18px', borderRadius: 'var(--radius-md)',
                }}
              >
                {label}
              </a>
            );
          })}
          <Button color="wa" size="lg" style={{ marginTop: 4 }} href={waLink('Halo Agatha Felix! Saya mau tanya-tanya soal produk map.')} target="_blank" rel="noopener noreferrer"><WaGlyph2 size={17} /> Chat Kami via WhatsApp</Button>
        </div>
      ) : null}
    </header>
  );
}

// Wavy section divider — flips with `flip`, colored by `fill`.
function Wave({ fill = 'var(--af-paper)', flip = false }) {
  return (
    <svg
      viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden="true"
      style={{ display: 'block', width: '100%', height: 44, transform: flip ? 'scaleY(-1)' : 'none' }}
    >
      <path d="M0,28 C120,52 240,4 360,22 C480,40 600,52 720,34 C840,16 960,8 1080,24 C1200,40 1320,48 1440,26 L1440,56 L0,56 Z" fill={fill}></path>
    </svg>
  );
}

function ConfettiV2({ density = 1, style }) {
  const dots = [
    ['var(--af-orange)', 12, '6%', '8%', 0], ['var(--af-green)', 9, '14%', '82%', 12],
    ['var(--af-yellow)', 14, '74%', '4%', -8], ['var(--af-purple)', 10, '60%', '92%', 20],
    ['var(--af-blue)', 11, '86%', '60%', 0], ['var(--af-orange)', 8, '40%', '95%', 0],
  ].slice(0, Math.round(6 * density));
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0, ...style }}>
      {dots.map(([c, s, top, left, rot], i) => (
        <span
          key={i}
          style={{
            position: 'absolute', top, left, width: s, height: s,
            borderRadius: i % 2 === 0 ? '50%' : 4, background: c, opacity: 0.6,
            transform: `rotate(${rot}deg)`,
          }}
        ></span>
      ))}
    </div>
  );
}

// Scrolling marquee strip of product names.
function MarqueeV2() {
  const items = ['MAP KANCING', 'CLEAR HOLDER', 'RAPOR CUSTOM', 'MAP L', 'BUSINESS FILE', 'MAP EXECUTIVE'];
  const colors = ['var(--af-orange)', 'var(--af-green)', 'var(--af-yellow)', 'var(--af-purple)', 'var(--af-blue)', '#fff'];
  const run = [...items, ...items, ...items];
  return (
    <div style={{ background: 'var(--af-ink)', overflow: 'hidden', padding: '13px 0', borderTop: '2px solid var(--af-ink)', borderBottom: '2px solid var(--af-ink)' }}>
      <style>{`@keyframes af-marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
      @media (prefers-reduced-motion: reduce) { .af-marquee-track { animation: none !important; } }`}</style>
      <div className="af-marquee-track" style={{ display: 'flex', gap: 38, width: 'max-content', animation: 'af-marquee 24s linear infinite' }}>
        {run.map((t, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 38, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.06em', color: colors[i % colors.length], whiteSpace: 'nowrap' }}>
            {t} <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[(i + 1) % colors.length] }}></span>
          </span>
        ))}
      </div>
    </div>
  );
}

function FloatingWAV2() {
  return (
    <a
      href={waLink('Halo Agatha Felix! Saya mau bertanya soal map / rapor custom.')} target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp"
      style={{
        position: 'fixed', right: 22, bottom: 22, zIndex: 60, width: 60, height: 60, borderRadius: '50%',
        background: 'var(--af-wa)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid var(--af-ink)', boxShadow: '0 4px 0 var(--af-ink)',
      }}
    >
      <WaGlyph2 size={28} />
    </a>
  );
}

function FooterV2() {
  const link = { display: 'block', color: 'rgba(255,255,255,.75)', fontSize: '0.84rem', textDecoration: 'none', lineHeight: 2.2 };
  const head = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: 12 };
  return (
    <footer style={{ background: 'var(--af-ink)', color: 'rgba(255,255,255,.75)' }}>
      <div
        style={{
          maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px var(--container-pad) 28px',
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: 32,
        }}
      >
        <div>
          <img src="../../assets/logo-mark-white.png" alt="Agatha Felix" style={{ height: 52, marginBottom: 14 }} />
          <p style={{ fontSize: '0.84rem', lineHeight: 1.8, margin: 0, maxWidth: 260 }}>
            Pabrik map plastik yang bikin dokumen penting jadi kelihatan keren. Langsung dari pabrik — bukan reseller.
          </p>
        </div>
        <div>
          <div style={head}>Produk</div>
          <a href="produk-standar.html" style={link}>Clear Holder</a>
          <a href="produk-standar.html" style={link}>Map L &amp; Map Kancing</a>
          <a href="produk-standar.html" style={link}>Map Executive</a>
          <a href="produk-custom.html" style={link}>Rapor &amp; Map Custom</a>
        </div>
        <div>
          <div style={head}>Jelajahi</div>
          <a href="index.html" style={link}>Beranda</a>
          <a href="produk-custom.html#simulator" style={link}>Simulator Rapor</a>
          <a href="/raporsekolah/" style={link}>Rapor Sekolah</a>
          <a href="index.html#cara-pesan" style={link}>Cara Pesan</a>
          <a href="index.html#faq" style={link}>FAQ</a>
        </div>
        <div>
          <div style={head}>Hubungi Kami</div>
          <p style={{ fontSize: '0.84rem', lineHeight: 2, margin: 0 }}>
            WhatsApp: +62 822-1947-2613<br />
            Senin–Sabtu, 08.00–17.00 WIB<br />
            Pabrik di Kota Bekasi, Jawa Barat<br />
            Pengiriman ke seluruh Indonesia
          </p>
        </div>
      </div>
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,.14)', maxWidth: 'var(--container-max)', margin: '0 auto',
          padding: '18px var(--container-pad)', fontSize: '0.76rem',
          display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}
      >
        <span>© 2026 Agatha Felix Stationery</span>
        <span>Langsung dari Pabrik — Bukan Reseller 🏭</span>
      </div>
    </footer>
  );
}

Object.assign(window, { HeaderV2, FooterV2, FloatingWAV2, WaGlyph2, Wave, ConfettiV2, MarqueeV2, waLink, WA_NUMBER });
