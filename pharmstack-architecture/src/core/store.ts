/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Centralized Store & Repository Layer (Single Source of Truth)
 * 
 * Pengambilan dan manipulasi data terpusat (tidak boleh hardcode di masing-masing view/page).
 * View hanya memanggil method/getter dari store ini.
 */

import {
  AppSettings,
  AppUser,
  Branch,
  CartItem,
  CashTransaction,
  CentralRulesConfig,
  ChartOfAccount,
  Doctor,
  Member,
  PrescriptionDetails,
  Product,
  Promo,
  PurchaseInvoice,
  SaleTransaction,
  ServiceFee,
  Shift,
  StockOpnameRecord,
  Supplier,
  UserRole,
} from '../types/pharmacy';
import { DEFAULT_CENTRAL_RULES, PharmacyRules } from './business-rules';
import { PharmacyCalculator } from './calculator';

// Initial Seed Users for RBAC Authentication
const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-admin',
    name: 'Sepryanda Yon',
    username: 'admin',
    password: 'admin123',
    email: 'admin@hifzifarma.com',
    role: 'Administrator',
    avatarLetter: 'S',
    isActive: true,
  },
  {
    id: 'usr-apoteker',
    name: 'apt. Siti Rahmawati, S.Farm',
    username: 'apoteker',
    password: 'apt123',
    email: 'siti.farmasi@hifzifarma.com',
    role: 'Apoteker',
    sipaStra: 'SIPA/19930412/2024/098',
    avatarLetter: 'R',
    isActive: true,
  },
  {
    id: 'usr-kasir',
    name: 'Budi Santoso',
    username: 'kasir',
    password: 'kasir123',
    email: 'budi.kasir@hifzifarma.com',
    role: 'Kasir',
    avatarLetter: 'B',
    isActive: true,
  },
  {
    id: 'usr-gudang',
    name: 'Ahmad Faisal',
    username: 'gudang',
    password: 'gudang123',
    email: 'faisal.logistik@hifzifarma.com',
    role: 'Gudang',
    avatarLetter: 'F',
    isActive: true,
  },
  {
    id: 'usr-dev',
    name: 'Developer (Super Admin / Engineering)',
    username: 'dev',
    password: 'dev123',
    email: 'developer@hifzifarma.com',
    role: 'Developer',
    avatarLetter: 'D',
    isActive: true,
  },
];

