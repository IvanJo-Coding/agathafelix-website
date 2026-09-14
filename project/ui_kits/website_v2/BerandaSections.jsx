// Website v2 — Beranda sections (below hero).
const DS2b = window.AgathaFelixDesignSystem_3557c1;

const wrapV2 = (extra = {}) => ({
  maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1,
  padding: '72px var(--container-pad)', ...extra,
});

// --- Produk teaser: 4 chunky tilted cards -------------------------------
const TEASERS = [
  { title: 'Clear Holder', desc: 'Buku display isi 20–80 kantong bening. Dokumen langsung rapi.', color: 'blue', emoji: null, rot: -2, img: '../../assets/products/clear-holder.png' },
  { title: 'Business File', desc: 'Map kancing PP tebal, banyak warna. Klik, simpan, bawa.', color: 'orange', rot: 1.5, img: '../../assets/products/business-file.png' },
  { title: 'Map Executive', desc: 'Document keeper premium, gagah buat proposal & kontrak.', color: 'purple', rot: -1, img: '../../assets/products/map-executive.png' },
  { title: 'Rapor & Map Custom', desc: 'Logo sekolahmu, warna pilihanmu. Paling laris!', color: 'orange', rot: 2, img: null, featured: true },
];

const TEASER_ICONS = {
  'Clear Holder': ['M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z', 'M8 10h8', 'M8 14h5'],
  'Map L & Kancing': ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z'],
  'Rapor & Map Custom': ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'],
};

function TeaserCard({ t }) {
  const deep = `var(--af-${t.color}-deep)`;
  return (
    <a
      href={t.featured ? 'produk-custom.html' : 'produk-standar.html'}
      style={{
        display: 'flex', flexDirection: 'column', gap: 0, textDecoration: 'none',
        background: '#fff', border: '2px solid var(--af-ink)', borderRadius: 'var(--radius-lg)',
        boxShadow: '0 5px 0 var(--af-ink)', overflow: 'hidden',
        transform: `rotate(${t.rot}deg)`,
        transition: 'transform 220ms var(--ease-pop), box-shadow 220ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(0deg) translateY(-5px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${t.rot}deg)`; }}
    >
      <div
        style={{
          height: 150, background: t.img ? '#f4ede1' : `var(--af-${t.color})`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#fff',
          borderBottom: '2px solid var(--af-ink)', position: 'relative',
        }}
      >
        {t.img ? (
          <img src={t.img} alt={t.title} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 52, height: 52 }}>
            {(TEASER_ICONS[t.title] || []).map((d, i) => <path key={i} d={d} />)}
          </svg>
        )}
        {t.featured ? (
          <span style={{ position: 'absolute', top: 10, right: 10, background: 'var(--af-yellow)', border: '2px solid var(--af-ink)', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, padding: '3px 10px', color: 'var(--af-ink)' }}>PALING LARIS ⭐</span>
        ) : null}
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: 6 }}>{t.title}</h3>
        <p style={{ margin: '0 0 10px', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-body)' }}>{t.desc}</p>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem', color: deep }}>Intip yuk →</span>
      </div>
    </a>
  );
}

function ProdukTeaserV2() {
  const { SectionHeader } = DS2b;
  return (
    <section id="produk" style={{ background: 'var(--af-paper)' }}>
      <div style={wrapV2()}>
        <SectionHeader eyebrow="Isi Lemari Kami" eyebrowColor="green" title="Mau Map yang Mana?" highlight="Mana?" highlightColor="green" description="Semua dibuat sendiri di pabrik kami — bukan ambil dari gudang orang." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {TEASERS.map((t) => <TeaserCard key={t.title} t={t} />)}
        </div>
      </div>
    </section>
  );
}

