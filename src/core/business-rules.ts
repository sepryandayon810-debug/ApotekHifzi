/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Centralized Business Rules & Validation Engine (Aturan Bisnis Terpusat)
 * 
 * Semua logic aturan apotek (FEFO, Safety Stock, Expiry Warning, RBAC, Batasan Shift)
 * diatur dan divalidasi di sini secara terpusat.
 */

import { BatchItem, CentralRulesConfig, Product, UserRole } from '../types/pharmacy';

export const DEFAULT_CENTRAL_RULES: CentralRulesConfig = {
  ppnPercent: 11, // PPN 11% sesuai UU HPP RI
  enableRounding: true,
  roundingStep: 100, // Dibulatkan ke ratusan rupiah terdekat
  nearExpiryThresholdDays: 90, // < 90 hari dianggap mendekati kadaluwarsa (WASPADA)
  defaultMarginOtc: 20, // 20% margin obat bebas
  defaultMarginKeras: 25, // 25% margin obat keras
  defaultMarginResep: 30, // 30% margin obat racik / resep
  tuslahResepStandard: 3000, // Rp 3.000 jasa farmasi per lembar R/
  embalaseStandard: 2000, // Rp 2.000 wadah botol/pot/plastik klip
  maxDiscountWithoutSupervisor: 10, // Maksimal diskon kasir 10%
  enforceFefoSelection: true, // FEFO enforcement
};

export class PharmacyRules {
  /**
   * Rule: Menghitung selisih hari sampai tanggal kadaluwarsa
   */
  static getDaysUntilExpiry(expiredDateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expiredDateStr);
    expDate.setHours(0, 0, 0, 0);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Rule FEFO: Mengecek status kelayakan jual batch obat
   * - EXPIRED: Kadaluwarsa (TIDAK BOLEH DIJUAL!)
   * - WARNING: Mendekati kadaluwarsa (prioritas FEFO jual cepat)
   * - SAFE: Aman
   */
  static checkBatchStatus(
    batch: BatchItem,
    thresholdDays: number = DEFAULT_CENTRAL_RULES.nearExpiryThresholdDays
  ): {
    status: 'EXPIRED' | 'WARNING' | 'SAFE';
    daysLeft: number;
    canSell: boolean;
    label: string;
  } {
    const daysLeft = this.getDaysUntilExpiry(batch.expiredDate);

    if (daysLeft <= 0) {
      return {
        status: 'EXPIRED',
        daysLeft,
        canSell: false,
        label: 'Kadaluwarsa (Karantina)',
      };
    }

    if (daysLeft <= thresholdDays) {
      return {
        status: 'WARNING',
        daysLeft,
        canSell: true,
        label: `Perhatian FEFO (${daysLeft} hari lagi)`,
      };
    }

    return {
      status: 'SAFE',
      daysLeft,
      canSell: true,
      label: `Aman (${daysLeft} hari)`,
    };
  }

  /**
   * Rule Defecta: Mengecek apakah stok obat sudah mencapai / di bawah Safety Stock (Min Stock)
   */
  static isDefecta(product: Product): {
    isDefecta: boolean;
    totalStock: number;
    deficiency: number;
    urgency: 'KRITIS' | 'MENIPIS' | 'AMAN';
  } {
    const totalStock = product.batches.reduce((sum, b) => sum + (b.stock || 0), 0);
    const minStock = product.minStock || 5;

    if (totalStock === 0) {
      return {
        isDefecta: true,
        totalStock,
        deficiency: minStock,
        urgency: 'KRITIS',
      };
    }

    if (totalStock <= minStock) {
      return {
        isDefecta: true,
        totalStock,
        deficiency: minStock - totalStock,
        urgency: 'MENIPIS',
      };
    }

    return {
      isDefecta: false,
      totalStock,
      deficiency: 0,
      urgency: 'AMAN',
    };
  }

  /**
   * Rule FEFO Sorter: Mengurutkan batch berdasarkan tanggal expired terdekat yang masih valid
   */
  static sortBatchesFEFO(batches: BatchItem[]): BatchItem[] {
    return [...batches].sort((a, b) => {
      return new Date(a.expiredDate).getTime() - new Date(b.expiredDate).getTime();
    });
  }