// Initial Seed Data Apotek Hifzi Farma
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'OBAT-001',
    name: 'Paracetamol 500 mg',
    genericName: 'Paracetamol',
    category: 'Analgesik & Antipiretik',
    unit: 'Strip',
    golongan: 'Bebas',
    lokasiRak: 'Rak A-01',
    minStock: 10,
    buyPrice: 4000,
    sellPrice: 6000,
    marginPercent: 50,
    requiresPrescription: false,
    isActive: true,
    batches: [
      {
        id: 'b-001',
        batchNumber: 'PCT-2401',
        expiredDate: '2026-12-31',
        stock: 35,
        initialStock: 50,
        buyPrice: 4000,
        supplierId: 'sup-001',
      },
      {
        id: 'b-002',
        batchNumber: 'PCT-2402',
        expiredDate: '2027-06-30',
        stock: 50,
        initialStock: 50,
        buyPrice: 4200,
        supplierId: 'sup-001',
      },
    ],
  },
  {
    id: 'prod-002',
    sku: 'OBAT-002',
    name: 'Amoxicillin 500 mg',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotik',
    unit: 'Strip',
    golongan: 'Keras (G)',
    lokasiRak: 'Lemari Khusus G-02',
    minStock: 15,
    buyPrice: 7500,
    sellPrice: 11000,
    marginPercent: 46.7,
    requiresPrescription: true,
    isActive: true,
    batches: [
      {
        id: 'b-003',
        batchNumber: 'AMX-2408',
        expiredDate: '2026-11-20', // Near expiry warning
        stock: 8,
        initialStock: 30,
        buyPrice: 7500,
        supplierId: 'sup-002',
      },
    ],
  },
  {
    id: 'prod-003',
    sku: 'OBAT-003',
    name: 'Cetirizine 10 mg',
    genericName: 'Cetirizine HCl',
    category: 'Antihistamin / Alergi',
    unit: 'Strip',
    golongan: 'Bebas Terbatas',
    lokasiRak: 'Rak B-02',
    minStock: 12,
    buyPrice: 5000,
    sellPrice: 8000,
    marginPercent: 60,
    requiresPrescription: false,
    isActive: true,
    batches: [
      {
        id: 'b-004',
        batchNumber: 'CTZ-2411',
        expiredDate: '2027-04-15',
        stock: 24,
        initialStock: 40,
        buyPrice: 5000,
        supplierId: 'sup-001',
      },
    ],
  },
  {
    id: 'prod-004',
    sku: 'OBAT-004',
    name: 'Antasida Doen Suspensi 60 ml',
    genericName: 'Aluminium Hydroxide & Magnesium Hydroxide',
    category: 'Saluran Pencernaan / Maag',
    unit: 'Botol',
    golongan: 'Bebas',
    lokasiRak: 'Rak C-01 (Cair)',
    minStock: 8,
    buyPrice: 8500,
    sellPrice: 13000,
    marginPercent: 52.9,
    requiresPrescription: false,
    isActive: true,
    batches: [
      {
        id: 'b-005',
        batchNumber: 'ATD-2404',
        expiredDate: '2027-01-10',
        stock: 5, // Di bawah min stock (Defecta!)
        initialStock: 25,
        buyPrice: 8500,
        supplierId: 'sup-003',
      },
    ],
  },
  {
    id: 'prod-005',
    sku: 'OBAT-005',
    name: 'Metformin HCl 500 mg',
    genericName: 'Metformin',
    category: 'Antidiabetes',
    unit: 'Strip',
    golongan: 'Keras (G)',
    lokasiRak: 'Lemari G-03',
    minStock: 20,
    buyPrice: 3200,
    sellPrice: 5000,
    marginPercent: 56.2,
    requiresPrescription: true,
    isActive: true,
    batches: [
      {
        id: 'b-006',
        batchNumber: 'MET-2409',
        expiredDate: '2027-08-20',
        stock: 3, // Defecta Kritis!
        initialStock: 50,
        buyPrice: 3200,
        supplierId: 'sup-002',
      },
    ],
  },
  {
    id: 'prod-006',
    sku: 'OBAT-006',
    name: 'Vitamin C 500 mg IPI',
    genericName: 'Ascorbic Acid',
    category: 'Vitamin & Suplemen',
    unit: 'Botol',
    golongan: 'Bebas',
    lokasiRak: 'Rak D-01 (OTC)',
    minStock: 10,
    buyPrice: 6000,
    sellPrice: 9500,
    marginPercent: 58.3,
    requiresPrescription: false,
    isActive: true,
    batches: [
      {
        id: 'b-007',
        batchNumber: 'VTC-2501',
        expiredDate: '2027-11-30',
        stock: 45,
        initialStock: 60,
        buyPrice: 6000,
        supplierId: 'sup-003',
      },
    ],
  },
  {
    id: 'prod-007',
    sku: 'OBAT-007',
    name: 'Hydrocortisone Salep 2.5% 5g',
    genericName: 'Hydrocortisone Acetate',
    category: 'Dermatologi / Kulit',
    unit: 'Tube',
    golongan: 'Bebas Terbatas',
    lokasiRak: 'Rak Salep S-01',
    minStock: 6,
    buyPrice: 7000,
    sellPrice: 11500,
    marginPercent: 64.3,
    requiresPrescription: false,
    isActive: true,
    batches: [
      {
        id: 'b-008',
        batchNumber: 'HYD-2403',
        expiredDate: '2027-05-18',
        stock: 14,
        initialStock: 20,
        buyPrice: 7000,
        supplierId: 'sup-001',
      },
    ],
  },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-001',
    code: 'PBF-01',
    name: 'PT Kimia Farma Trading & Distribution',
    phone: '021-3847700',
    address: 'Jl. Budi Utomo No. 1, Jakarta Pusat',
    leadTimeDays: 2,
    paymentTermDays: 30,
    licenseNumber: 'PBF/DKI/2023/089',
  },
  {
    id: 'sup-002',
    code: 'PBF-02',
    name: 'PT Anugrah Argon Medica (AAM)',
    phone: '021-8934500',
    address: 'Kawasan Industri Pulogadung Blok B',
    leadTimeDays: 1,
    paymentTermDays: 21,
    licenseNumber: 'PBF/DKI/2022/112',
  },
  {
    id: 'sup-003',
    code: 'PBF-03',
    name: 'PT Enseval Putera Megatrading Tbk',
    phone: '021-4609042',
    address: 'Jl. Rawa Gelam IV No. 2, Kawasan Industri Pulogadung',
    leadTimeDays: 3,
    paymentTermDays: 30,
    licenseNumber: 'PBF/DKI/2021/045',
  },
];

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    name: 'dr. H. Ahmad Fauzi, Sp.PD',
    sipNumber: 'SIP.446/1029/DINKES/2024',
    specialty: 'Spesialis Penyakit Dalam',
    clinicOrHospital: 'RSUD & Klinik Pratama Sehat',
    phone: '0812-3456-7890',
  },
  {
    id: 'doc-002',
    name: 'dr. Sarah Nabilah',
    sipNumber: 'SIP.446/0582/DINKES/2023',
    specialty: 'Dokter Umum',
    clinicOrHospital: 'Puskesmas Kecamatan',
    phone: '0813-8899-1122',
  },
];

