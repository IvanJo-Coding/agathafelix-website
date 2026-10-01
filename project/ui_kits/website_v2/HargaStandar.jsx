// =============================================================================
//  HARGA PRODUK STANDAR  (halaman Produk Standar)
// -----------------------------------------------------------------------------
//  Sumber: Daftar Harga Agatha Felix, update 24 September 2026, 15:13 WIB.
//
//  Cara mengubah:
//  - Tulis angka Rupiah TANPA titik: 15250, bukan 15.250. null = tidak ada (–).
//  - Ganti `update` setiap kali harga diubah.
//  - Semua harga belum termasuk PPN.
//
//  tipe  Menghubungkan tipe di katalog (slug di ProdukStandarSections.jsx) ke
//        baris harga di bawah. 'ch:folio' = kolom Folio di tabel Clear Holder;
//        selain itu daftar id barang. Tipe tanpa harga tetap "tanya harga".
// =============================================================================

const CARRY_FILE = ['cf-1', 'cf-2', 'cf-3', 'cf-4', 'cf-5'];

const HARGA_STANDAR = {
  update: '24 September 2026',

  // Clear Holder: harga per pcs menurut ukuran dan isi kantong.
  clearHolder: {
    ukuran: [['b5', 'B5'], ['a4', 'A4'], ['folio', 'Folio'], ['a3', 'A3'], ['executive', 'Executive']],
    isi: [
      //    B5     A4     Folio  A3     Executive
      [10, [13500, 15250, 15500, 45000, 65000]],
      [20, [14000, 15500, 16000, 55000, 75000]],
      [40, [20000, 23000, 24000, 60000, 95000]],
      [60, [25000, 28000, 30000, 75000, 120000]],
      [80, [null, 42500, 45000, null, null]],
      [100, [null, 57500, 60000, null, null]],
      [120, [null, 70000, 75000, null, null]],
    ],
  },

  // Barang lain: [id, nama, kode, ukuran, harga]. kode null = tanpa kode.
  daftar: [
    { judul: 'Map & Business File', satuan: 'lusin', barang: [
      ['bf-felix', 'Business File Felix', 'BF 940 F/C', 'F4 / A4', 35000],
      ['bf-nemo', 'Business File Nemo', 'BN 940 F', 'Folio', 25000],
      ['ml-tipis', 'Map L Tipis Felix', '101', 'F4 / A4', 15000],
      ['ml-tebal', 'Map L Tebal Felix', '101', 'F4 / A4', 18000],
      ['mk-tipis', 'Map Kancing / Tali Tipis', '013 Felix 103 / 102', 'Folio', 25000],
      ['mk-tebal', 'Map Kancing / Tali Tebal', '017 Felix 103 / 102', 'Folio', 40000],
      ['map-snell', 'Map Snell', null, 'Folio', 80000],
      ['map-jepit', 'Map Jepit', null, 'Folio', 82000],
    ] },
    { judul: 'Zipper, Carry File & PP Pocket', satuan: 'pcs', barang: [
      ['zb-01', 'Zipper Biasa', 'ZB 01', 'Folio', 11000],
      ['zj-02', 'Zipper Jaring 1/2', 'ZJ 02', 'Folio', 14000],
      ['zt-03-folio', 'Zipper Jaring 1/2 + Tali 2', 'ZT 03', 'Folio', 15000],
      ['zt-03-a5', 'Zipper Jaring 1/2 + Tali 2', 'ZT 03', 'A5', 11000],
      ['sb-04', 'Zipper Kancing + Name Card', 'SB 04', 'Folio', 15000],
      ['zch-20', 'Zipper CH 20', 'ZCH 20', 'Folio', 30000],
      ['zch-40', 'Zipper CH 40', 'ZCH 40', 'Folio', 34500],
      ['zch-60', 'Zipper CH 60', 'ZCH 60', 'Folio', 40000],
      ['cf-1', 'Carry File 1 cm', '8810', 'Folio', 16000],
      ['cf-2', 'Carry File 2 cm', '8820', 'Folio', 17500],
      ['cf-3', 'Carry File 3 cm', '8830', 'Folio', 19000],
      ['cf-4', 'Carry File 4 cm', '8840', 'Folio', 25000],
      ['cf-5', 'Carry File 5 cm', '8850', 'Folio', 28500],
      ['pp-pocket-a4', 'PP Pocket', '5110', 'A4', 800],
      ['pp-pocket-folio', 'PP Pocket', '5111', 'Folio', 850],
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
