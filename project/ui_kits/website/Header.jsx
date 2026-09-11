// Agatha Felix website UI kit — header, footer, floating WhatsApp bubble.
// Loads after _ds_bundle.js; exports to window for Sections.jsx / index.html.
const DS = window.AgathaFelixDesignSystem_3557c1;

const WaGlyph = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size, flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const NAV_LINKS = [
  ['#hero', 'Home'],
  ['#produk', 'Produk Standar'],
  ['#sekolah', 'Produk Custom'],
  ['#cara-pesan', 'Cara Pesan'],
  ['#faq', 'FAQ'],
];

function SiteHeader({ active = '#hero' }) {
  const { Button } = DS;
  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50, height: 66,
        background: 'rgba(255,248,238,.92)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--af-line)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)', margin: '0 auto', height: '100%',
          padding: '0 var(--container-pad)', display: 'flex', alignItems: 'center', gap: 18,
        }}
      >
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img src="../../assets/logo-agatha-felix.png" alt="Agatha Felix" style={{ height: 44 }} />
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }} aria-label="Navigasi">
          {NAV_LINKS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: '0.84rem', fontWeight: 600, textDecoration: 'none',
                color: href === active ? 'var(--af-orange-deep)' : 'var(--text-body)',
                background: href === active ? 'var(--af-orange-tint)' : 'transparent',
                padding: '7px 13px', borderRadius: 'var(--radius-pill)',
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <Button color="wa" size="sm"><WaGlyph size={15} /> Chat WhatsApp</Button>
      </div>
    </header>
  );
}

function FloatingWA() {
  return (
    <a
      href="https://wa.me/6282219472613"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      style={{
        position: 'fixed', right: 22, bottom: 22, zIndex: 60,
        width: 58, height: 58, borderRadius: '50%',
        background: 'var(--af-wa)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 0 var(--af-wa-deep), var(--shadow-pop)',
      }}
    >
      <WaGlyph size={28} />
    </a>
  );
}

function SiteFooter() {
  const colHead = {
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem',
    color: '#fff', marginBottom: 14,
  };
  const link = { display: 'block', color: 'rgba(255,255,255,.72)', fontSize: '0.82rem', textDecoration: 'none', lineHeight: 2.1 };
  return (
    <footer style={{ background: 'var(--af-ink)', color: 'rgba(255,255,255,.72)', marginTop: 0 }}>
      <div
        style={{
          maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px var(--container-pad) 28px',
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: 32,
        }}
      >
        <div>
          <img src="../../assets/logo-mark-white.png" alt="Agatha Felix" style={{ height: 48, marginBottom: 14 }} />
          <p style={{ fontSize: '0.82rem', lineHeight: 1.8, margin: 0, maxWidth: 260 }}>
            Spesialist Product Custom Stationery. Produsen map plastik — langsung dari pabrik, bukan reseller.
          </p>
        </div>
        <div>
          <div style={colHead}>Produk</div>
          <a href="#produk" style={link}>Clear Holder</a>
          <a href="#produk" style={link}>Map L</a>
          <a href="#produk" style={link}>Map Executive</a>
          <a href="#sekolah" style={link}>Rapor &amp; Map Custom</a>
        </div>
        <div>
          <div style={colHead}>Perusahaan</div>
          <a href="#keunggulan" style={link}>Keunggulan</a>
          <a href="#cara-pesan" style={link}>Cara Pesan</a>
          <a href="#testimoni" style={link}>Testimoni</a>
          <a href="#faq" style={link}>FAQ</a>
        </div>
        <div>
          <div style={colHead}>Hubungi Kami</div>
          <p style={{ fontSize: '0.82rem', lineHeight: 2, margin: 0 }}>
            WhatsApp: +62 822-1947-2613<br />
            Senin–Sabtu, 08.00–17.00 WIB<br />
            Melayani seluruh Indonesia
          </p>
        </div>
      </div>
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,.14)',
          maxWidth: 'var(--container-max)', margin: '0 auto',
          padding: '18px var(--container-pad)', fontSize: '0.74rem',
          display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}
      >
        <span>© 2026 Agatha Felix Stationery. Semua hak dilindungi.</span>
        <span>Langsung dari Pabrik — Bukan Reseller</span>
      </div>
    </footer>
  );
}

Object.assign(window, { SiteHeader, SiteFooter, FloatingWA, WaGlyph });
