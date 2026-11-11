// A crawlable product page. Prices share the catalogue's maintained source.
const CH_DS = window.AgathaFelixDesignSystem_3557c1;
const CH_TYPES = [
  ['folio', 'F4 / Folio', 'clear-holder-folio', 'Untuk dokumen sekolah dan kantor berformat F4/Folio.'],
  ['a4', 'A4', 'clear-holder-a4', 'Untuk laporan, proposal, dan dokumen berformat A4.'],
  ['a3', 'A3', 'clear-holder-a3', 'Untuk dokumen dan karya berformat A3.'],
  ['b5', 'Tipe A5', 'clear-holder-a5', 'Pilihan lebih ringkas; tipe A5 di katalog memakai sampul ukuran B5.'],
];
const CH_CSS = `
.af-ch-wrap{max-width:var(--container-max);margin:auto;padding:56px var(--container-pad)}
.af-ch-hero{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:center}
.af-ch-photo{width:100%;border:2px solid var(--af-ink);border-radius:24px;background:white;aspect-ratio:1;object-fit:contain}
.af-ch-title{font-size:clamp(2.1rem,5vw,3.5rem);line-height:1.12;margin:16px 0}
.af-ch-lead{font-size:1.05rem;line-height:1.8;color:var(--text-body);max-width:40em}
.af-ch-actions{display:flex;flex-wrap:wrap;gap:16px;align-items:center;margin-top:24px}
.af-ch-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;margin-top:28px}
.af-ch-card{padding:20px;background:#fff;border:2px solid var(--af-ink);border-radius:20px;box-shadow:0 3px 0 rgba(43,42,40,.16)}
.af-ch-card img{width:100%;aspect-ratio:1;object-fit:contain;border-radius:12px}
.af-ch-card h3{margin:16px 0 8px}.af-ch-card p{font-size:.9rem;line-height:1.7;color:var(--text-body)}
.af-ch-card a,.af-ch-wrap nav a,.af-ch-textlink{color:var(--af-orange-deep);font-weight:700;text-underline-offset:4px}
.af-ch-card a{display:inline-block;padding:12px 0}
.af-ch-scroll{overflow-x:auto;border:1px solid var(--af-line);border-radius:16px;background:#fff;margin-top:24px}
.af-ch-table{border-collapse:collapse;width:100%;min-width:520px;font-size:.93rem}
.af-ch-table th,.af-ch-table td{padding:14px 18px;text-align:right;border-bottom:1px solid var(--af-line);white-space:nowrap}
.af-ch-table th:first-child{text-align:left}.af-ch-table thead{background:var(--af-orange-tint)}
.af-ch-note{font-size:.85rem;color:var(--text-muted);line-height:1.7;margin-top:14px}
.af-ch-guides{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:24px}
.af-ch-guides h3{margin-bottom:10px}.af-ch-guides p{line-height:1.8;color:var(--text-body)}
.af-ch-faq{max-width:780px;margin:24px auto 0;display:grid;gap:12px}
@media(max-width:850px){.af-ch-hero{grid-template-columns:1fr}.af-ch-hero>figure{max-width:420px;margin:0 auto}.af-ch-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.af-ch-guides{grid-template-columns:1fr}}
@media(max-width:420px){.af-ch-wrap{padding-top:36px;padding-bottom:36px}.af-ch-grid{grid-template-columns:1fr}.af-ch-actions>a{width:100%;justify-content:center}.af-ch-table th,.af-ch-table td{padding:12px}}
`;

