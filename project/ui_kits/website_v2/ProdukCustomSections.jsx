// Website v2 — Produk Custom page (school pitch, simulator, professionals, process).
const DS2c = window.AgathaFelixDesignSystem_3557c1;

const wrapPC = (extra = {}) => ({
  maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1,
  padding: '72px var(--container-pad)', ...extra,
});

function ProdukCustomPage() {
  const { Badge, Button, Step, Chip } = DS2c;
  return (
    <div data-screen-label="Produk Custom">
      <window.HeaderV2 active="produk-custom.html" />
      <main>
        {/* hero */}
        <section style={{ background: 'var(--af-orange-tint)', position: 'relative', overflow: 'hidden' }}>
          <window.ConfettiV2 />
          <div style={wrapPC({ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingBottom: 40 })}>
            <Badge color="orange" dot>✏️ Custom Order</Badge>
            <h1 style={{ fontSize: 'var(--text-2xl)', maxWidth: 700 }}>
              Logo Kamu, Warna Kamu, <span style={{ color: 'var(--af-orange)' }}>Map Kamu!</span>
            </h1>
            <p style={{ margin: 0, fontSize: 'var(--text-md)', maxWidth: 540 }}>
              Custom rapor sekolah, map les, sampai file kantor notaris — kami cetak sesuai identitasmu.
              Custom mulai 50 pcs. Disarankan 100 pcs agar lebih ekonomis, dengan perkiraan sekitar Rp50.000/pcs sesuai model, bahan, dan cetak.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip color="purple">Sekolah &amp; TK</Chip>
              <Chip color="green">Bimbel &amp; Les</Chip>
              <Chip color="blue">Universitas</Chip>
              <Chip color="orange">Notaris · Lawyer · Korporat</Chip>
            </div>
          </div>
          <window.Wave fill="var(--af-yellow-tint)" />
        </section>

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
                {['Foil emas / perak nama & logo firma', 'Pilihan warna formal: hijau, hitam, maroon, navy', 'Kapasitas 20–100 dokumen', 'Custom mulai 50 pcs; disarankan 100 pcs'].map((t) => (
                  <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    {/* Top-aligned to the first text line (22px), so wrapped items keep the tick beside line one. */}
                    <span aria-hidden="true" style={{ marginTop: 2, width: 18, height: 18, borderRadius: '50%', background: 'var(--af-yellow)', color: 'var(--af-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Button color="wa" size="lg" href={window.waLink('Halo Agatha Felix! Saya tertarik dengan lini executive (document keeper foil emas).')} target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Konsultasi Lini Executive</Button>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              <Step num={1} title="Cerita & Brief" color="orange">Chat WA: produk, jumlah, logo, warna kesukaan. Atau bawa hasil simulatormu!</Step>
              <Step num={2} title="Mockup Gratis" color="green">Tim desain buatkan pratinjau. Revisi sampai kamu bilang oke.</Step>
              <Step num={3} title="Produksi" color="purple">DP masuk, mesin jalan. 5–14 hari kerja di pabrik kami sendiri.</Step>
              <Step num={4} title="Kirim!" color="blue">Paket meluncur ke seluruh Indonesia. Foto produk dikirim sebelum ekspedisi.</Step>
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
