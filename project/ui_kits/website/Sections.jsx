// Agatha Felix website UI kit — homepage sections.
const DSx = window.AgathaFelixDesignSystem_3557c1;

const sectionWrap = (extra = {}) => ({
  maxWidth: 'var(--container-max)', margin: '0 auto',
  padding: 'var(--space-9) var(--container-pad)', ...extra,
});

// Confetti dots — the brand's only ornament.
function Confetti({ style }) {
  const dots = [
    ['var(--af-orange)', 10, '4%', '12%'], ['var(--af-green)', 7, '12%', '78%'],
    ['var(--af-yellow)', 12, '78%', '6%'], ['var(--af-purple)', 8, '66%', '90%'],
    ['var(--af-blue)', 9, '88%', '64%'],
  ];
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}>
      {dots.map(([c, s, top, left], i) => (
        <span key={i} style={{ position: 'absolute', top, left, width: s, height: s, borderRadius: '50%', background: c, opacity: 0.55 }}></span>
      ))}
    </div>
  );
}

function Hero() {
  const { Button, Badge, Stat } = DSx;
  return (
    <section id="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      <Confetti />
      <div style={sectionWrap({ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 48, alignItems: 'center', paddingTop: 72, paddingBottom: 72 })}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
          <Badge color="orange" dot>🏭 Produsen Langsung — Bukan Reseller</Badge>
          <h1 style={{ fontSize: 'var(--text-3xl)' }}>
            Spesialis <span style={{ color: 'var(--af-orange)' }}>Map Plastik ATK</span> untuk Kantor, Sekolah &amp; Lebih
          </h1>
          <p style={{ margin: 0, fontSize: 'var(--text-md)', maxWidth: 520 }}>
            Kami pabriknya langsung. <strong style={{ color: 'var(--text-heading)' }}>Clear Holder, Map L, Map Executive</strong>, hingga{' '}
            <strong style={{ color: 'var(--text-heading)' }}>rapor custom untuk sekolah &amp; tempat les</strong>. Tidak ada perantara — harga langsung dari sumbernya.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Button color="wa" size="lg"><window.WaGlyph /> Minta Penawaran Gratis</Button>
            <Button variant="ghost" size="lg" href="#produk">Lihat Produk ↓</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', maxWidth: 460, marginTop: 8 }}>
            <Stat value="20M+" label="Unit Diproduksi" color="orange" />
            <Stat value="500+" label="Institusi Dilayani" color="green" />
            <Stat value="4" label="Varian Utama" color="purple" />
          </div>
        </div>
        <div
          style={{
            background: '#fff', border: '2px solid var(--af-ink)', borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-sticker-lg)', padding: 18, transform: 'rotate(1.5deg)',
          }}
        >
          <img
            src="../../assets/hero-products.png"
            alt="Map Executive Agatha Felix"
            style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
          />
        </div>
      </div>
    </section>
  );
}

