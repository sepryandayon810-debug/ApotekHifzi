/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Centralized Calculation Engine (Mesin Perhitungan Terpusat)
 * 
 * Sesuai instruksi: "dengan perhitungan terpusat jangan di html jadi apabila kita merubah fitur lebih gampang"
 * Semua rumus matematika, diskon, tuslah, embalase, PPN, dan pembulatan berada di sini.
 */

import { CartItem, CentralRulesConfig, Member, PrescriptionDetails } from '../types/pharmacy';
import { DEFAULT_CENTRAL_RULES } from './business-rules';

export interface CartCalculationResult {
  itemsSubtotal: number;
  itemDiscountTotal: number;
  memberDiscountPercent: number;
  memberDiscountAmount: number;
  promoDiscountAmount: number;
  tuslahTotal: number;
  embalaseTotal: number;
  taxableBase: number;
  ppnPercent: number;
  taxAmount: number;
  subtotalBeforeRounding: number;
  roundingAmount: number;
  grandTotal: number;
}

export class PharmacyCalculator {
  /**
   * Menghitung Harga Jual dari HPP dan Persentase Margin
   * Rumus: HPP * (1 + margin / 100) kemudian dibulatkan ke kelipatan 100
   */
  static calculateSellingPrice(
    buyPrice: number,
    marginPercent: number,
    roundStep: number = 100
  ): number {
    if (!buyPrice || buyPrice <= 0) return 0;
    const rawPrice = buyPrice * (1 + marginPercent / 100);
    return Math.ceil(rawPrice / roundStep) * roundStep;
  }

  /**
   * Menghitung Margin Keuntungan Riil
   * Rumus: ((Harga Jual - HPP) / HPP) * 100
   */
  static calculateProfitMargin(buyPrice: number, sellPrice: number): number {
    if (!buyPrice || buyPrice <= 0) return 0;
    const margin = ((sellPrice - buyPrice) / buyPrice) * 100;
    return Number(margin.toFixed(2));
  }

  /**
   * Menghitung Laba Kotor Nominal
   */
  static calculateGrossProfit(buyPrice: number, sellPrice: number, qty: number): number {
    return (sellPrice - buyPrice) * qty;
  }

  /**
   * Melakukan Pembulatan Terpusat Kasir (Rounding Rule)
   * Misal: Rp 15.420 dibulatkan ke Rp 15.500 atau Rp 15.400 sesuai step
   */
  static applyRounding(amount: number, step: number = 100): { rounded: number; diff: number } {
    if (step <= 1) return { rounded: amount, diff: 0 };
    const remainder = amount % step;
    if (remainder === 0) return { rounded: amount, diff: 0 };
    
    // Pembulatan ke atas (standar farmasi retail)
    const rounded = Math.ceil(amount / step) * step;
    return { rounded, diff: rounded - amount };
  }

  /**
   * Kalkulasi Keranjang Kasir POS secara Terpusat (Cart Calculation Engine)
   */
  static calculateCart(
    items: CartItem[],
    member: Member | null,
    promoDiscount: number = 0,
    prescription: PrescriptionDetails | null = null,
    rules: CentralRulesConfig = DEFAULT_CENTRAL_RULES
  ): CartCalculationResult {
    // 1. Hitung subtotal seluruh item
    let itemsSubtotal = 0;
    let itemDiscountTotal = 0;

    items.forEach((item) => {
      const lineGross = item.unitPrice * item.quantity;
      const lineDisc = lineGross * ((item.discountPercent || 0) / 100);
      itemsSubtotal += lineGross;
      itemDiscountTotal += lineDisc;
    });

    const netItems = itemsSubtotal - itemDiscountTotal;

    // 2. Diskon Member
    const memberDiscountPercent = member?.discountPercent || 0;
    const memberDiscountAmount = (netItems * memberDiscountPercent) / 100;

    // 3. Diskon Promo Eksternal
    const promoDiscountAmount = Math.min(promoDiscount, netItems - memberDiscountAmount);

    // 4. Biaya Resep (Tuslah & Embalase)
    const tuslahTotal = prescription?.tuslahFee ?? (prescription ? rules.tuslahResepStandard : 0);
    const embalaseTotal = prescription?.embalaseFee ?? (prescription ? rules.embalaseStandard : 0);

    // 5. Dasar Pengenaan Pajak (DPP)
    const taxableBase = Math.max(0, netItems - memberDiscountAmount - promoDiscountAmount) + tuslahTotal + embalaseTotal;

    // 6. PPN
    const ppnPercent = rules.ppnPercent;
    const taxAmount = (taxableBase * ppnPercent) / 100;

    // 7. Subtotal sebelum pembulatan
    const subtotalBeforeRounding = taxableBase + taxAmount;

    // 8. Pembulatan Kasir
    let roundingAmount = 0;
    let grandTotal = Math.round(subtotalBeforeRounding);

    if (rules.enableRounding && rules.roundingStep > 0) {
      const roundResult = this.applyRounding(subtotalBeforeRounding, rules.roundingStep);
      grandTotal = roundResult.rounded;
      roundingAmount = roundResult.diff;
    }

    return {
      itemsSubtotal,
      itemDiscountTotal,
      memberDiscountPercent,
      memberDiscountAmount,
      promoDiscountAmount,
      tuslahTotal,
      embalaseTotal,
      taxableBase,
      ppnPercent,
      taxAmount,
      subtotalBeforeRounding,
      roundingAmount,
      grandTotal,
    };
  }

  /**
   * Menghitung Kembalian Kasir
   */
  static calculateChange(amountPaid: number, grandTotal: number): number {
    return Math.max(0, amountPaid - grandTotal);
  }

  /**
   * Menghitung Valuasi Aset Total Stok Inventori
   */
  static calculateInventoryValuation(
    batches: { stock: number; buyPrice: number }[]
  ): { totalItemsCount: number; totalAssetValue: number } {
    let totalItemsCount = 0;
    let totalAssetValue = 0;

    batches.forEach((b) => {
      const s = Number(b.stock) || 0;
      const bp = Number(b.buyPrice) || 0;
      totalItemsCount += s;
      totalAssetValue += s * bp;
    });

    return { totalItemsCount, totalAssetValue };
  }
}
