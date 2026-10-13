// Website v2 — Simulator Rapor: pick color + accent + name + logo → live mockup.
const DS2s = window.AgathaFelixDesignSystem_3557c1;

const SIM_COLORS = [
  ['Oranye', 'var(--af-orange)', 'var(--af-orange-deep)'],
  ['Hijau', 'var(--af-green)', 'var(--af-green-deep)'],
  ['Ungu', 'var(--af-purple)', 'var(--af-purple-deep)'],
  ['Biru', 'var(--af-blue)', 'var(--af-blue-deep)'],
  ['Hitam Elegan', '#2B2A28', '#141413'],
  ['Hijau Eksekutif', '#1E3B2F', '#10241B'],
];
const SIM_ACCENTS = [
  ['Kuning', 'var(--af-yellow)'],
  ['Putih', '#FFFFFF'],
  ['Emas', '#D4A93C'],
];

// Phones: the cover preview comes first and is scaled down, so every colour
// tap shows its result right above the swatches instead of a screen below.
const SIM_CSS_ID = 'af-simulator';
(function injectSimCss() {
  if (typeof document === 'undefined' || document.getElementById(SIM_CSS_ID)) return;
  const tag = document.createElement('style');
  tag.id = SIM_CSS_ID;
  tag.textContent = `
  @media (max-width: 900px) {
    #simulator .af-sim-grid { grid-template-columns: minmax(0, 1fr) !important; }
    .af-sim-preview { order: -1; min-width: 0; }
    /* Shell's stacked-layout rule left-aligns every flex column in #simulator,
       which shrank the name field, upload box and WA button to their content. */
    #simulator .af-sim-controls { align-items: stretch !important; }
  }
  @media (max-width: 680px) {
    .af-sim-grid { gap: 20px !important; }
    .af-sim-preview { height: 312px; align-items: flex-start; }
    .af-sim-book { transform: scale(.72) rotate(1.5deg) !important; transform-origin: top center; }
    .af-sim-controls { padding: 20px !important; gap: 16px !important; }
  }
  .af-sim-konfig { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; padding: 10px 12px; border-radius: 12px;
    background: var(--af-purple-tint); border: 1.5px solid var(--af-ink); font-size: .86rem; line-height: 1.45; color: var(--af-ink); }
  .af-sim-konfig span { width: 100%; font-size: .78rem; font-weight: 600; color: var(--text-muted); }
  .af-sim-konfig strong { font-family: var(--font-display); font-weight: 800; }
  .af-sim-konfig a, .af-sim-hint a { font-weight: 700; color: var(--af-purple-deep); }
  .af-sim-hint { margin: 0; font-size: .82rem; line-height: 1.5; color: var(--text-body); }`;
  document.head.appendChild(tag);
})();

// The WhatsApp message. Linked to a rapor product (p, with its draft d from the
// product sheet), it is that sheet's own message with the design added, so the
// model, specification, colour count and quantity all carry over. The cover
// colour is named once: the sheet's when it has one (a swatch picked here is
// written into the sheet), otherwise the simulator's.
function pesanSimulator(desain, p, d) {
  const sampulSheet = p && (d.raw['warna-sampul'] || '').trim();
  const lines = sampulSheet ? [] : ['- Warna sampul: ' + desain.sampul];
  lines.push('- Warna tulisan: ' + desain.tulisan);
  if (desain.nama) lines.push('- Nama sekolah di sampul: ' + desain.nama);
  if (!p) {
    return ['Halo Agatha Felix! Saya mau pesan rapor custom sesuai simulator:', ...lines,
      'Jumlah: ... pcs (minimal 50 pcs per warna)', '', 'Logo sekolah saya kirim di chat ini.'].join('\n');
  }
  const pesan = window.AfCustom.pesanDraft(p, d).split('\n');
  // Before the closing note about the logo or sample photo.
  pesan.splice(pesan.length - 2, 0, '', 'Desain dari simulator rapor:', ...lines);
  return pesan.join('\n');
}