  /**
   * Rule Pemilihan Batch Rekomendasi (FEFO)
   * Mengambil batch dengan expired paling dekat yang stoknya > 0 dan belum kadaluwarsa
   */
  static getRecommendedBatch(batches: BatchItem[]): BatchItem | null {
    const sorted = this.sortBatchesFEFO(batches);
    const valid = sorted.find((b) => {
      const { canSell } = this.checkBatchStatus(b);
      return canSell && b.stock > 0;
    });
    return valid || null;
  }

  /**
   * Rule Validasi Penjualan Obat Keras (Resep Dokter)
   */
  static validatePrescriptionRequirement(
    product: Product,
    hasPrescription: boolean
  ): { isValid: boolean; message?: string } {
    if (product.requiresPrescription && !hasPrescription) {
      return {
        isValid: false,
        message: `Obat "${product.name}" masuk golongan ${product.golongan} dan wajib menyertakan Resep Dokter / SIP!`,
      };
    }
    return { isValid: true };
  }

  /**
   * Rule Rekonsiliasi Kas Shift Kasir:
   * Selisih = Kas Fisik Aktual - (Modal Awal + Total Penjualan Tunai - Kas Keluar)
   */
  static reconcileShiftCash(
    startingCash: number,
    cashSalesTotal: number,
    cashOutTotal: number,
    actualClosingCash: number
  ): {
    calculatedCash: number;
    difference: number;
    isBalanced: boolean;
    statusLabel: string;
  } {
    const calculatedCash = startingCash + cashSalesTotal - cashOutTotal;
    const difference = actualClosingCash - calculatedCash;

    let statusLabel = 'Seimbang (Tepat)';
    if (difference > 0) {
      statusLabel = `Lebih Rp ${difference.toLocaleString('id-ID')}`;
    } else if (difference < 0) {
      statusLabel = `Kurang Rp ${Math.abs(difference).toLocaleString('id-ID')}`;
    }

    return {
      calculatedCash,
      difference,
      isBalanced: difference === 0,
      statusLabel,
    };
  }

  /**
   * Rule Otorisasi Hak Akses Menu Terpusat (RBAC)
   * Menentukan secara ketat menu apa saja yang boleh diakses berdasarkan peran pengguna
   */
  static canAccessMenu(role: UserRole, menuId: string): boolean {
    if (role === 'Administrator' || role === 'Developer') return true; // Akses penuh ke seluruh menu & fitur pengembang

    if (role === 'Kasir') {
      const kasirMenus = [
        'pos',
        'buka_shift',
        'riwayat_kasir',
        'printer_kasir',
        'member',
        'promo',
        'sesi_kasir',
      ];
      return kasirMenus.includes(menuId);
    }

    if (role === 'Apoteker') {
      // Apoteker memiliki akses klinis & inventori tapi tidak ke CoA & Pengguna Admin
      const apotekerMenus = [
        'dashboard',
        'pos',
        'buka_shift',
        'riwayat_kasir',
        'printer_kasir',
        'member',
        'promo',
        'pembelian',
        'retur',
        'konsinyasi',
        'defecta',
        'stok_batch',
        'stok_opname',
        'penyesuaian_stok',
        'audit_stok',
        'lap_penjualan',
        'lap_pembelian',
        'lap_inventori',
        'lap_konsinyasi',
        'lap_member',
        'master_obat',
        'supplier',
        'kategori_satuan',
        'dokter',
        'biaya_jasa',
        'umum',
      ];
      return apotekerMenus.includes(menuId);
    }

    if (role === 'Gudang') {
      // Gudang fokus pada logistik, faktur PBF, dan stok
      const gudangMenus = [
        'pembelian',
        'retur',
        'konsinyasi',
        'defecta',
        'stok_batch',
        'stok_opname',
        'penyesuaian_stok',
        'audit_stok',
        'lap_pembelian',
        'lap_inventori',
        'master_obat',
        'supplier',
        'kategori_satuan',
      ];
      return gudangMenus.includes(menuId);
    }

    return false;
  }
}
