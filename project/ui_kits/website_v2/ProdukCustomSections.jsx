// Website v2 — Produk Custom page (school pitch, simulator, professionals, process).
const DS2c = window.AgathaFelixDesignSystem_3557c1;

const wrapPC = (extra = {}) => ({
  maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1,
  padding: '72px var(--container-pad)', ...extra,
});

// Visible FAQ. build.mjs (CUSTOM_FAQ_ITEMS) publishes the same text as FAQPage
// structured data, and test.mjs checks the two stay identical.
const CUSTOM_FAQ = [
  ['Minimal pesannya berapa?', 'Minimal 50 pcs untuk produk custom. Makin banyak makin ekonomis: kami sarankan 100 pcs, dengan perkiraan sekitar Rp50.000/pcs. Harga akhir mengikuti model, bahan, dan teknik cetak.'],
  ['Berapa lama produksinya?', '5–14 hari kerja setelah desain disetujui dan DP masuk, tergantung jumlah dan tingkat kerumitan.'],
  ['Aku belum punya desain, cuma punya logo. Bisa?', 'Bisa. Kirim logo (JPG, PNG, PDF, atau CDR) dan warna yang kamu mau, tim kami buatkan mockup gratis dan revisi sampai cocok.'],
  ['Teknik cetaknya apa saja?', 'Jahit, press dengan hot print foil emas atau silver, cordura, dan sablon, juga clear holder dan zipper bag berlogo. Contohnya ada di bagian Karya Kami di atas.'],
  ['Ongkos kirimnya bagaimana?', 'Gratis ongkir Jabodetabek untuk pesanan minimal 50 pcs. Luar Jabodetabek kami kirim ke seluruh Indonesia via ekspedisi, ongkirnya dihitung saat penawaran.'],
  ['Seberapa cepat dibalas?', 'Di jam kerja (Senin–Sabtu, 08.00–17.00 WIB) kami balas WhatsApp di bawah 1 jam. Pesan di luar jam itu kami balas di hari kerja berikutnya.'],
];

// Phone layout for the process steps: number beside the text instead of
// four tall centred blocks.
const PC_CSS_ID = 'af-produk-custom';
(function injectPcCss() {
  if (typeof document === 'undefined' || document.getElementById(PC_CSS_ID)) return;
  const tag = document.createElement('style');
  tag.id = PC_CSS_ID;
  tag.textContent = `
  @media (max-width: 680px) {
    .af-pc-steps { grid-template-columns: 1fr !important; gap: 18px !important; max-width: 460px; margin: 0 auto; }
    .af-pc-steps > div { display: grid !important; grid-template-columns: 48px 1fr; column-gap: 14px; text-align: left !important; padding: 0 !important; }
    .af-pc-steps > div > div { width: 44px !important; height: 44px !important; margin: 0 !important; font-size: 1.15rem !important; grid-row: span 2; }
    .af-pc-steps h3 { font-size: 1.1rem !important; margin: 2px 0 4px !important; }
    .af-pc-hero-cta { width: 100%; max-width: 360px; }
    .af-pc-hero-cta .af-btn { flex: 1 1 100%; }
  }`;
  document.head.appendChild(tag);
})();