const INITIAL_SERVICE_FEES: ServiceFee[] = [
  { id: 'fee-1', name: 'Tuslah Resep Non-Racik', type: 'tuslah', fee: 3000, isActive: true },
  { id: 'fee-2', name: 'Tuslah Resep Racikan Puyer/Kapsul', type: 'racik', fee: 5000, isActive: true },
  { id: 'fee-3', name: 'Embalase Wadah & Plastik Klip', type: 'embalase', fee: 2000, isActive: true },
  { id: 'fee-4', name: 'Embalase Pot Salep Kaca/Plastik', type: 'embalase', fee: 4000, isActive: true },
];

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-001',
    code: 'MB-1001',
    name: 'Ibu Ratna Dewi',
    phone: '0812-9988-7766',
    address: 'Jl. Melati No. 12, Kel. Farma Sejahtera',
    points: 120,
    tier: 'Gold',
    discountPercent: 5,
    allergies: 'Alergi Golongan Penisilin',
  },
  {
    id: 'mem-002',
    code: 'MB-1002',
    name: 'Bpk. Hendra Gunawan',
    phone: '0857-1122-3344',
    address: 'Komplek Permata Hijau Blok C4',
    points: 45,
    tier: 'Reguler',
    discountPercent: 0,
    allergies: 'Tidak ada alergi',
  },
];

const INITIAL_PROMOS: Promo[] = [
  {
    id: 'pro-001',
    code: 'SEHAT5',
    title: 'Diskon Sehat Lansia 5%',
    discountType: 'percentage',
    discountValue: 5,
    minPurchase: 50000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 'pro-002',
    code: 'VITAMIN10',
    title: 'Voucher Suplemen Rp 10.000',
    discountType: 'fixed',
    discountValue: 10000,
    minPurchase: 100000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
  },
];

const INITIAL_COA: ChartOfAccount[] = [
  { code: '101', name: 'Kas Kasir (Cash Drawer)', type: 'Aktiva', balance: 500000 },
  { code: '102', name: 'Kas Bank BCA', type: 'Aktiva', balance: 14250000 },
  { code: '103', name: 'Kas Bank Mandiri / QRIS', type: 'Aktiva', balance: 8300000 },
  { code: '105', name: 'Persediaan Obat & Alkes', type: 'Aktiva', balance: 45800000 },
  { code: '201', name: 'Hutang Dagang PBF', type: 'Kewajiban', balance: 12500000 },
  { code: '301', name: 'Modal Pemilik Apotek', type: 'Modal', balance: 50000000 },
  { code: '401', name: 'Pendapatan Penjualan Obat', type: 'Pendapatan', balance: 98450000 },
  { code: '402', name: 'Pendapatan Jasa Tuslah & Resep', type: 'Pendapatan', balance: 4120000 },
  { code: '501', name: 'Harga Pokok Penjualan (HPP)', type: 'Beban', balance: 64200000 },
  { code: '601', name: 'Beban Operasional & Listrik', type: 'Beban', balance: 3200000 },
];

const INITIAL_SETTINGS: AppSettings = {
  pharmacyName: 'Apotek Hifzi Farma',
  tagline: 'Melayani Dengan Hati, Solusi Obat Terpercaya',
  siaNumber: 'SIA.503/0482/DINKES/2023',
  pharmacistInCharge: 'apt. Sepryanda Yon, S.Farm',
  sipaNumber: 'SIPA/19920810/2022/2045',
  address: 'Jl. Raya Sehat No. 88, Jakarta Timur',
  phone: '021-87654321 / WA: 0812-9988-7766',
  email: 'admin@hifzifarma.com',
  logoInitial: 'H',

  printerPaperWidth: '58mm',
  printHeader: 'Apotek Hifzi Farma',
  printFooter: 'Terima kasih atas kunjungan Anda. Semoga lekas sembuh & sehat selalu.',
  showPharmacistOnReceipt: true,
  showDoctorOnReceipt: true,
  autoCutReceipt: true,
  openCashDrawer: true,

  themeColor: 'green',
  textScale: 'standard',
  fontFamily: 'Plus Jakarta Sans',
};

const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'br-01',
    code: 'HF-01',
    name: 'Apotek Hifzi Farma Pusat',
    address: 'Jl. Raya Sehat No. 88, Jakarta Timur',
    phone: '021-87654321',
    pharmacistInCharge: 'apt. Sepryanda Yon, S.Farm',
    sipaNumber: 'SIPA/19920810/2022/2045',
    isActive: true,
  },
  {
    id: 'br-02',
    code: 'HF-02',
    name: 'Apotek Hifzi Farma Cabang Cibubur',
    address: 'Jl. Alternatif Cibubur KM 2 No. 15',
    phone: '021-84561234',
    pharmacistInCharge: 'apt. Maya Safitri, S.Farm',
    sipaNumber: 'SIPA/19950412/2023/1089',
    isActive: true,
  },
];

const INITIAL_ACTIVE_SHIFT: Shift = {
  id: 'sh-001',
  cashierName: 'Sepryanda Yon',
  cashierId: 'usr-001',
  startTime: '2026-11-10 08:00:00',
  startingCash: 500000,
  closingCashCalculated: 500000,
  status: 'OPEN',
  notes: 'Shift Pagi Reguler',
};

