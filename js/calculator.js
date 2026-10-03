// ============================================================
// calculator.js — SELURUH rumus & aturan bisnis Apotek (PURE LOGIC)
// Tidak ada DOM, tidak ada Firestore di file ini.
// Dipakai oleh semua halaman: POS, Inventaris, Opname, Laporan, dll.
// ============================================================

export const PPN_DEFAULT = 11; // % PPN (dapat dioverride lewat Pengaturan)

export const toNumber = (v) => {
  const n = parseFloat(String(v ?? '').replace(/[^\d.-]/g, ''));
  return isNaN(n) ? 0 : n;
};

export function formatRupiah(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(toNumber(n));
}

// ---- HARGA JUAL ----
// Harga jual = HPP + margin%, lalu + PPN%
export function hitungHargaJual(hpp, marginPersen, ppnPersen = PPN_DEFAULT) {
  const dasar = toNumber(hpp) * (1 + toNumber(marginPersen) / 100);
  return Math.round(dasar * (1 + toNumber(ppnPersen) / 100));
}

export function hitungMargin(hpp, hargaJual) {
  if (!toNumber(hpp)) return 0;
  return +(((toNumber(hargaJual) - toNumber(hpp)) / toNumber(hpp)) * 100).toFixed(2);
}

// ---- DISKON & PAJAK ----
export function hitungDiskon(nominal, persen) {
  return Math.round(toNumber(nominal) * toNumber(persen) / 100);
}

export function hitungPajak(nominalDasar, ppnPersen = PPN_DEFAULT) {
  return Math.round(toNumber(nominalDasar) * toNumber(ppnPersen) / 100);
}

// ---- TRANSAKSI / KERANJANG ----
export function hitungTotalTransaksi(items, { diskonPersen = 0, ppnPersen = PPN_DEFAULT } = {}) {
  const subtotal = items.reduce((s, it) => s + toNumber(it.harga) * toNumber(it.qty), 0);
  const diskon = hitungDiskon(subtotal, diskonPersen);
  const dpp = subtotal - diskon;
  const ppn = hitungPajak(dpp, ppnPersen);
  return { subtotal, diskon, ppn, total: dpp + ppn };
}

export function hitungKembalian(bayar, total) {
  return toNumber(bayar) - toNumber(total);
}

export function hitungHppItem(obat, qty) {
  return toNumber(obat.hpp) * toNumber(qty);
}

export function hitungLabaKotor(omzetTanpaPpn, totalHpp) {
  return toNumber(omzetTanpaPpn) - toNumber(totalHpp);
}

// ---- STOK & OPNAME ----
export function hitungSelisihOpname(stokSistem, stokFisik) {
  return toNumber(stokFisik) - toNumber(stokSistem);
}

export function hitungNilaiPersediaan(stok, hpp) {
  return toNumber(stok) * toNumber(hpp);
}

export function hitungStokBaru(stokSekarang, perubahan) {
  return toNumber(stokSekarang) + toNumber(perubahan);
}

export function statusStok(stok, minStok) {
  stok = toNumber(stok); minStok = toNumber(minStok);
  if (stok <= 0) return { kode: 'habis', label: 'Habis', kelas: 'danger' };
  if (stok <= minStok) return { kode: 'menipis', label: 'Menipis', kelas: 'warning' };
  return { kode: 'aman', label: 'Aman', kelas: 'success' };
}

// ---- KEDALUWARSA ----
export function hariMenujuKedaluwarsa(expDate) {
  if (!expDate) return null;
  return Math.ceil((new Date(expDate) - new Date()) / 86400000);
}

export function statusKedaluwarsa(expDate) {
  const h = hariMenujuKedaluwarsa(expDate);
  if (h === null) return { kode: '-', label: '—', kelas: '' };
  if (h < 0) return { kode: 'expired', label: `Kedaluwarsa ${Math.abs(h)} hr`, kelas: 'danger' };
  if (h <= 30) return { kode: 'dekat', label: `${h} hr lagi`, kelas: 'warning' };
  return { kode: 'aman', label: 'Aman', kelas: 'success' };
}

// ---- RESEP ----
export function hitungDosisPerHari(dosis, frekuensi) {
  return toNumber(dosis) * toNumber(frekuensi);
}

export function hitungDurasiHabis(totalQty, dosisPerHari) {
  return dosisPerHari > 0 ? Math.ceil(toNumber(totalQty) / dosisPerHari) : 0;
}
