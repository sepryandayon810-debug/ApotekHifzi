/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Domain Entities & Types for Apotek Hifzi Farma
 */

export type GolonganObat = 'Bebas' | 'Bebas Terbatas' | 'Keras (G)' | 'Narkotika' | 'Psikotropika' | 'Herbal / Jamu' | 'Alkes';

export type UserRole = 'Administrator' | 'Apoteker' | 'Kasir' | 'Gudang' | 'Developer';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  password?: string;
  sipaStra?: string;
  avatarLetter: string;
  isActive: boolean;
}

export interface BatchItem {
  id: string;
  batchNumber: string;
  expiredDate: string; // YYYY-MM-DD
  stock: number;
  initialStock: number;
  buyPrice: number; // HPP per satuan
  supplierId: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  genericName?: string;
  category: string; // e.g. "Antibiotik", "Analgesik", "Vitamin"
  unit: string; // e.g. "Strip", "Botol", "Tablet", "Box", "Ampul"
  golongan: GolonganObat;
  lokasiRak: string;
  minStock: number; // Safety stock threshold for Defecta
  buyPrice: number; // HPP rata-rata
  sellPrice: number; // Harga jual umum
  prescriptionSellPrice?: number; // Harga jual jika via resep dokter (bisa disesuaikan rule)
  marginPercent: number; // Margin %
  batches: BatchItem[];
  requiresPrescription: boolean;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  leadTimeDays: number;
  paymentTermDays: number;
  licenseNumber: string; // Izin PBF
}

export interface Doctor {
  id: string;
  name: string;
  sipNumber: string;
  specialty: string;
  clinicOrHospital: string;
  phone: string;
}

export interface ServiceFee {
  id: string;
  name: string; // e.g. "Tuslah Resep Non-Racik", "Tuslah Resep Racik", "Embalase Plastik Klip", "Embalase Pot Salep"
  type: 'tuslah' | 'embalase' | 'racik';
  fee: number;
  isActive: boolean;
}

export interface Member {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  points: number;
  tier: 'Reguler' | 'Silver' | 'Gold' | 'VIP';
  discountPercent: number;
  allergies?: string;
}

export interface Promo {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Shift {
  id: string;
  cashierName: string;
  cashierId: string;
  startTime: string;
  endTime?: string;
  startingCash: number; // Modal awal kasir
  closingCashCalculated: number; // Dihitung sistem: Modal + Penjualan Tunai - Kas Keluar
  closingCashActual?: number; // Dihitung fisik oleh kasir
  difference?: number; // Selisih (Actual - Calculated)
  status: 'OPEN' | 'CLOSED';
  notes?: string;
}

export interface CartItem {
  product: Product;
  batch: BatchItem;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  subtotal: number;
  isPrescriptionItem?: boolean;
}

export interface PrescriptionDetails {
  prescriptionNumber: string;
  doctorName: string;
  patientName: string;
  patientAge?: string;
  tuslahFee: number;
  embalaseFee: number;
  notes?: string;
}

export interface SaleTransaction {
  id: string;
  invoiceNumber: string;
  date: string;
  cashierName: string;
  shiftId: string;
  memberId?: string;
  memberName?: string;
  items: CartItem[];
  prescription?: PrescriptionDetails;
  subtotal: number;
  discountTotal: number;
  taxAmount: number; // PPN terpusat
  tuslahTotal: number;
  embalaseTotal: number;
  roundingAmount: number; // Pembulatan kasir terpusat
  grandTotal: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer Bank' | 'Kartu Debit';
  amountPaid: number;
  change: number;
  status: 'PAID' | 'VOID' | 'REFUNDED';
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  dueDate: string;
  items: {
    productId: string;
    productName: string;
    batchNumber: string;
    expiredDate: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    subtotal: number;
  }[];
  totalAmount: number;
  status: 'Diterima' | 'Lunas' | 'Hutang';
}

export interface CashTransaction {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  category: 'Operasional' | 'Modal Kasir' | 'Setor Bank' | 'Pembelian Tunai' | 'Lain-lain';
  amount: number;
  description: string;
  account: string; // e.g. "Kas Kasir", "Bank BCA", "Kas Kecil"
  recordedBy: string;
}

export interface StockOpnameRecord {
  id: string;
  date: string;
  productId: string;
  productName: string;
  batchNumber: string;
  systemStock: number;
  physicalStock: number;
  difference: number;
  hpp: number;
  lossValue: number;
  auditor: string;
  notes: string;
}

export interface ChartOfAccount {
  code: string;
  name: string;
  type: 'Aktiva' | 'Kewajiban' | 'Modal' | 'Pendapatan' | 'Beban';
  balance: number;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  pharmacistInCharge: string; // Apoteker Pengelola Apotek (APA)
  sipaNumber: string;
  isActive: boolean;
}

/**
 * Aturan Bisnis & Konfigurasi Terpusat (Central Rules Configuration)
 * Semua perhitungan dan validasi bergantung pada konfigurasi ini.
 */
export interface CentralRulesConfig {
  ppnPercent: number; // Default PPN 11%
  enableRounding: boolean; // Pembulatan kasir
  roundingStep: number; // Misal dibulatkan ke kelipatan Rp 100
  nearExpiryThresholdDays: number; // Misal 90 hari untuk peringatan FEFO
  defaultMarginOtc: number; // Default margin obat bebas, misal 20%
  defaultMarginKeras: number; // Default margin obat keras, misal 25%
  defaultMarginResep: number; // Default margin obat resep, misal 30%
  tuslahResepStandard: number; // Tarif tuslah standar per resep, misal Rp 3.000
  embalaseStandard: number; // Tarif embalase wadah, misal Rp 2.000
  maxDiscountWithoutSupervisor: number; // Diskon maks tanpa spv, misal 10%
  enforceFefoSelection: boolean; // Jika true, kasir dipandu batch paling dekat kadaluwarsa
}

export type ThemeColorPalette = 'emerald' | 'teal' | 'green' | 'blue' | 'slate';
export type TextScale = 'compact' | 'standard' | 'large';

/**
 * Pengaturan Terpusat Aplikasi Apotek (Identitas, Print Struk, Warna & Tampilan)
 */
export interface AppSettings {
  // Identitas Apotek
  pharmacyName: string;
  tagline: string;
  siaNumber: string;
  pharmacistInCharge: string;
  sipaNumber: string;
  address: string;
  phone: string;
  email: string;
  logoInitial: string;

  // Pengaturan Print Kasir Thermal
  printerPaperWidth: '58mm' | '80mm';
  printHeader: string;
  printFooter: string;
  showPharmacistOnReceipt: boolean;
  showDoctorOnReceipt: boolean;
  autoCutReceipt: boolean;
  openCashDrawer: boolean;

  // Pengaturan Warna & Tampilan
  themeColor: ThemeColorPalette;
  textScale: TextScale;
  fontFamily: 'Plus Jakarta Sans' | 'System Sans' | 'JetBrains Mono';
}

