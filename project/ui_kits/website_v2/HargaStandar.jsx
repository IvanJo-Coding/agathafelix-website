// =============================================================================
//  HARGA PRODUK STANDAR  (halaman Produk Standar)
// -----------------------------------------------------------------------------
//  Sumber: Patokan Harga Shopee Agatha Felix, 9 Oktober 2026, kolom "Harga
//  baru". Business File, Map Kancing/Tali dan Map L pakai harga paket 12 pcs.
//  Barang yang tidak ada di patokan dihitung dengan rumusnya (tanda "rumus"):
//    (harga offline + 1.250) ÷ 0,755, dibulatkan ke atas ke Rp500
//    (Rp100 untuk harga di bawah 10.000).
//
//  Cara mengubah:
//  - Tulis angka Rupiah TANPA titik: 15250, bukan 15.250. null = tidak ada (–).
//  - Ganti `update` setiap kali harga diubah.
//  - Harga sudah final; halaman tidak menulis catatan PPN.
//
//  tipe  Menghubungkan tipe di katalog (slug di ProdukStandarSections.jsx) ke
//        baris harga di bawah. 'ch:folio' = kolom Folio di tabel Clear Holder;
//        selain itu daftar id barang. Tipe tanpa harga tetap "tanya harga".
// =============================================================================

const CARRY_FILE = ['cf-1', 'cf-2', 'cf-3', 'cf-4', 'cf-5'];

const HARGA_STANDAR = {
  update: '9 Oktober 2026',

  // Clear Holder: harga per pcs menurut ukuran dan isi kantong.
  // Executive 80 dan 100 lbr (stok 0) sengaja tidak ditampilkan.
  clearHolder: {
    ukuran: [['b5', 'B5'], ['a4', 'A4'], ['folio', 'Folio'], ['a3', 'A3'], ['executive', 'Executive']],
    isi: [
      //    B5     A4     Folio  A3      Executive
      [10, [20000, 22000, 22500, 61500, 81500]],    // B5–A3 rumus
      [20, [20500, 22500, 23000, 74500, 94500]],
      [40, [28500, 32500, 33500, 88000, 118000]],
      [60, [35000, 39000, 41500, 101000, 147500]],
      [80, [50000, 58000, 61500, null, null]],
      [100, [null, 78000, 81500, null, null]],
      [120, [null, 94500, 101000, null, null]],
    ],
  },

  // Barang lain: [id, nama, kode, ukuran, harga]. kode null = tanpa kode.
  daftar: [
    { judul: 'Map & Business File', satuan: 'lusin', barang: [
      ['bf-felix', 'Business File Felix', 'BF 940 F/C', 'F4 / A4', 48000],
      ['bf-nemo', 'Business File Nemo', 'BN 940 F', 'Folio', 35000],
      ['ml-tipis', 'Map L Tipis Felix', '101', 'F4 / A4', 22000],
      ['ml-tebal', 'Map L Tebal Felix', '101', 'F4 / A4', 25500],
      ['mk-tipis', 'Map Kancing / Tali Tipis', '013 Felix 103 / 102', 'Folio', 35000],
      ['mk-tebal', 'Map Kancing / Tali Tebal', '017 Felix 103 / 102', 'Folio', 55000],
      ['map-snell', 'Map Snell', null, 'Folio', 108000],              // rumus
      ['map-jepit', 'Map Jepit', null, 'Folio', 110500],              // rumus
    ] },
    { judul: 'Zipper, Carry File & PP Pocket', satuan: 'pcs', barang: [
      ['zb-01', 'Zipper Biasa', 'ZB 01', 'Folio', 18500],
      ['zj-02', 'Zipper Jaring 1/2', 'ZJ 02', 'Folio', 22000],
      ['zt-03-folio', 'Zipper Jaring 1/2 + Tali 2', 'ZT 03', 'Folio', 22500],
      ['zt-03-a5', 'Zipper Jaring 1/2 + Tali 2', 'ZT 03', 'A5', 16500], // rumus
      ['sb-04', 'Zipper Kancing + Name Card', 'SB 04', 'Folio', 23500],
      ['zch-20', 'Zipper CH 20', 'ZCH 20', 'Folio', 41500],            // rumus
      ['zch-40', 'Zipper CH 40', 'ZCH 40', 'Folio', 47500],            // rumus
      ['zch-60', 'Zipper CH 60', 'ZCH 60', 'Folio', 55000],            // rumus
      ['cf-1', 'Carry File 1 cm', '8810', 'Folio', 23000],             // rumus
      ['cf-2', 'Carry File 2 cm', '8820', 'Folio', 25000],
      ['cf-3', 'Carry File 3 cm', '8830', 'Folio', 27000],
      ['cf-4', 'Carry File 4 cm', '8840', 'Folio', 35000],
      ['cf-5', 'Carry File 5 cm', '8850', 'Folio', 39500],             // rumus
      ['pp-pocket-a4', 'PP Pocket', '5110', 'A4', 2800],               // rumus
      ['pp-pocket-folio', 'PP Pocket', '5111', 'Folio', 2800],         // rumus
    ] },
  ],

  tipe: {
    'clear-holder-folio': 'ch:folio',
    'clear-holder-a4': 'ch:a4',
    'clear-holder-a3': 'ch:a3',
    'clear-holder-a5': 'ch:b5',            // dijual sebagai A5, sampulnya ukuran B5
    'dokumen-keeper': 'ch:executive',
    'business-file-a4': ['bf-felix'],
    'business-file-folio': ['bf-felix', 'bf-nemo'],
    'map-kancing-tipis': ['mk-tipis'],
    'map-kancing-tebal': ['mk-tebal'],
    'map-tali': ['mk-tebal'],              // tebal 0,18 cm
    'clear-sleeves-a4': ['ml-tipis', 'ml-tebal'],
    'clear-sleeves-folio': ['ml-tipis', 'ml-tebal'],
    'zipper-bag-polos': ['zb-01'],
    'zipper-bag-setengah-jaring': ['zj-02'],
    'zipper-bag-tali-f4': ['zt-03-folio'],
    'zipper-bag-tali-a5': ['zt-03-a5'],
    'zipper-bag-namecard': ['sb-04'],
    'carry-file-capslock': CARRY_FILE,
    'carry-file-kancing': CARRY_FILE,
  },
};

Object.assign(window, { HARGA_STANDAR });