// --- Sekolah focus -------------------------------------------------------
function SekolahV2() {
  const { Badge, Button } = DS2b;
  const colors = ['var(--af-orange)', 'var(--af-green)', 'var(--af-purple)', 'var(--af-blue)'];
  return (
    <section id="sekolah" style={{ background: 'var(--af-purple)', position: 'relative', overflow: 'hidden' }}>
      <window.Wave fill="var(--af-paper)" flip />
      <div style={wrapV2({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' })}>
        <div>
          {/* stack of mini rapor covers */}
          <div style={{ position: 'relative', height: 320 }}>
            {colors.map((c, i) => (
              <div
                key={c}
                style={{
                  position: 'absolute', left: 40 + i * 56, top: 30 + (i % 2) * 26,
                  width: 180, height: 250, background: c,
                  border: '2px solid var(--af-ink)', borderRadius: 14,
                  boxShadow: '0 5px 0 var(--af-ink)', transform: `rotate(${(i - 1.5) * 5}deg)`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                  zIndex: i,
                }}
              >
                <img src="../../assets/logo-mark-white.png" alt="" style={{ height: 44, opacity: .95 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: 13, textAlign: 'center', lineHeight: 1.3 }}>RAPOR<br />SISWA</span>
                <span style={{ background: '#fff', border: '2px solid var(--af-ink)', borderRadius: 999, fontSize: 9, fontWeight: 700, padding: '2px 10px', color: 'var(--af-ink)' }}>LOGO SEKOLAHMU</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
          <Badge color="yellow" dot>Spesial Sekolah &amp; Tempat Les</Badge>
          <h2 style={{ fontSize: 'var(--text-xl)', color: '#fff' }}>
            Rapor Kerennya, <span style={{ color: 'var(--af-yellow)' }}>Biar Kami yang Bikin!</span>
          </h2>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,.92)', maxWidth: 440 }}>
            Sampul rapor dengan logo dan warna khas sekolahmu — bahan tebal, jilid rapi, awet sampai lulus.
            Custom bisa mulai <strong style={{ color: 'var(--af-yellow)' }}>1 pcs</strong>. Kami sarankan 100 pcs agar lebih ekonomis, dengan perkiraan sekitar Rp50.000/pcs sesuai model, bahan, dan cetak.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button color="wa" size="lg" href={window.waLink('Halo Agatha Felix! Saya mau konsultasi rapor / map custom untuk sekolah / les.')} target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Konsultasi Gratis</Button>
            <Button color="orange" size="lg" href="produk-custom.html#simulator">🎨 Desain Sendiri di Simulator</Button>
          </div>
        </div>
      </div>
      <window.Wave fill="var(--af-paper)" />
    </section>
  );
}

// --- Cara pesan ----------------------------------------------------------
function CaraPesanV2() {
  const { SectionHeader, Step } = DS2b;
  return (
    <section id="cara-pesan" style={{ background: 'var(--af-paper)' }}>
      <div style={wrapV2()}>
        <SectionHeader eyebrow="Gampang Banget" eyebrowColor="orange" title="Pesan dalam 3 Langkah" highlight="3 Langkah" highlightColor="orange" description="Nggak pakai ribet — semua lewat WhatsApp." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <Step num={1} title="Cerita Dulu" color="orange">Chat WhatsApp kami. Mau map apa, berapa banyak, ada logo atau belum?</Step>
          <Step num={2} title="Lihat Desainnya" color="green">Kami kirim mockup gratis. Revisi sampai cocok, baru bayar DP.</Step>
          <Step num={3} title="Tunggu di Rumah" color="blue">5–14 hari kerja, paket meluncur ke alamatmu di mana pun di Indonesia.</Step>
        </div>
      </div>
    </section>
  );
}

// --- Testimoni + FAQ + CTA ------------------------------------------------
// --- Instagram video testimonials ---------------------------------------
// Real customer clips, self-hosted so they play inline without Instagram's
// embed script (which is slow and can hit a login wall on mobile). The card
// links out to the original post for the full caption and comments.
//
// To add a clip: export it as a short muted MP4 (H.264, <=2 MB is plenty) into
// project/assets/testimoni/ and point `video` at it below.
const IG_TESTIMONI = [
  {
    href: 'https://www.instagram.com/p/DdDqBuSStgs/',
    video: '../../assets/testimoni/cikeas.mp4',
    name: 'Sekolah Alam Cikeas',
    role: 'Sampul rapor custom',
  },
  {
    href: 'https://www.instagram.com/p/Db1yolqSDIL/',
    video: '../../assets/testimoni/nurul-fikri.mp4',
    name: 'Bimbel Nurul Fikri',
    role: 'Map custom logo',
  },
];

// The clip is attached only after it has actually loaded, so a video that has
// not been added yet leaves the gradient placeholder instead of a black box.
function IGVideoCard({ item }) {
  const mediaRef = React.useRef(null);
  const [hasVideo, setHasVideo] = React.useState(false);

  React.useEffect(() => {
    // The build hands us the clips that actually shipped. Probing a clip that
    // has not been added yet would cost a 404 on every page view, so skip it and
    // leave the placeholder. (No manifest = dev preview, so probe anyway.)
    const shipped = window.AF_MEDIA;
    if (shipped && shipped.indexOf(item.video) < 0) return;

    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
    v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    Object.assign(v.style, {
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      objectFit: 'cover', display: 'block', zIndex: 1,
    });
    let observer;
    v.onloadeddata = () => {
      if (!mediaRef.current) return;
      mediaRef.current.appendChild(v);
      setHasVideo(true);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        observer = new IntersectionObserver(
          (entries) => entries.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())),
          { threshold: 0.4 },
        );
        observer.observe(v);
      }
    };
    v.src = item.video;
    return () => { if (observer) observer.disconnect(); v.removeAttribute('src'); v.load(); };
  }, [item.video]);

  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer"
       style={{
         display: 'block', textDecoration: 'none', color: 'inherit', background: '#fff',
         border: '2px solid var(--af-ink)', borderRadius: 'var(--radius-lg)',
         boxShadow: '0 5px 0 var(--af-ink)', overflow: 'hidden',
       }}>
      <div ref={mediaRef}
           style={{
             position: 'relative', aspectRatio: '4 / 5',
             background: 'linear-gradient(140deg, var(--af-purple), var(--af-orange))',
             display: 'grid', placeItems: 'center', borderBottom: '2px solid var(--af-ink)',
           }}>
        {!hasVideo && (
          <svg viewBox="0 0 24 24" style={{ width: 46, height: 46, stroke: 'rgba(255,255,255,.85)', fill: 'none', strokeWidth: 1.6 }}>
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,.85)" stroke="none" />
          </svg>
        )}
        <span style={{
          position: 'absolute', zIndex: 2, right: 12, bottom: 12, width: 44, height: 44, borderRadius: 999,
          background: 'rgba(255,255,255,.95)', border: '2px solid var(--af-ink)',
          display: 'grid', placeItems: 'center', boxShadow: '0 2px 0 rgba(43,42,40,.3)',
        }}>
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'var(--af-ink)', marginLeft: 2 }}><path d="M8 5v14l11-7z" /></svg>
        </span>
      </div>
      <div style={{ padding: '15px 17px 17px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-heading)', lineHeight: 1.25 }}>{item.name}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.role}</div>
        <div style={{ marginTop: 10, fontSize: '0.8rem', fontWeight: 700, color: 'var(--af-purple)' }}>Tonton di Instagram &rarr;</div>
      </div>
    </a>
  );
}

