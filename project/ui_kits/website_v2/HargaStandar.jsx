// =============================================================================
//  HARGA MULAI PRODUK STANDAR  (halaman Produk Standar)
// -----------------------------------------------------------------------------
//  Halaman hanya menampilkan satu harga "Mulai" per tipe (pemilik, 24 November
//  2026); harga per jumlah, ukuran, dan warna dikirim lewat WhatsApp.
//  File ini ikut terkirim ke browser pengunjung dan repo-nya publik, jadi isinya
//  HANYA harga mulai: jangan tambahkan daftar harga lengkap, harga offline,
//  atau rumus harga di sini.
//
//  Cara mengubah:
//  - Kunci = slug tipe di ProdukStandarSections.jsx (tipe('...')).
//  - [harga, satuan]: Rupiah TANPA titik (22500, bukan 22.500); 'pcs' atau 'lusin'.
//  - Harga mulai = harga termurah tipe itu (isi paling sedikit / ukuran terkecil).
//  - Ganti `update` setiap kali harga diubah.
//  - Tipe yang tidak tercantum tampil "Tanya harga".
// =============================================================================

const HARGA_STANDAR = {
  update: '9 Oktober 2026',

  mulai: {
    'clear-holder-folio': [22500, 'pcs'],
    'clear-holder-a4': [22000, 'pcs'],
    'clear-holder-a3': [61500, 'pcs'],
    'clear-holder-a5': [20000, 'pcs'],
    'dokumen-keeper': [81500, 'pcs'],
    'business-file-a4': [48000, 'lusin'],
    'business-file-folio': [35000, 'lusin'],
    'map-kancing-tipis': [35000, 'lusin'],
    'map-kancing-tebal': [55000, 'lusin'],
    'map-tali': [55000, 'lusin'],
    'clear-sleeves-a4': [22000, 'lusin'],
    'clear-sleeves-folio': [22000, 'lusin'],
    'zipper-bag-polos': [18500, 'pcs'],
    'zipper-bag-setengah-jaring': [22000, 'pcs'],
    'zipper-bag-tali-f4': [22500, 'pcs'],
    'zipper-bag-tali-a5': [16500, 'pcs'],
    'zipper-bag-namecard': [23500, 'pcs'],
    'carry-file-capslock': [23000, 'pcs'],
    'carry-file-kancing': [23000, 'pcs'],
  },
};

Object.assign(window, { HARGA_STANDAR });