function PathChooser() {
  const { SectionHeader, Card, Chip } = DSx;
  const paths = [
    {
      accent: 'blue', title: 'Produk Standar', chip: 'Kantor · Arsip · Retail',
      desc: 'Clear Holder, Map L, Business File siap kirim. Beli per lusin atau grosir.',
      cta: 'Lihat Katalog Standar →',
    },
    {
      accent: 'orange', title: 'Produk Custom', chip: 'Sekolah · Les · Notaris · Korporat',
      desc: 'Rapor sekolah, map berlogo untuk kantor hukum & institusi. Desain dibantu gratis.',
      cta: 'Lihat Custom Order →',
    },
  ];
  return (
    <section id="path" style={{ background: 'var(--surface-band)' }}>
      <div style={sectionWrap()}>
        <SectionHeader eyebrow="Pilih Kebutuhan Anda" eyebrowColor="blue" title="Kami Melayani Dua Jenis Pelanggan" highlight="Dua" highlightColor="blue" description="Pilih kategori yang sesuai untuk melihat produk dan harga yang relevan." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {paths.map((p) => (
            <Card key={p.title} variant="sticker" accent={p.accent} hover padding="28px">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                <Chip color={p.accent}>{p.chip}</Chip>
                <h3 style={{ fontSize: 'var(--text-lg)' }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>{p.desc}</p>
                <span style={{ fontWeight: 700, fontSize: '0.86rem', color: `var(--af-${p.accent}-deep)` }}>{p.cta}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const FolderIcon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const ICONS = {
  clearHolder: ['M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z', 'M8 10h8', 'M8 14h5'],
  mapL: ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z'],
  mapExec: ['M2 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z', 'M7 13h10'],
  mapCustom: ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'],
};

function Products() {
  const { SectionHeader, ProductCard } = DSx;
  return (
    <section id="produk">
      <div style={sectionWrap()}>
        <SectionHeader eyebrow="Produk Kami" eyebrowColor="green" title="Empat Produk Utama" highlight="Empat" highlightColor="green" description="Semua diproduksi in-house dengan kontrol kualitas langsung dari lantai produksi." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          <ProductCard tag="Standar" title="Clear Holder" description="Map plastik berkantong untuk arsip dokumen — 20 hingga 100 pocket." icon={<FolderIcon d={ICONS.clearHolder} />} chip="Kantor · Arsip" price="Rp [TBD]" accent="blue" />
          <ProductCard tag="Standar" title="Map L" description="Map plastik bentuk L, transparan dan berwarna. Dokumen cepat masuk-keluar." icon={<FolderIcon d={ICONS.mapL} />} chip="Kantor · Sekolah" price="Rp [TBD]" accent="green" />
          <ProductCard tag="Premium" title="Map Executive" description="Document keeper premium dengan kancing — rapi untuk proposal & kontrak." image="../../assets/hero-products.png" chip="Notaris · Korporat" price="Rp [TBD]" accent="purple" />
          <ProductCard tag="Best Seller" title="Map Custom" description="Cetak logo, warna, dan ukuran bebas pilih. Untuk sekolah, les, hingga kantor hukum." icon={<FolderIcon d={ICONS.mapCustom} />} chip="Sekolah · Les · Korporat" price="Rp [TBD]" accent="orange" featured />
        </div>
      </div>
    </section>
  );
}

function SchoolSection() {
  const { Badge, Button, Stat, Card } = DSx;
  return (
    <section id="sekolah" style={{ background: 'var(--af-purple-tint)', position: 'relative', overflow: 'hidden' }}>
      <Confetti />
      <div style={sectionWrap({ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' })}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
          <Badge color="purple" dot>Khusus Institusi Pendidikan</Badge>
          <h2 style={{ fontSize: 'var(--text-xl)' }}>
            Rapor &amp; Map Custom untuk <span style={{ color: 'var(--af-purple)' }}>Sekolah dan Tempat Les</span>
          </h2>
          <p style={{ margin: 0, fontSize: '0.95rem', maxWidth: 480 }}>
            Sampul rapor dengan logo dan warna khas sekolah Anda. Desain dibantu gratis, melayani dari 1 kelas hingga seluruh sekolah.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', maxWidth: 460 }}>
            <Stat value="30+" label="MOQ Rapor (pcs)" color="purple" />
            <Stat value="500+" label="Sekolah & Bimbel" color="orange" />
            <Stat value="5–14" label="Hari Kerja" color="green" />
          </div>
          <Button color="purple" size="lg"><window.WaGlyph /> Konsultasi untuk Sekolah / Les</Button>
        </div>
        <Card variant="sticker" accent="purple" padding="26px" style={{ transform: 'rotate(-1.5deg)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Yang Anda dapatkan:</h3>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
            {['Desain sampul dibantu gratis', 'Logo & warna khas institusi Anda', 'Bahan tebal, jilid rapi, awet bertahun-tahun', 'Harga pabrik — tanpa margin reseller'].map((t) => (
              <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--af-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}

function Steps() {
  const { SectionHeader, Step } = DSx;
  return (
    <section id="cara-pesan">
      <div style={sectionWrap()}>
        <SectionHeader eyebrow="Mudah & Cepat" eyebrowColor="orange" title="Pesan dalam 3 Langkah" highlight="3 Langkah" highlightColor="orange" description="Chat kami, diskusikan kebutuhan, dan produk siap dikirim ke seluruh Indonesia." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <Step num={1} title="Chat & Konsultasi" color="orange">Hubungi via WhatsApp. Ceritakan produk apa, berapa jumlah, dan apakah butuh custom logo.</Step>
          <Step num={2} title="Approve Desain & DP" color="green">Kami kirim mockup desain. Setelah Anda setuju, produksi dimulai dengan DP.</Step>
          <Step num={3} title="Produksi & Kirim" color="blue">5–14 hari kerja, lalu produk dikirim ke alamat Anda di seluruh Indonesia.</Step>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { SectionHeader, TestimonialCard } = DSx;
  return (
    <section id="testimoni" style={{ background: 'var(--surface-band)' }}>
      <div style={sectionWrap()}>
        <SectionHeader eyebrow="Testimoni" eyebrowColor="yellow" title="Yang Mereka Katakan" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          <TestimonialCard quote="Map custom dengan logo sekolah kami hasilnya sangat rapi. Harganya jauh lebih murah karena langsung dari pabrik." name="Bu Rahma Susanti" role="Kepala Sekolah, SDN 04 Bekasi" avatarColor={0} />
          <TestimonialCard quote="Pesan map kancing custom untuk kantor notaris. Prosesnya cepat dan hasilnya profesional." name="Pak Hendra Wijaya" role="Notaris & PPAT, Jakarta" avatarColor={2} />
          <TestimonialCard quote="Rapor bimbel kami jadi kebanggaan murid. Desainnya dibantu sampai kami puas." name="Pak Andri Setiawan" role="Owner Bimbel Cerdas Ceria" avatarColor={3} />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const { Badge, Button, FAQItem } = DSx;
  return (
    <section id="faq">
      <div style={sectionWrap({ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'start' })}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
          <Badge color="blue">FAQ</Badge>
          <h2 style={{ fontSize: 'var(--text-xl)' }}>Pertanyaan yang Sering Ditanyakan</h2>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>Masih ada pertanyaan lain? Langsung chat kami via WhatsApp.</p>
          <Button variant="ghost">Tanya Langsung →</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FAQItem question="Berapa minimum order untuk produk custom?" defaultOpen>MOQ custom print mulai 100 pcs. Khusus rapor sekolah dan tempat les bisa mulai 30–40 pcs — cukup untuk satu kelas.</FAQItem>
          <FAQItem question="Berapa lama waktu produksinya?">5–14 hari kerja tergantung jumlah dan kerumitan desain, dihitung setelah desain disetujui.</FAQItem>
          <FAQItem question="Apakah desain dibantu?">Ya, gratis. Kirim logo dan preferensi warna Anda, tim kami buatkan mockup sampai Anda setuju.</FAQItem>
          <FAQItem question="Apakah bisa kirim ke luar kota?">Bisa — kami mengirim ke seluruh Indonesia via ekspedisi. Ongkir dihitung saat penawaran.</FAQItem>
        </div>
      </div>
    </section>
  );
}

function CTABand() {
  const { Badge, Button } = DSx;
  return (
    <section style={{ background: 'var(--af-orange)', position: 'relative', overflow: 'hidden' }}>
      <div style={sectionWrap({ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 72, paddingBottom: 72 })}>
        <img src="../../assets/logo-mark-white.png" alt="" style={{ height: 56 }} />
        <h2 style={{ fontSize: 'var(--text-xl)', color: '#fff', maxWidth: 560 }}>Dapatkan Penawaran Langsung dari Pabrik</h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,.9)', fontSize: '0.95rem', maxWidth: 460 }}>
          Ceritakan kebutuhan Anda dan kami buatkan penawaran terbaik — gratis, tanpa komitmen.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button color="wa" size="lg"><window.WaGlyph /> Chat WhatsApp Sekarang</Button>
          <Button variant="ghost" size="lg" style={{ borderColor: '#fff', color: '#fff' }}>Kirim Email</Button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, PathChooser, Products, SchoolSection, Steps, Testimonials, FAQ, CTABand, Confetti });