// Initial Seed Transactions
const INITIAL_TRANSACTIONS: SaleTransaction[] = [
  {
    id: 'tr-001',
    invoiceNumber: 'INV/20261110/001',
    date: '2026-11-10 09:15:20',
    cashierName: 'Sepryanda Yon',
    shiftId: 'sh-001',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        batch: INITIAL_PRODUCTS[0].batches[0],
        quantity: 2,
        unitPrice: 6000,
        discountPercent: 0,
        subtotal: 12000,
      },
      {
        product: INITIAL_PRODUCTS[2],
        batch: INITIAL_PRODUCTS[2].batches[0],
        quantity: 1,
        unitPrice: 8000,
        discountPercent: 0,
        subtotal: 8000,
      },
    ],
    subtotal: 20000,
    discountTotal: 0,
    taxAmount: 2200,
    tuslahTotal: 0,
    embalaseTotal: 0,
    roundingAmount: 0,
    grandTotal: 22200,
    paymentMethod: 'Tunai',
    amountPaid: 25000,
    change: 2800,
    status: 'PAID',
  },
  {
    id: 'tr-002',
    invoiceNumber: 'INV/20261110/002',
    date: '2026-11-10 10:40:15',
    cashierName: 'Sepryanda Yon',
    shiftId: 'sh-001',
    memberId: 'mem-001',
    memberName: 'Ibu Ratna Dewi (Gold)',
    prescription: {
      prescriptionNumber: 'R/2026/11/045',
      doctorName: 'dr. H. Ahmad Fauzi, Sp.PD',
      patientName: 'Ibu Ratna Dewi',
      tuslahFee: 3000,
      embalaseFee: 2000,
      notes: 'Iter 1x - Diminum setelah makan',
    },
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        batch: INITIAL_PRODUCTS[1].batches[0],
        quantity: 2,
        unitPrice: 11000,
        discountPercent: 0,
        subtotal: 22000,
        isPrescriptionItem: true,
      },
      {
        product: INITIAL_PRODUCTS[0],
        batch: INITIAL_PRODUCTS[0].batches[0],
        quantity: 1,
        unitPrice: 6000,
        discountPercent: 0,
        subtotal: 6000,
      },
    ],
    subtotal: 28000,
    discountTotal: 1400, // 5% member
    tuslahTotal: 3000,
    embalaseTotal: 2000,
    taxAmount: 3476,
    roundingAmount: 24,
    grandTotal: 35100,
    paymentMethod: 'QRIS',
    amountPaid: 35100,
    change: 0,
    status: 'PAID',
  },
];

const INITIAL_PURCHASES: PurchaseInvoice[] = [
  {
    id: 'po-001',
    invoiceNumber: 'FP/KF/2026/0891',
    supplierId: 'sup-001',
    supplierName: 'PT Kimia Farma Trading & Distribution',
    date: '2026-11-08',
    dueDate: '2026-12-08',
    items: [
      {
        productId: 'prod-001',
        productName: 'Paracetamol 500 mg',
        batchNumber: 'PCT-2402',
        expiredDate: '2027-06-30',
        quantity: 50,
        unit: 'Strip',
        unitPrice: 4200,
        subtotal: 210000,
      },
    ],
    totalAmount: 210000,
    status: 'Lunas',
  },
];

const INITIAL_CASH_TRANS: CashTransaction[] = [
  {
    id: 'ct-001',
    date: '2026-11-10 08:00:00',
    type: 'IN',
    category: 'Modal Kasir',
    amount: 500000,
    description: 'Modal awal kasir shift pagi',
    account: 'Kas Kasir',
    recordedBy: 'Sepryanda Yon',
  },
  {
    id: 'ct-002',
    date: '2026-11-10 11:30:00',
    type: 'OUT',
    category: 'Operasional',
    amount: 25000,
    description: 'Beli kertas struk thermal 58mm & plastik klip',
    account: 'Kas Kasir',
    recordedBy: 'Sepryanda Yon',
  },
];

const INITIAL_STOCK_OPNAME: StockOpnameRecord[] = [
  {
    id: 'so-001',
    date: '2026-11-01',
    productId: 'prod-001',
    productName: 'Paracetamol 500 mg',
    batchNumber: 'PCT-2401',
    systemStock: 35,
    physicalStock: 35,
    difference: 0,
    hpp: 4000,
    lossValue: 0,
    auditor: 'apt. Sepryanda Yon',
    notes: 'Stok fisik sesuai dan rapi',
  },
];

type Listener = () => void;