function ClearHolderPage() {
  const { Button, Badge, FAQItem } = CH_DS;
  const prices = window.HARGA_STANDAR;
  const money = (value) => value == null ? '—' : 'Rp' + value.toLocaleString('id-ID');
  const ask = window.waLink('Halo Agatha Felix, saya ingin memesan clear holder. Ukuran: ...; isi kantong: ...; jumlah: ... pcs; warna: ...; kota pengiriman: .... Mohon info stok dan harga.');
  return <div data-screen-label="Clear Holder">
    <style>{CH_CSS}</style>
    <window.HeaderV2 active="produk-standar.html" />
    <main>
      <section className="af-ch-wrap">
        <nav aria-label="Breadcrumb" style={{ fontSize: '.85rem', marginBottom: 28 }}><a href="/">Beranda</a> / <a href="/produk-standar/">Produk Standar</a> / <span aria-current="page">Clear Holder</span></nav>
        <div className="af-ch-hero">
          <div>
            <Badge color="orange">Langsung dari Pabrik di Bekasi</Badge>
            <h1 className="af-ch-title">Clear Holder <span style={{ color: 'var(--af-orange-deep)' }}>A4, F4/Folio &amp; A3</span></h1>
            <p className="af-ch-lead">Buku display dengan kantong plastik bening untuk menyimpan laporan, sertifikat, dan dokumen sekolah atau kantor. Pilih ukuran dan jumlah kantong yang sesuai, lalu pesan satuan atau grosir melalui WhatsApp.</p>
            <div className="af-ch-actions"><Button color="wa" size="lg" href={ask} data-wa="clear-holder-hero" target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Tanya Stok &amp; Pesan</Button><a className="af-ch-textlink" href="#harga-clear-holder">Lihat Harga per Pcs ↓</a></div>
            <p className="af-ch-note">Pilihan warna dan ketersediaan dikonfirmasi saat pemesanan. Cetak logo custom mulai 50 pcs per desain/warna.</p>
          </div>
          <figure style={{ margin: 0 }}><img className="af-ch-photo" src="../../assets/katalog/clear-holder-folio-540.webp" width="540" height="540" alt="Clear Holder Folio Agatha Felix untuk dokumen sekolah dan kantor" /><figcaption className="af-ch-note">Clear Holder tipe Folio. Lihat foto dan pilihan tipe di bawah.</figcaption></figure>
        </div>
      </section>
      <section style={{ background: 'var(--af-paper-2)' }}><div className="af-ch-wrap">
        <h2>Pilih Ukuran Clear Holder</h2>
        <p className="af-ch-lead">Cocokkan ukuran dokumen yang akan dimasukkan. Jika ragu antara A4 dan F4/Folio, kirim ukuran atau foto dokumennya agar kami bantu memilih tipe.</p>
        <div className="af-ch-grid">{CH_TYPES.map(([key,label,slug,description]) => <article className="af-ch-card" key={key}>
          <img src={'../../assets/katalog/' + slug + '-540.webp'} alt={'Clear Holder ' + label + ' Agatha Felix'} width="540" height="540" loading="lazy" decoding="async" />
          <h3>{label}</h3><p>{description}</p><a href={'/produk-standar/#' + slug}>Lihat Foto &amp; Detail {label} →</a>
        </article>)}</div>
      </div></section>
      <section className="af-ch-wrap" id="harga-clear-holder">
        <h2>Harga Clear Holder Satuan dan Pilihan Isi</h2>
        <p className="af-ch-lead">Harga berikut per pcs, menurut ukuran dan jumlah kantong. Untuk kebutuhan grosir, sampaikan jumlah serta warna yang dibutuhkan agar kami menyiapkan penawaran.</p>
        <div className="af-ch-scroll" role="region" aria-label="Tabel harga clear holder, geser untuk melihat semua ukuran" tabIndex="0"><table className="af-ch-table">
          <caption style={{ textAlign: 'left', padding: '16px 18px', fontWeight: 700 }}>Harga dalam Rupiah per pcs</caption>
          <thead><tr><th scope="col">Isi kantong</th>{CH_TYPES.map(([key,label]) => <th scope="col" key={key}>{label}</th>)}</tr></thead>
          <tbody>{prices.clearHolder.isi.map(([count,values]) => <tr key={count}><th scope="row">{count} lembar</th>{CH_TYPES.map(([key]) => <td key={key}>{money(values[prices.clearHolder.ukuran.findIndex(([size]) => size === key)])}</td>)}</tr>)}</tbody>
        </table></div>
        <p className="af-ch-note">Update {prices.update}. Harga dapat berubah sewaktu-waktu; tanda — berarti tidak tercantum pada daftar harga. Tipe A5 di katalog menggunakan sampul ukuran B5 dan kolom harga B5. Ketersediaan tiap kombinasi dikonfirmasi melalui WhatsApp.</p>
        <div className="af-ch-actions"><Button color="wa" href={ask} data-wa="clear-holder-harga" target="_blank" rel="noopener noreferrer"><window.WaGlyph2 /> Minta Penawaran Clear Holder</Button></div>
      </section>
      <section style={{ background: 'var(--af-blue-tint)' }}><div className="af-ch-wrap">
        <h2>Supaya Clear Holder Sesuai Kebutuhan Anda</h2>
        <div className="af-ch-guides">
          <article className="af-ch-card"><h3>1. Cocokkan Ukuran Dokumen</h3><p>Pilih berdasarkan kertas yang akan disimpan. Dokumen F4/Folio lebih panjang daripada A4; sebutkan format dokumen saat memesan agar tidak salah memilih ukuran.</p></article>
          <article className="af-ch-card"><h3>2. Hitung Kantong yang Diperlukan</h3><p>Siapkan susunan laporan atau dokumen, lalu tentukan jumlah kantong. Pilihan isi berbeda menurut ukuran; gunakan tabel harga untuk melihat kombinasi yang tercantum.</p></article>
          <article className="af-ch-card"><h3>3. Pilih Polos atau Custom Logo</h3><p>Produk standar dapat dibeli satuan atau grosir. Untuk kebutuhan berlogo sekolah atau perusahaan, <a className="af-ch-textlink" href="/produk-custom/">lihat pilihan clear holder custom</a> dengan minimum 50 pcs per desain/warna.</p></article>
        </div>
      </div></section>
      <section className="af-ch-wrap">
        <h2 style={{ textAlign: 'center' }}>Pertanyaan tentang Clear Holder</h2>
        <div className="af-ch-faq">
          <FAQItem question="Clear holder itu apa?">Clear holder adalah buku display berisi kantong plastik bening untuk menyusun dokumen. Dokumen dapat dibaca dengan membalik kantongnya tanpa mengeluarkan setiap lembar.</FAQItem>
          <FAQItem question="Bisa beli satuan atau harus grosir?">Produk standar dapat dibeli satuan maupun grosir. Sebutkan ukuran, isi kantong, jumlah, dan warna melalui WhatsApp untuk konfirmasi stok dan harga.</FAQItem>
          <FAQItem question="Bisa dicetak logo sekolah atau perusahaan?">Bisa. Pesanan cetak logo custom mulai 50 pcs per desain/warna. Tim kami membantu menyiapkan mockup dan penawaran sesuai kebutuhan Anda.</FAQItem>
          <FAQItem question="Bisa dikirim ke luar Bekasi?">Bisa, kami melayani pengiriman ke seluruh Indonesia melalui ekspedisi. Biaya pengiriman dikonfirmasi saat penawaran.</FAQItem>
        </div>
        <p style={{ textAlign: 'center', marginTop: 32 }}><a className="af-ch-textlink" href="/produk-standar/">Lihat Katalog Map Plastik Lainnya →</a></p>
      </section>
    </main>
    <window.FooterV2 /><window.FloatingWAV2 />
  </div>;
}
Object.assign(window, { ClearHolderPage });
