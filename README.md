# 💊 Sistem Manajemen Apotek "Sehat Selalu"

Aplikasi web manajemen apotek modular: HTML + JavaScript (ES Modules) + Google Cloud Firestore (real-time).
Satu halaman per menu, logika bisnis terpusat di `js/calculator.js`, dengan Role-Based Access Control 4 level.

## 📁 Struktur Berkas

```javascript
apotek/
├── login.html          # Login + first-run (buat akun Developer pertama)
├── index.html          # Dasbor: omzet, grafik, stok menipis, kedaluwarsa
├── pos.html            # Kasir/POS: cari obat, keranjang, resep, struk
├── inventory.html      # Inventaris & stok opname (harga jual auto, batch, exp)
├── stockcard.html      # KARTU STOK OBAT — mutasi masuk/keluar + saldo berjalan (bisa dicetak)
├── patients.html       # Data pasien, resep dokter, riwayat pembelian
├── reports.html        # Laporan keuangan: omzet, laba-rugi, rekap harian
├── suppliers.html      # Pemasok + pencatatan pembelian stok (PO)
├── settings.html       # Profil apotek (global), PPN, margin, struk, manajemen user
├── css/style.css       # Layout responsif Flexbox/Grid (mobile, tablet, desktop)
└── js/
    ├── firebase-config.js  # Konfigurasi Firebase (WAJIB diganti)
    ├── calculator.js       # SELURUH rumus bisnis (harga jual, diskon, PPN, opname, dosis)
    ├── db.js               # Helper Firestore: CRUD, realtime, nomor transaksi
    └── auth.js             # Login, session, RBAC, render menu per role
```

## 🚀 Cara Menjalankan

1. Buat project di [Firebase Console](https://console.firebase.google.com) → buat **Firestore Database** (mode production).
2. Firebase Console → Project Settings → Web App → salin config ke `js/firebase-config.js`.
3. Jalankan lewat server statis (module JS tidak jalan via `file://`):

- `npx serve apotek` atau `firebase deploy` (Firebase Hosting), atau VS Code Live Server.

4. Buka `login.html` → karena database masih kosong, akan muncul **mode first-run**:
buat akun Developer pertama (email: `developer@apotek.id`).
5. Login sebagai Developer → buka **Pengaturan Sistem** → isi profil apotek (PPN, margin, footer struk)
→ tambahkan pengguna Owner/Admin/Staff.
6. Isi data: Pemasok → Inventaris (obat) → stok masuk via Pembelian → transaksi via POS.

## 🗄️ Koleksi Firestore

| Koleksi | Isi |
| --- | --- |
| `users` | nama, email, password (SHA-256), role, aktif |
| `obat` | kode, nama, kategori, satuan, hpp, marginPersen, hargaJual, stok, minStok, batch, expDate, supplierId |
| `transaksi` | noTransaksi, tipe (`penjualan`/`pembelian`), tanggal, items[], subtotal, diskon, ppn, total, bayar, kembalian, pasienId, dokter, userId |
| `kartuStok` | obatId, tanggal, jenis, masuk, keluar, **saldo**, referensi, keterangan, userId |
| `pasien` | nama, tanggalLahir, jk, telepon, alamat, alergi |
| `resep` | pasienId, obatNama, qty, dosis, frekuensi, dokter, catatan, tanggal |
| `suppliers` | nama, kontak, telepon, email, alamat |
| `settings/profil` | namaApotek, alamat, telepon, ppnPersen, marginDefault, footerStruk (dipakai semua menu) |
| `settings/counters` | penomoran otomatis TRX & PO |

## 🔐 Role & Hak Akses

| Role | Akses |
| --- | --- |
| **Developer** | Semua menu + manajemen pengguna |
| **Owner** | Semua menu kecuali manajemen pengguna |
| **Admin** | Dasbor, POS, Inventaris & Opname, Kartu Stok, Pasien, Laporan, Pemasok |
| **Staff/Kasir** | Dasbor, POS, Pasien & Resep, Kartu Stok (lihat) |

## 🧾 Kartu Stok Obat

"Lembar mutasi" tiap obat: setiap masuk/keluar tercatat dengan saldo berjalan, referensi nota/PO,
dan petugas — jejak audit opname, pelacakan batch/kedaluwarsa, investigasi selisih stok,
dan dokumen pendukung administrasi/BPOM. Terisi otomatis dari POS, pembelian, dan opname.
Bisa difilter tanggal & dicetak (`stockcard.html`).

## ⚠️ Catatan Keamanan (Production)

- Password disimpan sebagai hash SHA-256 di collection `users` — untuk produksi,
**tambahkan Firebase Authentication** dan Firestore Security Rules, contoh awal:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{doc=**} {
      allow read, write: if request.time < timestamp.date(2026, 12, 31); // TODO: batasi per role
    }
  }
}
```

## 🧮 Rumus di calculator.js

- `hitungHargaJual(hpp, margin%, ppn%)` = HPP × (1+margin) × (1+PPN)
- `hitungTotalTransaksi(items, {diskon, ppn})` → subtotal, diskon, PPN, total
- `hitungSelisihOpname(stokSistem, stokFisik)`, `hitungNilaiPersediaan(stok, hpp)`
- `statusStok`, `statusKedaluwarsa`, `hitungDosisPerHari`, `hitungDurasiHabis`, dll.