class PharmacyStore {
  private users: AppUser[] = INITIAL_USERS;
  private currentUser: AppUser | null = INITIAL_USERS[0]; // Default logged-in as Administrator (Sepryanda Yon)
  private products: Product[] = INITIAL_PRODUCTS;
  private suppliers: Supplier[] = INITIAL_SUPPLIERS;
  private doctors: Doctor[] = INITIAL_DOCTORS;
  private serviceFees: ServiceFee[] = INITIAL_SERVICE_FEES;
  private members: Member[] = INITIAL_MEMBERS;
  private promos: Promo[] = INITIAL_PROMOS;
  private shifts: Shift[] = [INITIAL_ACTIVE_SHIFT];
  private currentShift: Shift | null = INITIAL_ACTIVE_SHIFT;
  private sales: SaleTransaction[] = INITIAL_TRANSACTIONS;
  private purchases: PurchaseInvoice[] = INITIAL_PURCHASES;
  private cashTransactions: CashTransaction[] = INITIAL_CASH_TRANS;
  private stockOpnameRecords: StockOpnameRecord[] = INITIAL_STOCK_OPNAME;
  private chartOfAccounts: ChartOfAccount[] = INITIAL_COA;
  private branches: Branch[] = INITIAL_BRANCHES;
  private activeBranchId: string = 'br-01';
  private rulesConfig: CentralRulesConfig = { ...DEFAULT_CENTRAL_RULES };
  private settings: AppSettings = INITIAL_SETTINGS;

  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedSettings = localStorage.getItem('hf_settings');
      if (storedSettings) this.settings = { ...INITIAL_SETTINGS, ...JSON.parse(storedSettings) };

      const storedRules = localStorage.getItem('hf_rules');
      if (storedRules) this.rulesConfig = JSON.parse(storedRules);

      const storedProducts = localStorage.getItem('hf_products');
      if (storedProducts) this.products = JSON.parse(storedProducts);

      const storedSales = localStorage.getItem('hf_sales');
      if (storedSales) this.sales = JSON.parse(storedSales);

      const storedShifts = localStorage.getItem('hf_shifts');
      if (storedShifts) {
        this.shifts = JSON.parse(storedShifts);
        this.currentShift = this.shifts.find((s) => s.status === 'OPEN') || null;
      }

      const storedUsers = localStorage.getItem('hf_users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        // Pastikan akun Developer selalu tersedia
        if (!this.users.some((u) => u.role === 'Developer' || u.username === 'dev')) {
          this.users.push(INITIAL_USERS[INITIAL_USERS.length - 1]);
        }
      }