// order: useCustomDrafts() from the page. Its simDari is the rapor product
// the visitor configured last, whose draft goes along with the design.
function SimulatorRapor({ order }) {
  const { Button, Input } = DS2s;
  const C = window.AfCustom;
  const [color, setColor] = React.useState(0);
  const [accent, setAccent] = React.useState(0);
  // Empty by default: a prefilled sample name used to travel into real enquiries.
  const [nama, setNama] = React.useState('');
  const [logo, setLogo] = React.useState(null);
  const started = React.useRef(false);

  const dari = order && order.simDari ? C.CUSTOM_PRODUK.find((x) => x.slug === order.simDari) : null;
  const draft = dari ? order.drafts[dari.slug] || C.DRAFT_BARU : null;
  // Linked to a product, the cover colour is the sheet's: a swatch picked here
  // is written into the draft, and a sheet colour that names a swatch shows it.
  // One with no swatch (e.g. "navy") keeps the preview as it is.
  const sampulDraft = draft ? (draft.raw['warna-sampul'] || '').trim() : '';
  const iDraft = SIM_COLORS.findIndex(([label]) => label.toLowerCase() === sampulDraft.toLowerCase());
  const shown = iDraft >= 0 ? iDraft : color;
  const sampulLain = !!sampulDraft && iDraft < 0;
  const [, base, deep] = SIM_COLORS[shown];
  const [, accentColor] = SIM_ACCENTS[accent];

  // simulator_start, once: the first change to the design.
  function mulai() {
    if (started.current) return;
    started.current = true;
    if (window.AFTracking && window.AFTracking.noteStep) window.AFTracking.noteStep('simulator_start', { sim_source: dari ? 'konfigurator' : 'langsung' });
  }
  function pilihSampul(i) {
    mulai();
    setColor(i);
    if (dari) order.ubah(dari, { raw: { ...draft.raw, 'warna-sampul': SIM_COLORS[i][0] } });
  }

  const onLogo = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    mulai();
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(f);
  };

  const pesanWA = pesanSimulator({ sampul: SIM_COLORS[shown][0], tulisan: SIM_ACCENTS[accent][0], nama: nama.trim() }, dari, draft);

  const swatchStyle = (bg, isOn) => ({
    width: 44, height: 44, borderRadius: '50%', background: bg, cursor: 'pointer',
    border: '2px solid var(--af-ink)',
    boxShadow: isOn ? '0 0 0 4px var(--af-yellow)' : '0 3px 0 rgba(43,42,40,.16)',
    transform: isOn ? 'scale(1.1)' : 'none',
    transition: 'all 160ms var(--ease-pop)', padding: 0,
  });

  return (
    <section id="simulator" style={{ background: 'var(--af-yellow-tint)', position: 'relative', overflow: 'hidden' }}>
      <window.ConfettiV2 />
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', position: 'relative', zIndex: 1, padding: '72px var(--container-pad)' }}>
        <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 40px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', background: 'var(--af-yellow)', border: '2px solid var(--af-ink)', color: 'var(--af-ink)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 800, padding: '6px 16px', borderRadius: 999 }}>🎨 SIMULATOR RAPOR</span>
          <h2 style={{ fontSize: 'var(--text-xl)' }}>Coba Desain Custom Rapor Sekolahmu di Sini!</h2>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Pilih warna, tulis nama sekolah, pasang logo — langsung kelihatan jadinya. Suka? Kirim ke kami lewat WhatsApp.</p>
        </div>

        <div className="af-sim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 40, alignItems: 'center', maxWidth: 940, margin: '0 auto' }}>
          {/* controls */}
          <div className="af-sim-controls" style={{ background: '#fff', border: '2px solid var(--af-ink)', borderRadius: 'var(--radius-lg)', boxShadow: '0 5px 0 var(--af-ink)', padding: 26, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-heading)', marginBottom: 10 }}>1 · Warna sampul <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>· {sampulLain ? 'sesuai pilihan produk' : SIM_COLORS[shown][0]}</span></div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {SIM_COLORS.map(([label, bg], i) => (
                  <button key={label} type="button" title={label} aria-label={'Warna sampul ' + label} aria-pressed={!sampulLain && shown === i} onClick={() => pilihSampul(i)} style={swatchStyle(bg, !sampulLain && shown === i)}></button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-heading)', marginBottom: 10 }}>2 · Warna tulisan <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>· {SIM_ACCENTS[accent][0]}</span></div>
              <div style={{ display: 'flex', gap: 10 }}>
                {SIM_ACCENTS.map(([label, bg], i) => (
                  <button key={label} type="button" title={label} aria-label={'Warna tulisan ' + label} aria-pressed={accent === i} onClick={() => { mulai(); setAccent(i); }} style={swatchStyle(bg, accent === i)}></button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-heading)', marginBottom: 10 }}>3 · Nama sekolah / les</div>
              <Input placeholder="cth: SD Ceria Nusantara" aria-label="Nama sekolah atau tempat les" value={nama} onChange={(e) => { mulai(); setNama(e.target.value); }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-heading)', marginBottom: 10 }}>4 · Logo sekolah (opsional)</div>
              <label
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
                  border: '2px dashed var(--af-ink-3)', borderRadius: 'var(--radius-sm)', padding: '14px 16px',
                  fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-body)', background: 'var(--af-paper)',
                }}
              >
                <input type="file" accept="image/*" onChange={onLogo} style={{ display: 'none' }} />
                {logo ? '✓ Logo terpasang — klik untuk ganti' : '⬆ Unggah logo (PNG/JPG)'}
              </label>
            </div>
            {/* Only the product name and counts are shown here: nothing typed lands in the page. */}
            {dari ? (
              <div className="af-sim-konfig">
                <span>Ikut terkirim dari pilihan produk:</span>
                <strong>{dari.name} · {C.ringkasDraft(draft)}</strong>
                <a href={'#custom-' + dari.slug}>Ubah pilihan</a>
              </div>
            ) : (
              <p className="af-sim-hint">
                Sudah tahu modelnya? Atur <a href="#custom-map-jahit">Map Jahit</a> atau <a href="#custom-map-press">Map Press</a> dulu: jumlah dan spesifikasinya ikut terkirim bersama desain ini.
              </p>
            )}
            <Button color="wa" size="lg" data-wa="simulator" {...window.waPribadi(pesanWA)} target="_blank" rel="noopener noreferrer">
              <window.WaGlyph2 /> Pesan Desain Ini via WA
            </Button>
          </div>

          {/* live mockup. Masked for Clarity: it shows the typed school name and the uploaded logo. */}
          <div className="af-sim-preview" data-clarity-mask="true" style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="af-sim-book"
              style={{
                width: 300, height: 410, background: base, border: '2px solid var(--af-ink)',
                borderRadius: '14px 22px 22px 14px', boxShadow: '0 8px 0 var(--af-ink)',
                position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 16, padding: 28, boxSizing: 'border-box',
                transform: 'rotate(1.5deg)', transition: 'background 300ms ease',
              }}
            >
              {/* spine */}
              <div style={{ position: 'absolute', left: 10, top: 10, bottom: 10, width: 5, borderRadius: 4, background: deep, transition: 'background 300ms ease' }}></div>
              {logo ? (
                <img src={logo} alt="Logo sekolah" style={{ width: 84, height: 84, objectFit: 'contain', background: '#fff', borderRadius: 14, border: '2px solid var(--af-ink)', padding: 8, boxSizing: 'border-box' }} />
              ) : (
                <div style={{ width: 84, height: 84, borderRadius: 14, border: '2px dashed rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.75)', fontSize: 11, fontWeight: 700, textAlign: 'center', padding: 6, boxSizing: 'border-box' }}>LOGO<br />SEKOLAH</div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: accentColor, lineHeight: 1.1, transition: 'color 300ms ease' }}>RAPOR</div>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: accentColor, letterSpacing: '0.14em', marginTop: 4, transition: 'color 300ms ease' }}>LAPORAN HASIL BELAJAR</div>
              </div>
              <div style={{ width: 130, height: 2, background: accentColor, opacity: .7, transition: 'background 300ms ease' }}></div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: accentColor, textAlign: 'center', lineHeight: 1.3, transition: 'color 300ms ease', minHeight: 42 }}>{nama || 'Nama Sekolahmu'}</div>
              <div style={{ position: 'absolute', bottom: 16, fontSize: 9, fontWeight: 700, color: accentColor, opacity: .75, letterSpacing: '0.1em' }}>DIPRODUKSI OLEH AGATHA FELIX</div>
            </div>
          </div>
        </div>
      </div>
      <window.Wave fill="var(--af-paper)" />
    </section>
  );
}

Object.assign(window, { SimulatorRapor, AfSimulator: { pesanSimulator } });
