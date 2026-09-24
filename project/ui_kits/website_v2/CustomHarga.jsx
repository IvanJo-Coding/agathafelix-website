// =============================================================================
//  HARGA PRODUK CUSTOM  (halaman Custom & Rapor)
// -----------------------------------------------------------------------------
//  Cara mengisi:
//  - Tulis angka Rupiah per pcs TANPA titik: 48000, bukan 48.000.
//  - null = belum ada harga. Selama masih null, website TIDAK menampilkan angka
//    dan menulis "Harga dikirim di penawaran".
//
//  dasar        Harga per pcs untuk spesifikasi dasar, per ukuran (Zipper Bag:
//               per tipe) dan per jumlah pesanan. 50 = 50–99 pcs, 100 = 100–299,
//               300 = 300–499, 500 = 500 pcs ke atas.
//  tambahan     Tambahan per pcs untuk setiap pilihan. 0 = sudah termasuk harga
//               dasar. Boleh negatif kalau pilihan itu lebih murah (misalnya
//               tanpa busa). Nama pilihannya sama persis dengan di website.
//  sekaliBayar  Biaya sekali per pesanan (misalnya klise/plat poly). Hapus atau
//               biarkan null kalau tidak ada.
//
//  Perkiraan harga baru muncul di website kalau SEMUA angka untuk pilihan yang
//  dipilih pengunjung sudah terisi. Pilihan "Ukuran lain", "Jumlah lain",
//  "Warna lain" dan "Rekomendasikan untuk saya" selalu lewat penawaran manual.
//  Warna sampul dan warna benang tidak mengubah harga.
// =============================================================================

const TINGKAT = () => ({ 50: null, 100: null, 300: null, 500: null });

const HARGA_CUSTOM = {
  'map-jahit': {
    dasar: { a4: TINGKAT(), f4: TINGKAT() },
    tambahan: {
      bahan: { 'tpk-urat': null, 'tpk-pasir': null },
      poly: { emas: null, silver: null, 'biru-tua': null, putih: null, hitam: null, merah: null, 'rose-gold': null, hologram: null },
      siku: { tanpa: 0, 'emas-rounded': null, 'emas-lancip': null, 'silver-rounded': null, 'silver-lancip': null },
      'inner-tipe': { mika: null, 'pp-bening': null },
      'inner-jumlah': { 20: null, 40: null, 60: null, 80: null, 100: null, 120: null },
      punggung: { press: 0, ring: null },
      jendela: { tanpa: 0, pakai: null },
      kantong: { tanpa: 0, pakai: null },
      karton: { k15: null, k2: null, k25: null, k3: null },
      busa: { tanpa: null, b2: null, b3: null, b5: null },
    },
    sekaliBayar: { klise: null },
  },

  'map-press': {
    dasar: { a4: TINGKAT(), f4: TINGKAT() },
    tambahan: {
      bahan: { 'tpk-urat': null, 'tpk-pasir': null, linen: null },
      poly: { emas: null, silver: null, 'biru-tua': null, putih: null, hitam: null, merah: null, 'rose-gold': null, hologram: null },
      siku: { tanpa: 0, 'emas-rounded': null, 'emas-lancip': null, 'silver-rounded': null, 'silver-lancip': null },
      'inner-tipe': { mika: null, 'pp-bening': null },
      'inner-jumlah': { 20: null, 40: null, 60: null, 80: null, 100: null, 120: null },
      punggung: { press: 0, ring: null },
      jendela: { tanpa: 0, pakai: null },
      kantong: { tanpa: 0, pakai: null },
      karton: { k15: null, k2: null, k25: null, k3: null },
      busa: { tanpa: null, b2: null, b3: null, b5: null },
    },
    sekaliBayar: { klise: null },
  },

  'map-executive': {
    dasar: { a4: TINGKAT(), f4: TINGKAT() },
    tambahan: {
      bahan: { 'tpk-urat': null, 'tpk-pasir': null },
      poly: { emas: null, silver: null, 'biru-tua': null, putih: null, hitam: null, merah: null, 'rose-gold': null, hologram: null },
      resleting: { nilon: null, plastik: null, logam: null, premium: null },
      siku: { tanpa: 0, 'emas-rounded': null, 'emas-lancip': null, 'silver-rounded': null, 'silver-lancip': null },
      'inner-tipe': { mika: null, 'pp-bening': null },
      'inner-jumlah': { 20: null, 40: null, 60: null, 80: null, 100: null, 120: null },
      punggung: { press: 0, ring: null },
      jendela: { tanpa: 0, pakai: null },
      kantong: { tanpa: 0, pakai: null },
      karton: { k15: null, k2: null, k25: null, k3: null },
      busa: { tanpa: null, b2: null, b3: null, b5: null },
    },
    sekaliBayar: { klise: null },
  },

  'clear-holder-poly': {
    dasar: { a4: TINGKAT(), f4: TINGKAT() },
    tambahan: {
      poly: { emas: null, silver: null, 'biru-tua': null, putih: null, hitam: null, merah: null, 'rose-gold': null, hologram: null },
      'inner-tipe': { mika: null, 'pp-bening': null },
      'inner-jumlah': { 20: null, 40: null, 60: null, 80: null, 100: null, 120: null },
      jendela: { tanpa: 0, pakai: null },
    },
    sekaliBayar: { klise: null },
  },

  'clear-holder-print': {
    dasar: { a4: TINGKAT(), f4: TINGKAT() },
    tambahan: {
      'inner-tipe': { mika: null, 'pp-bening': null },
      'inner-jumlah': { 20: null, 40: null, 60: null, 80: null, 100: null, 120: null },
      jendela: { tanpa: 0, pakai: null },
    },
    sekaliBayar: {},
  },

  'zipper-bag-print': {
    // Harga dasar per tipe zipper bag (sudah termasuk tas polosnya).
    dasar: {
      'setengah-jaring': TINGKAT(), 'tali-f4': TINGKAT(), 'tali-a5': TINGKAT(), namecard: TINGKAT(), polos: TINGKAT(),
    },
    tambahan: {
      metode: { sablon: null, dtf: null, uv: null },
      sisi: { depan: null, belakang: null, samping: null },
      'warna-cetak': { full: null, w1: null, w2: null, w3: null },
      jendela: { tanpa: 0, pakai: null },
    },
    sekaliBayar: {},
  },
};

Object.assign(window, { HARGA_CUSTOM });