function ProdukCustomPage() {
  const { Badge, Button, Step, Chip, FAQItem, SectionHeader } = DS2c;
  return (
    <div data-screen-label="Produk Custom">
      <window.HeaderV2 active="produk-custom.html" />
      <main>
        {/* hero */}
        <section style={{ background: 'var(--af-orange-tint)', position: 'relative', overflow: 'hidden' }}>
          <window.ConfettiV2 />
          <div style={wrapPC({ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingBottom: 40 })}>
            <Badge color="orange" dot>✏️ Custom Order</Badge>
            <h1 style={{ fontSize: 'var(--text-2xl)', maxWidth: 820, textWrap: 'balance' }}>
              Custom Rapor &amp; Map, <span style={{ color: 'var(--af-orange)' }}>Logo &amp; Warna Kamu!</span>
            </h1>
            <p style={{ margin: 0, fontSize: 'var(--text-md)', maxWidth: 540 }}>
              Rapor sekolah, map les, sampai file kantor notaris — kami cetak sesuai identitasmu.
              Custom mulai 50 pcs. Disarankan 100 pcs agar lebih ekonomis, dengan perkiraan sekitar Rp50.000/pcs sesuai model, bahan, dan cetak.
            </p>
            <div className="af-pc-hero-cta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button color="wa" size="lg" href={window.waLink('Halo Agatha Felix! Saya mau konsultasi rapor / map custom.')} target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Konsultasi via WhatsApp</Button>
              <Button variant="ghost" size="lg" href="#produk-custom">Lihat Pilihan Produk ↓</Button>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip color="purple">Sekolah &amp; TK</Chip>
              <Chip color="green">Bimbel &amp; Les</Chip>
              <Chip color="blue">Universitas</Chip>
              <Chip color="orange">Notaris · Lawyer · Korporat</Chip>
            </div>
          </div>
          <window.Wave fill="var(--af-yellow-tint)" />
        </section>

        <window.CustomProdukSection />

        <window.SimulatorRapor />

        <window.PortfolioCustom />

        {/* professionals */}
        <section id="profesional" style={{ background: 'var(--af-ink)', position: 'relative' }}>
          <window.Wave fill="var(--af-paper)" flip />
          <div style={wrapPC({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' })}>
            <div
              style={{
                border: '2px solid rgba(255,255,255,.25)', borderRadius: 'var(--radius-xl)',
                overflow: 'hidden', transform: 'rotate(-1.2deg)', boxShadow: '0 8px 0 rgba(0,0,0,.35)',
              }}
            >
              <img src="../../assets/document-keeper-green.png" alt="Document Keeper Executive Agatha Felix dengan foil emas" loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
              <Badge color="yellow" dot>Untuk yang Serius-Serius</Badge>
              <h2 style={{ fontSize: 'var(--text-xl)', color: '#fff' }}>
                Notaris, Lawyer, Kantor — <span style={{ color: 'var(--af-yellow)' }}>Kami Juga Bisa Kalem</span>
              </h2>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,.85)', maxWidth: 440 }}>
                Di balik warna-warni kami, ada lini executive: document keeper kulit sintetis dengan
                <strong style={{ color: '#fff' }}> emboss foil emas nama firma Anda</strong>. Akta, kontrak, dan
                sertifikat klien tersimpan rapi — dan terlihat semahal isinya.
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem', lineHeight: '22px', color: 'rgba(255,255,255,.85)' }}>
                {['Foil emas / perak nama & logo firma', 'Pilihan warna formal: hijau, hitam, maroon, biru', 'Pilihan isi 20 · 40 · 60 lembar','Custom mulai 50 pcs; disarankan 100 pcs'].map((t) => (
                  <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    {/* Top-aligned to the first text line (22px), so wrapped items keep the tick beside line one. */}
                    <span aria-hidden="true" style={{ marginTop: 2, width: 18, height: 18, borderRadius: '50%', background: 'var(--af-yellow)', color: 'var(--af-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button color="wa" size="lg" href={window.waLink('Halo Agatha Felix! Saya tertarik dengan lini executive (document keeper foil emas).')} target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Konsultasi Lini Executive</Button>
                <Button variant="ghost" size="lg" href="#custom-map-executive" style={{ color: '#fff', borderColor: '#fff' }}>Lihat Pilihan Map Executive</Button>
              </div>
            </div>
          </div>
          <window.Wave fill="var(--af-paper)" />
        </section>

        {/* process */}
        <section style={{ background: 'var(--af-paper)' }}>
          <div style={wrapPC()}>
            <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 44px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Badge color="blue">Dari Chat Sampai Paket Datang</Badge>
              <h2 style={{ fontSize: 'var(--text-xl)' }}>Prosesnya Begini</h2>
            </div>
            <div className="af-pc-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              <Step num={1} title="Cerita & Brief" color="orange">Chat WA: produk, jumlah, logo, warna kesukaan. Atau bawa hasil simulatormu!</Step>
              <Step num={2} title="Mockup Gratis" color="green">Tim desain buatkan pratinjau. Revisi sampai kamu bilang oke.</Step>
              <Step num={3} title="Produksi" color="purple">DP masuk, mesin jalan. 5–14 hari kerja di pabrik kami sendiri.</Step>
              <Step num={4} title="Kirim!" color="blue">Paket meluncur ke seluruh Indonesia. Foto produk dikirim sebelum ekspedisi.</Step>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq-custom" style={{ background: 'var(--af-blue-tint)' }}>
          <window.Wave fill="var(--af-paper)" flip />
          <div style={wrapPC({ paddingTop: 40, maxWidth: 820 })}>
            <SectionHeader eyebrow="Tanya Jawab" eyebrowColor="blue" title="Sebelum Kamu Chat" highlight="Chat" highlightColor="blue" description="Jawaban singkat untuk pertanyaan yang paling sering masuk soal pesanan custom." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CUSTOM_FAQ.map(([q, a], i) => <FAQItem key={q} question={q} defaultOpen={i === 0}>{a}</FAQItem>)}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'var(--af-purple)', position: 'relative', overflow: 'hidden' }}>
          <window.ConfettiV2 />
          <div style={wrapPC({ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 })}>
            <img src="../../assets/logo-mark-white.png" alt="" style={{ height: 56 }} />
            <h2 style={{ fontSize: 'var(--text-xl)', color: '#fff', maxWidth: 560 }}>Siap Bikin yang Versi Kamu?</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,.9)', fontSize: '0.95rem', maxWidth: 440 }}>
              Kirim logo dan ceritamu — penawaran &amp; mockup gratis, tanpa komitmen.
            </p>
            <Button color="wa" size="lg" href={window.waLink('Halo Agatha Felix! Saya mau mulai pesan map / rapor custom.')} target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Mulai dari WhatsApp</Button>
          </div>
        </section>
      </main>
      <window.FooterV2 />
      <window.FloatingWAV2 />
    </div>
  );
}

Object.assign(window, { ProdukCustomPage });
