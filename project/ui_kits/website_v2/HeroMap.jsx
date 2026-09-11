// Website v2 — giant interactive Map Kancing hero.
// Colorful documents slide INTO the folder; replays on hover / click.
const DS2h = window.AgathaFelixDesignSystem_3557c1;

const HERO_DOCS = [
  { label: 'Rapor SD Ceria', bar: 'var(--af-purple)', rot: -10, x: -130, y: -210 },
  { label: 'Sertifikat Les Piano', bar: 'var(--af-green)', rot: 6, x: 30, y: -250 },
  { label: 'Akta Notaris', bar: 'var(--af-blue)', rot: 14, x: 160, y: -190 },
];

function DocSheet({ doc, stage, index }) {
  // stage: 'out' → floating above; 'in' → tucked inside the folder
  const isIn = stage === 'in';
  return (
    <div
      style={{
        position: 'absolute', left: '50%', top: '52%', width: 150, height: 190,
        marginLeft: -75,
        background: '#fff', border: '2px solid var(--af-ink)', borderRadius: 12,
        boxShadow: 'var(--shadow-sticker)', padding: 12, boxSizing: 'border-box',
        transform: isIn
          ? `translate(${doc.x * 0.18}px, 26px) rotate(${doc.rot * 0.25}deg) scale(.92)`
          : `translate(${doc.x}px, ${doc.y}px) rotate(${doc.rot}deg)`,
        transition: `transform 900ms ${260 * index}ms var(--ease-pop)`,
        zIndex: 2,
      }}
    >
      <div style={{ height: 14, borderRadius: 6, background: doc.bar, marginBottom: 10 }}></div>
      <div style={{ height: 7, borderRadius: 4, background: 'var(--af-line)', marginBottom: 6, width: '85%' }}></div>
      <div style={{ height: 7, borderRadius: 4, background: 'var(--af-line)', marginBottom: 6 }}></div>
      <div style={{ height: 7, borderRadius: 4, background: 'var(--af-line)', marginBottom: 12, width: '60%' }}></div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, color: 'var(--af-ink)', lineHeight: 1.25 }}>{doc.label}</div>
    </div>
  );
}

function GiantMap() {
  const [stage, setStage] = React.useState('out');
  const timer = React.useRef(null);

  const play = React.useCallback(() => {
    setStage('out');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStage('in'), 700);
  }, []);

  React.useEffect(() => {
    timer.current = setTimeout(() => setStage('in'), 1100);
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <div
      onMouseEnter={play}
      onClick={play}
      role="img"
      aria-label="Dokumen warna-warni masuk ke dalam map kancing raksasa Agatha Felix"
      style={{ position: 'relative', height: 560, cursor: 'pointer', userSelect: 'none' }}
    >
      {/* floating docs */}
      {HERO_DOCS.map((d, i) => <DocSheet key={d.label} doc={d} stage={stage} index={i} />)}

      {/* folder back panel */}
      <div
        style={{
          position: 'absolute', left: '50%', top: '46%', width: 340, height: 250, marginLeft: -170,
          background: 'var(--af-orange-deep)', border: '2px solid var(--af-ink)',
          borderRadius: '18px 18px 0 0', zIndex: 1,
        }}
      ></div>

      {/* folder front panel — covers lower part of docs */}
      <div
        style={{
          position: 'absolute', left: '50%', top: '54%', width: 360, height: 230, marginLeft: -180,
          background: 'var(--af-orange)', border: '2px solid var(--af-ink)',
          borderRadius: '14px 14px 22px 22px', zIndex: 3,
          boxShadow: '0 8px 0 rgba(43,42,40,.18)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
          transform: 'rotate(-1.2deg)',
        }}
      >
        {/* flap + snap button */}
        <div
          style={{
            position: 'absolute', top: -34, left: '50%', marginLeft: -80, width: 160, height: 56,
            background: 'var(--af-orange)', border: '2px solid var(--af-ink)',
            borderRadius: '16px 16px 0 0', borderBottom: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: 26, height: 26, borderRadius: '50%', background: 'var(--af-yellow)',
              border: '2px solid var(--af-ink)', boxShadow: 'inset 0 -3px 0 rgba(43,42,40,.25)',
              transform: stage === 'in' ? 'scale(1)' : 'scale(.78)',
              transition: 'transform 300ms var(--ease-pop) 1600ms',
            }}
          ></span>
        </div>
        <img src="../../assets/logo-mark-white.png" alt="" style={{ height: 64 }} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: 18, letterSpacing: '0.04em' }}>MAP KANCING · A4</span>
        <span
          style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--af-orange)',
            background: '#fff', border: '2px solid var(--af-ink)', borderRadius: 999, padding: '4px 12px',
            opacity: stage === 'in' ? 1 : 0, transform: stage === 'in' ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 350ms var(--ease-pop) 1800ms',
          }}
        >
          Aman tersimpan! ✓
        </span>
      </div>

      {/* replay hint */}
      <span
        style={{
          position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
          fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap',
        }}
      >
        ✨ sentuh map-nya untuk ulang
      </span>
    </div>
  );
}

function HeroV2() {
  const { Button, Badge } = DS2h;
  return (
    <section id="hero" style={{ position: 'relative', overflow: 'hidden', background: 'var(--af-blue-tint)' }}>
      <window.ConfettiV2 />
      <div
        style={{
          maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1,
          padding: '64px var(--container-pad) 24px',
          display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32, alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22 }}>
          <Badge color="orange" dot>Halo! Kami Pabrik Map 🏭</Badge>
          <h1 style={{ fontSize: 'var(--text-3xl)' }}>
            Dokumen <span style={{ color: 'var(--af-purple)' }}>Penting</span>, Masuk Map Plastik yang <span style={{ color: 'var(--af-orange)' }}>Keren!</span>
          </h1>
          <p style={{ margin: 0, fontSize: 'var(--text-md)', maxWidth: 500 }}>
            Dari rapor TK sampai akta notaris — Agatha Felix membuat map plastik &amp; rapor custom langsung dari pabrik.
            <strong style={{ color: 'var(--text-heading)' }}> Warna-warni boleh, harga tetap ramah.</strong>
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Button color="wa" size="lg" href={window.waLink('Halo Agatha Felix! Saya mau minta penawaran map / rapor custom.')} target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Minta Penawaran Gratis</Button>
            <Button color="purple" size="lg" href="produk-custom.html#simulator">🎨 Coba Simulator Rapor</Button>
          </div>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginTop: 4 }}>
            {[['20 juta+', 'map sudah kami buat'], ['500+', 'sekolah & kantor'], ['30 pcs', 'minimal pesan rapor']].map(([v, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.45rem', color: 'var(--text-heading)' }}>{v}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <GiantMap />
      </div>
      <window.Wave fill="var(--af-paper)" />
    </section>
  );
}

Object.assign(window, { HeroV2, GiantMap });