      const storedCurrentUser = localStorage.getItem('hf_current_user');
      if (storedCurrentUser !== null) {
        if (storedCurrentUser === 'null' || !storedCurrentUser) {
          this.currentUser = null;
        } else {
          const parsed = JSON.parse(storedCurrentUser);
          const matched = this.users.find((u) => u.id === parsed.id || u.username === parsed.username);
          this.currentUser = matched || parsed;
        }
      }
    } catch {
      // fallback to initial
    }
  }

  private persist() {
    try {
      localStorage.setItem('hf_settings', JSON.stringify(this.settings));
      localStorage.setItem('hf_rules', JSON.stringify(this.rulesConfig));
      localStorage.setItem('hf_products', JSON.stringify(this.products));
      localStorage.setItem('hf_sales', JSON.stringify(this.sales));
      localStorage.setItem('hf_shifts', JSON.stringify(this.shifts));
      localStorage.setItem('hf_users', JSON.stringify(this.users));
      localStorage.setItem('hf_current_user', JSON.stringify(this.currentUser));
    } catch {
      // quota or private mode safe
    }
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- Central App Settings (Identitas, Print Struk, Tema & Tampilan) ---
  getSettings(): AppSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    // Otomatis sinkronkan profil cabang aktif dengan identitas apotek utama
    this.branches = this.branches.map((b) =>
      b.id === this.activeBranchId
        ? {
            ...b,
            name: this.settings.pharmacyName,
            address: this.settings.address,
            phone: this.settings.phone,
            pharmacistInCharge: this.settings.pharmacistInCharge,
            sipaNumber: this.settings.sipaNumber,
          }
        : b
    );
    this.persist();
  }

  // --- Backup & Restore (Pencegahan Kehilangan Data Offline & Online) ---
  exportFullDatabase(): string {
    const backupData = {
      version: '2.4',
      exportDate: new Date().toISOString(),
      pharmacyName: this.settings.pharmacyName,
      settings: this.settings,
      rules: this.rulesConfig,
      products: this.products,
      sales: this.sales,
      shifts: this.shifts,
      purchases: this.purchases,
      suppliers: this.suppliers,
      doctors: this.doctors,
      serviceFees: this.serviceFees,
      members: this.members,
      promos: this.promos,
      cashTransactions: this.cashTransactions,
      stockOpnameRecords: this.stockOpnameRecords,
      chartOfAccounts: this.chartOfAccounts,
      branches: this.branches,
    };
    return JSON.stringify(backupData, null, 2);
  }

  importFullDatabase(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) this.products = data.products;
      if (data.sales && Array.isArray(data.sales)) this.sales = data.sales;
      if (data.settings) this.settings = { ...INITIAL_SETTINGS, ...data.settings };
      if (data.rules) this.rulesConfig = { ...DEFAULT_CENTRAL_RULES, ...data.rules };
      if (data.shifts && Array.isArray(data.shifts)) this.shifts = data.shifts;
      if (data.suppliers && Array.isArray(data.suppliers)) this.suppliers = data.suppliers;
      if (data.doctors && Array.isArray(data.doctors)) this.doctors = data.doctors;
      if (data.serviceFees && Array.isArray(data.serviceFees)) this.serviceFees = data.serviceFees;
      if (data.members && Array.isArray(data.members)) this.members = data.members;
      if (data.promos && Array.isArray(data.promos)) this.promos = data.promos;
      if (data.cashTransactions && Array.isArray(data.cashTransactions)) this.cashTransactions = data.cashTransactions;
      if (data.stockOpnameRecords && Array.isArray(data.stockOpnameRecords)) this.stockOpnameRecords = data.stockOpnameRecords;
      if (data.chartOfAccounts && Array.isArray(data.chartOfAccounts)) this.chartOfAccounts = data.chartOfAccounts;
      if (data.branches && Array.isArray(data.branches)) this.branches = data.branches;
      this.persist();
      return true;
    } catch {
      return false;
    }
  }

  // --- Central Rules Getters & Updaters ---
  getRulesConfig(): CentralRulesConfig {
    return { ...this.rulesConfig };
  }

  updateRulesConfig(newRules: Partial<CentralRulesConfig>) {
    this.rulesConfig = { ...this.rulesConfig, ...newRules };
    // Automatically recalculate sell prices for products using central margin rules
    this.products = this.products.map((p) => {
      let margin = p.marginPercent;
      if (p.golongan === 'Bebas' || p.golongan === 'Bebas Terbatas') {
        margin = this.rulesConfig.defaultMarginOtc;
      } else if (p.golongan === 'Keras (G)') {
        margin = this.rulesConfig.defaultMarginKeras;
      }
      const newSellPrice = PharmacyCalculator.calculateSellingPrice(
        p.buyPrice,
        margin,
        this.rulesConfig.roundingStep
      );
      return {
        ...p,
        marginPercent: margin,
        sellPrice: newSellPrice,
      };
    });
    this.persist();
  }

  resetRulesToDefault() {
    this.rulesConfig = { ...DEFAULT_CENTRAL_RULES };
    this.persist();
  }

  // --- Products & Batches ---
  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  addProduct(productData: Omit<Product, 'id'>) {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id };
    this.products.unshift(newProduct);
    this.persist();
  }

  updateProduct(id: string, updates: Partial<Product>) {
    this.products = this.products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.persist();
  }

  deleteProduct(id: string) {
    this.products = this.products.filter((p) => p.id !== id);
    this.persist();
  }

  // Defecta items (Stock <= minStock)
  getDefectaProducts() {
    return this.products
      .map((p) => {
        const defectaInfo = PharmacyRules.isDefecta(p);
        return { product: p, ...defectaInfo };
      })
      .filter((item) => item.isDefecta);
  }

  // Near Expiry items
  getNearExpiryBatches() {
    const list: { product: Product; batch: Product['batches'][0]; daysLeft: number; label: string }[] = [];
    this.products.forEach((p) => {
      p.batches.forEach((b) => {
        const status = PharmacyRules.checkBatchStatus(b, this.rulesConfig.nearExpiryThresholdDays);
        if (status.status === 'WARNING' || status.status === 'EXPIRED') {
          list.push({ product: p, batch: b, daysLeft: status.daysLeft, label: status.label });
        }
      });
    });
    return list.sort((a, b) => a.daysLeft - b.daysLeft);
  }

  // --- Shift Management ---
  getCurrentShift(): Shift | null {
    return this.currentShift;
  }

  getAllShifts(): Shift[] {
    return this.shifts;
  }

  openShift(startingCash: number, cashierName: string = 'Sepryanda Yon', notes?: string): Shift {
    const newShift: Shift = {
      id: `sh-${Date.now()}`,
      cashierName,
      cashierId: 'usr-001',
      startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      startingCash,
      closingCashCalculated: startingCash,
      status: 'OPEN',
      notes: notes || 'Shift baru dibuka',
    };
    this.currentShift = newShift;
    this.shifts.unshift(newShift);

    // Record cash in
    this.addCashTransaction({
      type: 'IN',
      category: 'Modal Kasir',
      amount: startingCash,
      description: `Modal awal kasir shift (${cashierName})`,
      account: 'Kas Kasir',
      recordedBy: cashierName,
    });

    this.persist();
    return newShift;
  }

  closeShift(actualCash: number, notes?: string): Shift | null {
    if (!this.currentShift) return null;

    // Calculate total cash sales in this shift
    const shiftSales = this.sales.filter(
      (s) => s.shiftId === this.currentShift?.id && s.paymentMethod === 'Tunai' && s.status === 'PAID'
    );
    const cashSalesTotal = shiftSales.reduce((sum, s) => sum + s.grandTotal, 0);

    // Calculate cash expenses during shift
    const shiftExpenses = this.cashTransactions.filter(
      (c) => c.account === 'Kas Kasir' && c.type === 'OUT'
    );
    const cashOutTotal = shiftExpenses.reduce((sum, c) => sum + c.amount, 0);

    const recon = PharmacyRules.reconcileShiftCash(
      this.currentShift.startingCash,
      cashSalesTotal,
      cashOutTotal,
      actualCash
    );

    const closedShift: Shift = {
      ...this.currentShift,
      endTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      closingCashCalculated: recon.calculatedCash,
      closingCashActual: actualCash,
      difference: recon.difference,
      status: 'CLOSED',
      notes: notes || `Shift ditutup. ${recon.statusLabel}`,
    };

    this.shifts = this.shifts.map((s) => (s.id === closedShift.id ? closedShift : s));
    this.currentShift = null;
    this.persist();
    return closedShift;
  }

  // --- POS Sales Checkout (Terpusat) ---
  checkoutSale(params: {
    items: CartItem[];
    member: Member | null;
    promo: Promo | null;
    prescription: PrescriptionDetails | null;
    paymentMethod: 'Tunai' | 'QRIS' | 'Transfer Bank' | 'Kartu Debit';
    amountPaid: number;
    cashierName?: string;
  }): SaleTransaction {
    const cashier = params.cashierName || this.currentShift?.cashierName || 'Sepryanda Yon';
    const shiftId = this.currentShift?.id || 'sh-default';

    // 1. Jalankan perhitungan terpusat via PharmacyCalculator
    const promoVal = params.promo
      ? params.promo.discountType === 'percentage'
        ? (params.items.reduce((s, i) => s + i.subtotal, 0) * params.promo.discountValue) / 100
        : params.promo.discountValue
      : 0;

    const calc = PharmacyCalculator.calculateCart(
      params.items,
      params.member,
      promoVal,
      params.prescription,
      this.rulesConfig
    );

    const change = PharmacyCalculator.calculateChange(params.amountPaid, calc.grandTotal);

    // 2. Buat Record Transaksi
    const invoiceNumber = `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}/${String(this.sales.length + 1).padStart(3, '0')}`;
    const newTransaction: SaleTransaction = {
      id: `tr-${Date.now()}`,
      invoiceNumber,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      cashierName: cashier,
      shiftId,
      memberId: params.member?.id,
      memberName: params.member ? `${params.member.name} (${params.member.tier})` : undefined,
      items: params.items,
      prescription: params.prescription || undefined,
      subtotal: calc.itemsSubtotal,
      discountTotal: calc.itemDiscountTotal + calc.memberDiscountAmount + calc.promoDiscountAmount,
      taxAmount: calc.taxAmount,
      tuslahTotal: calc.tuslahTotal,
      embalaseTotal: calc.embalaseTotal,
      roundingAmount: calc.roundingAmount,
      grandTotal: calc.grandTotal,
      paymentMethod: params.paymentMethod,
      amountPaid: params.amountPaid,
      change,
      status: 'PAID',
    };

    // 3. Kurangi stok batch produk (FEFO Deduction)
    params.items.forEach((item) => {
      this.deductProductStock(item.product.id, item.batch.id, item.quantity);
    });

    // 4. Update member points (1 poin per Rp 10.000)
    if (params.member) {
      const addedPoints = Math.floor(calc.grandTotal / 10000);
      this.members = this.members.map((m) =>
        m.id === params.member?.id ? { ...m, points: m.points + addedPoints } : m
      );
    }

    // 5. Simpan ke sales & update shift
    this.sales.unshift(newTransaction);

    if (this.currentShift && params.paymentMethod === 'Tunai') {
      this.currentShift = {
        ...this.currentShift,
        closingCashCalculated: this.currentShift.closingCashCalculated + calc.grandTotal,
      };
      this.shifts = this.shifts.map((s) => (s.id === this.currentShift?.id ? this.currentShift! : s));
    }

    this.persist();
    return newTransaction;
  }

  // Deduct stock per batch
  private deductProductStock(productId: string, batchId: string, qty: number) {
    this.products = this.products.map((p) => {
      if (p.id !== productId) return p;
      const updatedBatches = p.batches.map((b) => {
        if (b.id !== batchId) return b;
        return { ...b, stock: Math.max(0, b.stock - qty) };
      });
      return { ...p, batches: updatedBatches };
    });
  }

  // --- Transactions & Reports ---
  getSales(): SaleTransaction[] {
    return this.sales;
  }

  getSuppliers(): Supplier[] {
    return this.suppliers;
  }

  addSupplier(supplier: Omit<Supplier, 'id'>) {
    const newSup: Supplier = { ...supplier, id: `sup-${Date.now()}` };
    this.suppliers.push(newSup);
    this.persist();
  }

  getDoctors(): Doctor[] {
    return this.doctors;
  }

  addDoctor(doctor: Omit<Doctor, 'id'>) {
    const newDoc: Doctor = { ...doctor, id: `doc-${Date.now()}` };
    this.doctors.push(newDoc);
    this.persist();
  }

  getServiceFees(): ServiceFee[] {
    return this.serviceFees;
  }

  updateServiceFee(id: string, fee: number) {
    this.serviceFees = this.serviceFees.map((f) => (f.id === id ? { ...f, fee } : f));
    this.persist();
  }

  getMembers(): Member[] {
    return this.members;
  }

  addMember(member: Omit<Member, 'id'>) {
    const newMember: Member = { ...member, id: `mem-${Date.now()}` };
    this.members.push(newMember);
    this.persist();
  }

  getPromos(): Promo[] {
    return this.promos;
  }

  getPurchases(): PurchaseInvoice[] {
    return this.purchases;
  }

  addPurchaseInvoice(invoice: Omit<PurchaseInvoice, 'id'>) {
    const newInvoice: PurchaseInvoice = { ...invoice, id: `po-${Date.now()}` };
    this.purchases.unshift(newInvoice);

    // Automatically add incoming batch to product stock
    invoice.items.forEach((item) => {
      const prod = this.products.find((p) => p.id === item.productId);
      if (prod) {
        const existingBatch = prod.batches.find((b) => b.batchNumber === item.batchNumber);
        if (existingBatch) {
          existingBatch.stock += item.quantity;
        } else {
          prod.batches.push({
            id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            batchNumber: item.batchNumber,
            expiredDate: item.expiredDate,
            stock: item.quantity,
            initialStock: item.quantity,
            buyPrice: item.unitPrice,
            supplierId: invoice.supplierId,
          });
        }
      }
    });

    this.persist();
  }

  getCashTransactions(): CashTransaction[] {
    return this.cashTransactions;
  }

  addCashTransaction(trans: Omit<CashTransaction, 'id' | 'date'>) {
    const newTx: CashTransaction = {
      ...trans,
      id: `ct-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    this.cashTransactions.unshift(newTx);
    this.persist();
  }

  getStockOpnameRecords(): StockOpnameRecord[] {
    return this.stockOpnameRecords;
  }

  addStockOpname(record: Omit<StockOpnameRecord, 'id' | 'date'>) {
    const newOpname: StockOpnameRecord = {
      ...record,
      id: `so-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 10),
    };
    this.stockOpnameRecords.unshift(newOpname);

    // Adjust batch physical stock
    this.products = this.products.map((p) => {
      if (p.id !== record.productId) return p;
      const updatedBatches = p.batches.map((b) => {
        if (b.batchNumber === record.batchNumber) {
          return { ...b, stock: record.physicalStock };
        }
        return b;
      });
      return { ...p, batches: updatedBatches };
    });

    this.persist();
  }

  getChartOfAccounts(): ChartOfAccount[] {
    return this.chartOfAccounts;
  }

  getBranches(): Branch[] {
    return this.branches;
  }

  getActiveBranch(): Branch {
    return this.branches.find((b) => b.id === this.activeBranchId) || this.branches[0];
  }

  setActiveBranch(branchId: string) {
    this.activeBranchId = branchId;
    this.notify();
  }

  // --- User Authentication & RBAC Access Layer ---
  getCurrentUser(): AppUser | null {
    return this.currentUser;
  }

  getUsers(): AppUser[] {
    return this.users;
  }

  login(username: string, password: string): { success: boolean; message?: string; user?: AppUser } {
    const trimmedUser = username.trim().toLowerCase();
    const user = this.users.find(
      (u) => u.username.toLowerCase() === trimmedUser || u.email.toLowerCase() === trimmedUser
    );

    if (!user) {
      return { success: false, message: 'Nama pengguna atau email tidak ditemukan!' };
    }

    if (!user.isActive) {
      return { success: false, message: 'Akun ini dinonaktifkan oleh Administrator.' };
    }

    if (user.password && user.password !== password) {
      return { success: false, message: 'Kata sandi tidak sesuai!' };
    }

    this.currentUser = user;
    this.persist();
    return { success: true, user };
  }

  logout(): void {
    this.currentUser = null;
    this.persist();
  }

  switchRole(role: UserRole): void {
    const matched = this.users.find((u) => u.role === role);
    if (matched) {
      this.currentUser = matched;
      this.persist();
    }
  }

  addUser(userData: Omit<AppUser, 'id'>): AppUser {
    const newUser: AppUser = {
      ...userData,
      id: `usr-${Date.now()}`,
    };
    this.users.push(newUser);
    this.persist();
    return newUser;
  }

  updateUser(id: string, updates: Partial<AppUser>): void {
    this.users = this.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    if (this.currentUser && this.currentUser.id === id) {
      this.currentUser = { ...this.currentUser, ...updates };
    }
    this.persist();
  }
}

// Global Singleton Instance
export const pharmacyStore = new PharmacyStore();
