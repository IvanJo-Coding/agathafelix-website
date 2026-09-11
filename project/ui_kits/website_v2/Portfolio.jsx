// Website v2 — real custom-work portfolio + factory proof band.
const DS2pf = window.AgathaFelixDesignSystem_3557c1;

const PF = '../../assets/portfolio/';
const PORTFOLIO = [
  { img: PF + 'rapor-penabur-jahit-1.png', client: 'SMPK Penabur Bintaro Jaya', teknik: 'Rapor Jahit', seg: 'Sekolah', color: 'purple' },
  { img: PF + 'rapor-penabur-jahit-2.png', client: 'SMAK 6 Penabur Jakarta', teknik: 'Rapor Jahit · Foil Emas', seg: 'Sekolah', color: 'purple' },
  { img: PF + 'rapor-penabur-cordura.png', client: 'SMPK Penabur Kota Modern', teknik: 'Map Cordura', seg: 'Sekolah', color: 'green' },
  { img: PF + 'rapor-press-evergreen.png', client: 'SMP Evergreen Education', teknik: 'Map Press · Foil Emas', seg: 'Sekolah', color: 'orange' },
  { img: PF + 'rapor-press-bekasi.png', client: 'SMP Negeri 5 Kota Bekasi', teknik: 'Map Press', seg: 'Sekolah', color: 'orange' },
  { img: PF + 'zipperbag-robotics.png', client: 'Robotics Education Center', teknik: 'Zipper Bag + Tali', seg: 'Tempat Les', color: 'orange' },
  { img: PF + 'clearholder-symphonia.png', client: 'Symphonia · Summarecon Serpong', teknik: 'Clear Holder Custom', seg: 'Developer', color: 'blue' },
  { img: PF + 'clearholder-permata.png', client: 'PermataBank KPR', teknik: 'Clear Holder Custom', seg: 'Korporat', color: 'blue' },
];

function PortfolioCard({ p, rot }) {
  return (
    <figure
      style={{
        margin: 0, background: '#fff', border: '2px solid var(--af-ink)', borderRadius: 'var(--radius-lg)',
        boxShadow: '0 5px 0 var(--af-ink)', overflow: 'hidden', transform: `rotate(${rot}deg)`,
        transition: 'transform 220ms var(--ease-pop)', display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(0deg) translateY(-5px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${rot}deg)`; }}
    >
      <div style={{ background: '#f4ede1', borderBottom: '2px solid var(--af-ink)', position: 'relative' }}>
        <img src={p.img} alt={'Map custom ' + p.client} style={{ width: '100%', height: 230, objectFit: 'cover', display: 'block' }} />
        <span
          style={{
            position: 'absolute', top: 10, left: 10, background: `var(--af-${p.color})`, color: '#fff',
            border: '2px solid var(--af-ink)', borderRadius: 999, fontFamily: 'var(--font-display)',
            fontWeight: 800, fontSize: 10, padding: '3px 10px',
          }}
        >
          {p.seg}
        </span>
      </div>
      <figcaption style={{ padding: '13px 16px 15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-heading)', lineHeight: 1.25 }}>{p.client}</div>
        <div style={{ display: 'inline-flex', marginTop: 7, alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 600, color: `var(--af-${p.color}-deep)`, background: `var(--af-${p.color}-tint)`, border: `1.5px solid var(--af-${p.color}-soft)`, padding: '3px 11px', borderRadius: 999 }}>
          {p.teknik}
        </div>
      </figcaption>
    </figure>
  );
}

function PortfolioCustom() {
  const { Badge, SectionHeader } = DS2pf;
  const rots = [-1.5, 1, -0.8, 1.4, -1.2, 0.9, -1, 1.3];
  return (
    <section id="karya" style={{ background: 'var(--af-paper)', position: 'relative', overflow: 'hidden' }}>
      <window.ConfettiV2 />
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1, padding: '72px var(--container-pad)' }}>
        <SectionHeader
          eyebrow="Karya Kami"
          eyebrowColor="purple"
          title="Sudah Dipercaya Sekolah & Brand Besar"
          highlight="Dipercaya"
          highlightColor="purple"
          description="Dari rapor sekolah jahit & press sampai map korporat berlogo — ini sebagian yang sudah kami produksi."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {PORTFOLIO.map((p, i) => <PortfolioCard key={p.client} p={p} rot={rots[i % rots.length]} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
          {['Jahit', 'Press', 'Cordura', 'Clear Holder Custom', 'Zipper Bag'].map((t, i) => (
            <span key={t} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-body)', background: '#fff', border: '2px solid var(--af-ink)', borderRadius: 999, padding: '7px 16px', boxShadow: '0 3px 0 var(--af-ink)' }}>
              {['🪡', '🔥', '🧵', '🎨', '👜'][i]} {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Factory proof band --------------------------------------------------
const FACT = '../../assets/factory/';
const FACTORY = [
  { img: FACT + 'factory-floor.png', cap: 'Lantai produksi' },
  { img: FACT + 'factory-press.png', cap: 'Mesin press foil' },
  { img: FACT + 'factory-forklift.png', cap: 'Gudang & ekspedisi' },
];

function FactoryBand() {
  const { Badge, Button } = DS2pf;
  return (
    <section id="pabrik" style={{ background: 'var(--af-ink)', position: 'relative' }}>
      <window.Wave fill="var(--af-paper)" flip />
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1, padding: '72px var(--container-pad)', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 44, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          <Badge color="yellow" dot>🏭 Bukan Reseller</Badge>
          <h2 style={{ fontSize: 'var(--text-xl)', color: '#fff' }}>
            Semua Dibuat di <span style={{ color: 'var(--af-yellow)' }}>Pabrik Kami Sendiri</span>
          </h2>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,.82)', maxWidth: 420 }}>
            Press, jahit, sablon, sampai packing — semua satu atap. Itu kenapa harga kami harga pabrik,
            dan kualitasnya kami pegang dari awal sampai akhir.
          </p>
          <Button color="wa" size="lg"><window.WaGlyph2 /> Tanya Kapasitas Produksi</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {FACTORY.map((f, i) => (
            <figure key={f.cap} style={{ margin: 0, transform: `rotate(${(i - 1) * 1.5}deg)` }}>
              <div style={{ border: '2px solid rgba(255,255,255,.3)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 5px 0 rgba(0,0,0,.4)' }}>
                <img src={f.img} alt={f.cap} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
              </div>
              <figcaption style={{ color: 'rgba(255,255,255,.7)', fontSize: '0.74rem', fontWeight: 600, textAlign: 'center', marginTop: 8 }}>{f.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <window.Wave fill="var(--af-paper)" />
    </section>
  );
}

Object.assign(window, { PortfolioCustom, FactoryBand });
