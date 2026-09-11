// Website v2 — Produk Standar: playful catalogue with audience filter.
const DS2p = window.AgathaFelixDesignSystem_3557c1;

const wrapPS = (extra = {}) => ({
  maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1,
  padding: '72px var(--container-pad)', ...extra,
});

const IMG = '../../assets/products/';
const KATALOG = [
  { name: 'Business File', desc: 'Map kancing bahan PP tebal — klik, simpan, bawa. Banyak warna ceria, bisa cetak logo.', color: 'orange', aud: ['sekolah', 'kantor'], badge: 'Favorit', img: IMG + 'business-file.png' },
  { name: 'Clear Holder A4', desc: 'Buku display isi 20–80 kantong bening. Dokumen tersusun rapi, gampang dibolak-balik.', color: 'blue', aud: ['kantor', 'sekolah'], badge: 'A4 Populer', img: IMG + 'clear-holder.png' },
  { name: 'Map L / Clear Sleeves', desc: 'Lembar L transparan tipis — aman & gampang dipakai. Warna-warni buat ngelompokin tugas.', color: 'green', aud: ['sekolah', 'kantor'], badge: null, img: IMG + 'map-l.png' },
  { name: 'Map Executive', desc: 'Document keeper premium: jahitan rapi, poly emas, slot name card. Buat yang serius.', color: 'purple', aud: ['premium', 'kantor'], badge: 'Premium', img: IMG + 'map-executive.png' },
  { name: 'Carry File Kancing', desc: 'File PP dengan kancing kuat & handle. Dokumen aman dibawa ke mana-mana.', color: 'blue', aud: ['kantor', 'sekolah'], badge: null, img: IMG + 'carry-file-kancing.png' },
  { name: 'Carry File Capslock', desc: 'Caps lock kokoh plus handle bag. Gampang dipakai, dokumen nggak tumpah.', color: 'orange', aud: ['kantor'], badge: 'Best Seller', img: IMG + 'carry-file-capslock.png' },
  { name: 'Expanding File', desc: 'Map akordion bersekat banyak, tali elastis, tebal & awet. Arsip rapi per kategori.', color: 'green', aud: ['kantor', 'sekolah'], badge: null, img: IMG + 'expanding-file.png' },
  { name: 'Zipper Bag + Nametag', desc: 'Tas resleting jaring dengan slot name card & handle. Bawa berkas plus alat tulis.', color: 'purple', aud: ['sekolah', 'kantor'], badge: null, img: IMG + 'zipper-kancing.png' },
  { name: 'Zipper Bag Setengah Jaring', desc: 'Resleting setengah jaring, isi kelihatan separuh. Ringan dengan warna ceria.', color: 'orange', aud: ['sekolah'], badge: null, img: IMG + 'zipper-jaring.png' },
];

const FILTERS = [
  ['semua', 'Semua 🗂️'],
  ['sekolah', 'Buat Sekolah 🎒'],
  ['kantor', 'Buat Kantor 💼'],
  ['premium', 'Premium ✨'],
];

const PS_ICONS = {
  blue: ['M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z', 'M8 10h8', 'M8 14h5'],
  green: ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z'],
  orange: ['M2 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z', 'M12 11v4', 'M12 11a1.5 1.5 0 1 0 0-.01'],
  purple: ['M2 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z', 'M7 13h10'],
};

function KatalogCard({ p }) {
  return (
    <div
      style={{
        background: '#fff', border: '2px solid var(--af-ink)', borderRadius: 'var(--radius-lg)',
        boxShadow: '0 5px 0 var(--af-ink)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 220ms var(--ease-pop)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px) rotate(-.6deg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
    >
      <div
        style={{
          height: 150, background: '#f4ede1',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          borderBottom: '2px solid var(--af-ink)', position: 'relative',
        }}
      >
        {p.img ? (
          <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
        {p.badge ? (
          <span style={{ position: 'absolute', top: 8, right: 8, background: 'var(--af-yellow)', border: '2px solid var(--af-ink)', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, padding: '2px 9px', color: 'var(--af-ink)' }}>{p.badge}</span>
        ) : null}
      </div>
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ fontSize: '1.1rem' }}>{p.name}</h3>
        <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.55, color: 'var(--text-body)', flex: 1 }}>{p.desc}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: `var(--af-${p.color})`, flexShrink: 0 }}></span>Chat untuk <strong style={{ color: `var(--af-${p.color}-deep)` }}>harga grosir</strong></span>
      </div>
    </div>
  );
}

function ProdukStandarPage() {
  const { Badge, Button, SectionHeader } = DS2p;
  const [filter, setFilter] = React.useState('semua');
  const shown = KATALOG.filter((p) => filter === 'semua' || p.aud.includes(filter));
  return (
    <div data-screen-label="Produk Standar">
      <window.HeaderV2 active="produk-standar.html" />
      <main>
        <section style={{ background: 'var(--af-green-tint)', position: 'relative', overflow: 'hidden' }}>
          <window.ConfettiV2 />
          <div style={wrapPS({ paddingBottom: 28, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 })}>
            <Badge color="green" dot>Siap Kirim Hari Ini</Badge>
            <h1 style={{ fontSize: 'var(--text-2xl)', maxWidth: 640 }}>
              Katalog Map Plastik <span style={{ color: 'var(--af-green)' }}>Siap Pakai</span>
            </h1>
            <p style={{ margin: 0, fontSize: 'var(--text-md)', maxWidth: 520 }}>
              Tanpa minimum desain, tanpa nunggu produksi — pilih, pesan, kirim. Beli per lusin atau grosir.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              {FILTERS.map(([key, label]) => {
                const isOn = filter === key;
                return (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                      background: isOn ? 'var(--af-green)' : '#fff', color: isOn ? '#fff' : 'var(--af-ink)',
                      border: '2px solid var(--af-ink)', borderRadius: 999, padding: '9px 20px',
                      boxShadow: isOn ? '0 3px 0 var(--af-ink)' : 'none',
                      transition: 'all 160ms var(--ease-pop)',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <window.Wave fill="var(--af-paper)" />
        </section>

        <section style={{ background: 'var(--af-paper)' }}>
          <div style={wrapPS({ paddingTop: 36 })}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
              {shown.map((p) => <KatalogCard key={p.name} p={p} />)}
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 28 }}>
              Harga menyusul setelah konfirmasi jumlah — chat kami untuk daftar harga grosir terbaru 👇
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button color="wa" size="lg" href={window.waLink('Halo Agatha Felix! Saya mau tanya katalog & daftar harga grosir.')} target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Tanya Katalog &amp; Harga</Button>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--af-blue-tint)' }}>
          <window.Wave fill="var(--af-paper)" flip />
          <div style={wrapPS({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', paddingTop: 40, paddingBottom: 56 })}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)' }}>Butuh yang ada logo-nya?</h2>
              <p style={{ margin: '6px 0 0', fontSize: '0.9rem' }}>Semua produk di atas bisa dicetak custom dengan logo &amp; warna institusimu.</p>
            </div>
            <Button color="purple" size="lg" href="produk-custom.html">Lihat Custom &amp; Rapor →</Button>
          </div>
        </section>
      </main>
      <window.FooterV2 />
      <window.FloatingWAV2 />
    </div>
  );
}

Object.assign(window, { ProdukStandarPage });