function TestimoniV2() {
  const { SectionHeader, TestimonialCard } = DS2b;
  return (
    <section id="testimoni" style={{ background: 'var(--af-green-tint)' }}>
      <div style={wrapV2()}>
        <SectionHeader eyebrow="Kata Mereka" eyebrowColor="green" title="Sudah Dicoba 500+ Sekolah & Kantor" highlight="500+" highlightColor="green" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, maxWidth: 620, margin: '0 auto 26px' }}>
          {IG_TESTIMONI.map((item) => <IGVideoCard key={item.href} item={item} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          <TestimonialCard quote="Rapor custom logo sekolah kami hasilnya rapi banget. Murid-murid sampai pamer ke orang tuanya!" name="Bu Rahma Susanti" role="Kepala Sekolah, SDN 04 Bekasi" avatarColor={0} />
          <TestimonialCard quote="Pesan map kancing custom untuk kantor notaris. Cepat, profesional, dan kliennya langsung notice." name="Pak Hendra Wijaya" role="Notaris & PPAT, Jakarta" avatarColor={2} />
          <TestimonialCard quote="Desainnya dibantu sampai kami puas. Rapor bimbel kami sekarang jadi kebanggaan murid." name="Pak Andri Setiawan" role="Owner Bimbel Cerdas Ceria" avatarColor={3} />
        </div>
      </div>
    </section>
  );
}

function FAQV2() {
  const { Badge, Button, FAQItem } = DS2b;
  return (
    <section id="faq" style={{ background: 'var(--af-paper)' }}>
      <div style={wrapV2({ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'start' })}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
          <Badge color="blue">Masih Penasaran?</Badge>
          <h2 style={{ fontSize: 'var(--text-xl)' }}>Tanya-Tanya Dulu, Boleh Banget</h2>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>Belum ketemu jawabannya? Langsung saja chat kami — dibalas manusia, bukan robot.</p>
          <Button variant="ghost" href={window.waLink('Halo Agatha Felix! Saya ada beberapa pertanyaan.')} target="_blank" rel="noopener noreferrer">Tanya via WhatsApp →</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FAQItem question="Minimal pesan berapa, sih?" defaultOpen>Custom bisa mulai 1 pcs, tetapi biaya per pcs lebih tinggi untuk pesanan sedikit. Kami sarankan 100 pcs agar lebih ekonomis, dengan perkiraan sekitar Rp50.000/pcs. Harga akhir mengikuti model, bahan, dan teknik cetak.</FAQItem>
          <FAQItem question="Berapa lama jadinya?">5–14 hari kerja setelah desain kamu setujui, tergantung jumlah dan tingkat kerumitan.</FAQItem>
          <FAQItem question="Aku nggak bisa desain. Gimana dong?">Tenang! Kirim logo dan warna kesukaanmu, tim kami yang buatkan mockup — gratis, revisi sampai cocok.</FAQItem>
          <FAQItem question="Kirim ke luar pulau bisa?">Bisa! Kami kirim ke seluruh Indonesia via ekspedisi. Ongkir dihitung transparan saat penawaran.</FAQItem>
        </div>
      </div>
    </section>
  );
}

function CTAV2() {
  const { Button } = DS2b;
  return (
    <section style={{ background: 'var(--af-orange)', position: 'relative', overflow: 'hidden' }}>
      <window.ConfettiV2 density={1} />
      <div style={wrapV2({ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 })}>
        <img src="../../assets/logo-mark-white.png" alt="" style={{ height: 60 }} />
        <h2 style={{ fontSize: 'var(--text-xl)', color: '#fff', maxWidth: 560 }}>Yuk, Bikin Map Versi Kamu!</h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,.92)', fontSize: '0.95rem', maxWidth: 440 }}>
          Cerita kebutuhanmu, kami buatkan penawaran terbaik — gratis, tanpa komitmen, langsung dari pabriknya.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button color="wa" size="lg" href={window.waLink('Halo Agatha Felix! Saya mau bikin map / rapor versi saya.')} target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Chat WhatsApp Sekarang</Button>
          <Button color="purple" size="lg" href="produk-custom.html#simulator">🎨 Main ke Simulator Rapor</Button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ProdukTeaserV2, SekolahV2, CaraPesanV2, TestimoniV2, FAQV2, CTAV2 });
