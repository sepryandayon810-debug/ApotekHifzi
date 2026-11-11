/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * POS Kasir Page - Apotek Hifzi Farma
 * Menjalankan kalkulasi kasir, resep racikan/non-racik, member, dan FEFO secara terpusat
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  FileText,
  User,
  CreditCard,
  QrCode,
  Banknote,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { PharmacyRules } from '../../core/business-rules';
import { PharmacyCalculator } from '../../core/calculator';
import { CartItem, Member, PrescriptionDetails, Product, SaleTransaction } from '../../types/pharmacy';
import { POSReceiptModal } from '../../components/pos/POSReceiptModal';

export const POSKasirPage: React.FC = () => {
  const {
    products,
    members,
    doctors,
    promos,
    currentShift,
    rules,
    checkoutSale,
  } = usePharmacy();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Prescription State
  const [isPrescriptionMode, setIsPrescriptionMode] = useState<boolean>(false);
  const [prescriptionNumber, setPrescriptionNumber] = useState(`R/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);
  const [selectedDoctorName, setSelectedDoctorName] = useState(doctors[0]?.name || '');
  const [patientName, setPatientName] = useState('');
  const [customTuslah, setCustomTuslah] = useState<number>(rules.tuslahResepStandard);
  const [customEmbalase, setCustomEmbalase] = useState<number>(rules.embalaseStandard);

  // Payment Checkout Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Transfer Bank' | 'Kartu Debit'>('Tunai');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [completedTransaction, setCompletedTransaction] = useState<SaleTransaction | null>(null);

  // Filtered Products
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['Semua', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.genericName && p.genericName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery && p.isActive;
    });
  }, [products, selectedCategory, searchQuery]);

  // Central Calculation of Cart (Perhitungan Terpusat)
  const prescriptionData: PrescriptionDetails | null = isPrescriptionMode
    ? {
        prescriptionNumber,
        doctorName: selectedDoctorName,
        patientName: patientName || 'Pasien Umum',
        tuslahFee: customTuslah,
        embalaseFee: customEmbalase,
      }
    : null;

  const calculation = useMemo(() => {
    return PharmacyCalculator.calculateCart(
      cartItems,
      selectedMember,
      0,
      prescriptionData,
      rules
    );
  }, [cartItems, selectedMember, prescriptionData, rules]);

  // Add product to cart with FEFO recommendation
  const handleAddToCart = (product: Product) => {
    // Check prescription rule if product requires it
    if (product.requiresPrescription && !isPrescriptionMode) {
      if (
        !confirm(
          `Obat "${product.name}" masuk golongan ${product.golongan} (Obat Keras). Lanjutkan dengan mencatat resep dokter?`
        )
      ) {
        return;
      }
      setIsPrescriptionMode(true);
    }

    // FEFO Recommended Batch
    const recommendedBatch = PharmacyRules.getRecommendedBatch(product.batches);
    if (!recommendedBatch) {
      alert(`Stok obat "${product.name}" sudah habis atau semua batch kadaluwarsa!`);
      return;
    }

    const existingIdx = cartItems.findIndex(
      (item) => item.product.id === product.id && item.batch.id === recommendedBatch.id
    );

    if (existingIdx >= 0) {
      // Increase qty
      const existing = cartItems[existingIdx];
      if (existing.quantity + 1 > recommendedBatch.stock) {
        alert(`Stok maksimal batch ${recommendedBatch.batchNumber} hanya ${recommendedBatch.stock} ${product.unit}!`);
        return;
      }
      const updated = [...cartItems];
      updated[existingIdx] = {
        ...existing,
        quantity: existing.quantity + 1,
        subtotal: (existing.quantity + 1) * existing.unitPrice,
      };
      setCartItems(updated);
    } else {
      const unitPrice = product.sellPrice;
      const newItem: CartItem = {
        product,
        batch: recommendedBatch,
        quantity: 1,
        unitPrice,
        discountPercent: 0,
        subtotal: unitPrice,
        isPrescriptionItem: isPrescriptionMode,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleUpdateQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    const item = cartItems[index];
    if (newQty > item.batch.stock) {
      alert(`Stok batch ${item.batch.batchNumber} hanya tersisa ${item.batch.stock}!`);
      return;
    }
    const updated = [...cartItems];
    updated[index] = {
      ...item,
      quantity: newQty,
      subtotal: newQty * item.unitPrice,
    };
    setCartItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    if (confirm('Kosongkan keranjang transaksi?')) {
      setCartItems([]);
    }
  };

  // Open Checkout
  const handleOpenPayment = () => {
    if (cartItems.length === 0) return;
    setAmountPaid(calculation.grandTotal);
    setIsPaymentOpen(true);
  };

  // Process checkout
  const handleProcessCheckout = () => {
    if (paymentMethod === 'Tunai' && amountPaid < calculation.grandTotal) {
      alert('Jumlah uang bayar tunai kurang dari total belanja!');
      return;
    }

    const transaction = checkoutSale({
      items: cartItems,
      member: selectedMember,
      promo: null,
      prescription: prescriptionData,
      paymentMethod,
      amountPaid: paymentMethod === 'Tunai' ? amountPaid : calculation.grandTotal,
      cashierName: currentShift?.cashierName || 'Sepryanda Yon',
    });

    // Reset cart
    setCartItems([]);
    setIsPaymentOpen(false);
    // Show receipt
    setCompletedTransaction(transaction);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-slate-100">
      {/* LEFT COLUMN: Drug Catalog & Search (60%) */}
      <div className="flex-1 flex flex-col border-r border-slate-200 overflow-hidden bg-white">
        {/* Search & Category Header */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari obat berdasarkan nama, SKU, atau zat aktif (e.g. Paracetamol)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Shift warning banner if closed */}
            {!currentShift && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs bg-amber-50 text-amber-800 px-3 py-2 rounded-xl border border-amber-200 font-medium whitespace-nowrap">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Shift belum dibuka</span>
              </div>
            )}
          </div>

          {/* Category Horizontal Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map((prod) => {
            const recommendedBatch = PharmacyRules.getRecommendedBatch(prod.batches);
            const totalStock = prod.batches.reduce((s, b) => s + b.stock, 0);
            const isOutOfStock = totalStock <= 0;
            const expiryStatus = recommendedBatch
              ? PharmacyRules.checkBatchStatus(recommendedBatch, rules.nearExpiryThresholdDays)
              : null;

            return (
              <div
                key={prod.id}
                onClick={() => !isOutOfStock && handleAddToCart(prod)}
                className={`flex flex-col justify-between p-3 rounded-xl border transition-all select-none text-left ${
                  isOutOfStock
                    ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md cursor-pointer active:scale-[0.98]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono text-slate-500">{prod.sku}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        prod.golongan === 'Keras (G)'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {prod.golongan}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                    {prod.name}
                  </h4>
                  {prod.genericName && (
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{prod.genericName}</p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Stok:</span>
                    <span className={`font-mono font-semibold ${totalStock <= prod.minStock ? 'text-amber-600' : 'text-slate-700'}`}>
                      {totalStock} {prod.unit}
                    </span>
                  </div>

                  {recommendedBatch && (
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      <span>FEFO Exp:</span>
                      <span className={`font-mono ${expiryStatus?.status === 'WARNING' ? 'text-amber-600 font-bold' : ''}`}>
                        {recommendedBatch.expiredDate}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-emerald-800 font-mono">
                      Rp {prod.sellPrice.toLocaleString('id-ID')}
                    </span>
                    <button
                      disabled={isOutOfStock}
                      className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Cart, Prescriptions & Checkout (40%) */}
      <div className="w-full lg:w-[420px] xl:w-[460px] bg-slate-50 border-t lg:border-t-0 flex flex-col h-full shadow-lg shrink-0">
        {/* Cart Header */}
        <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Keranjang Kasir</h3>
              <p className="text-[11px] text-slate-500">{cartItems.length} jenis item obat</p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>
          )}
        </div>

        {/* Prescription & Member Bar */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 space-y-2 text-xs shrink-0">
          {/* Member Picker */}
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedMember?.id || ''}
              onChange={(e) => {
                const mem = members.find((m) => m.id === e.target.value) || null;
                setSelectedMember(mem);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none"
            >
              <option value="">-- Pelanggan Umum (Non-Member) --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.tier} - Disc {m.discountPercent}%)
                </option>
              ))}
            </select>
          </div>

          {/* Resep Dokter Toggle Button */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-semibold text-slate-800">Layanan Resep Dokter</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrescriptionMode}
                onChange={(e) => setIsPrescriptionMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Prescription Inputs Expansion */}
          {isPrescriptionMode && (
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2 animate-in fade-in">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-emerald-900 font-semibold block">No. Resep R/</label>
                  <input
                    type="text"
                    value={prescriptionNumber}
                    onChange={(e) => setPrescriptionNumber(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-emerald-300 rounded bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-emerald-900 font-semibold block">Nama Pasien</label>
                  <input
                    type="text"
                    placeholder="Nama pasien..."
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-emerald-300 rounded bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-emerald-900 font-semibold block">Dokter Penulis Resep</label>
                <select
                  value={selectedDoctorName}
                  onChange={(e) => setSelectedDoctorName(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-emerald-300 rounded bg-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between text-[11px] text-emerald-900 pt-1 border-t border-emerald-200">
                <span>Tuslah Farmasi: <strong>Rp {customTuslah.toLocaleString('id-ID')}</strong></span>
                <span>Embalase: <strong>Rp {customEmbalase.toLocaleString('id-ID')}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-2">
              <ShoppingCart className="w-10 h-10 opacity-30" />
              <p className="text-xs">Keranjang masih kosong</p>
              <p className="text-[11px] text-slate-400">Pilih obat dari katalog di sebelah kiri untuk memulai</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.batch.id}`}
                className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-semibold text-xs text-slate-900 leading-snug">{item.product.name}</h5>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Batch: {item.batch.batchNumber} · Exp: {item.batch.expiredDate}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateQty(idx, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(idx, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] text-slate-500">{item.product.unit}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation Summary & Checkout Action */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2.5 shrink-0 shadow-lg">
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal Item:</span>
              <span className="font-mono">Rp {calculation.itemsSubtotal.toLocaleString('id-ID')}</span>
            </div>

            {calculation.memberDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon Member ({calculation.memberDiscountPercent}%):</span>
                <span className="font-mono">-Rp {calculation.memberDiscountAmount.toLocaleString('id-ID')}</span>
              </div>
            )}

            {isPrescriptionMode && (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>Jasa Tuslah Farmasi:</span>
                  <span className="font-mono">Rp {calculation.tuslahTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Embalase Wadah:</span>
                  <span className="font-mono">Rp {calculation.embalaseTotal.toLocaleString('id-ID')}</span>
                </div>
              </>
            )}

            {calculation.taxAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>PPN ({rules.ppnPercent}%):</span>
                <span className="font-mono">Rp {Math.round(calculation.taxAmount).toLocaleString('id-ID')}</span>
              </div>
            )}

            {calculation.roundingAmount !== 0 && (
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Pembulatan Kasir:</span>
                <span className="font-mono">+Rp {calculation.roundingAmount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Grand Total:</span>
              <span className="font-mono text-emerald-800 text-lg">
                Rp {calculation.grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            disabled={cartItems.length === 0}
            onClick={handleOpenPayment}
            className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              cartItems.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-[0.99]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Bayar (F9) · Rp {calculation.grandTotal.toLocaleString('id-ID')}</span>
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Pembayaran Kasir POS</h3>
                <p className="text-xs text-emerald-200">Selesaikan transaksi penjualan</p>
              </div>
              <button
                onClick={() => setIsPaymentOpen(false)}
                className="text-emerald-200 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Grand Total Display */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                  Total Tagihan
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-950 mt-0.5">
                  Rp {calculation.grandTotal.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Tunai', 'QRIS', 'Transfer Bank', 'Kartu Debit'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                        paymentMethod === method
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {method === 'Tunai' && <Banknote className="w-3.5 h-3.5" />}
                      {method === 'QRIS' && <QrCode className="w-3.5 h-3.5" />}
                      {method === 'Transfer Bank' && <CreditCard className="w-3.5 h-3.5" />}
                      {method === 'Kartu Debit' && <CreditCard className="w-3.5 h-3.5" />}
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash specific input & quick buttons */}
              {paymentMethod === 'Tunai' ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Uang Diterima dari Pasien (Rp)
                    </label>
                    <input
                      type="number"
                      value={amountPaid || ''}
                      onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-base font-bold font-mono border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-emerald-600"
                    />
                  </div>

                  {/* Quick cash amounts */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAmountPaid(calculation.grandTotal)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Uang Pas
                    </button>
                    <button
                      onClick={() => setAmountPaid(50000)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono"
                    >
                      50.000
                    </button>
                    <button
                      onClick={() => setAmountPaid(100000)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono"
                    >
                      100.000
                    </button>
                  </div>

                  {/* Kembalian */}
                  <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Kembalian:</span>
                    <strong className="font-mono text-sm text-emerald-800">
                      Rp {Math.max(0, amountPaid - calculation.grandTotal).toLocaleString('id-ID')}
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                  <p className="text-xs text-slate-600">Pembayaran non-tunai via {paymentMethod}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Pastikan mesin EDC / QRIS sudah terverifikasi berhasil
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setIsPaymentOpen(false)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleProcessCheckout}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan & Cetak Struk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS RECEIPT MODAL */}
      <POSReceiptModal
        transaction={completedTransaction}
        onClose={() => setCompletedTransaction(null)}
      />
    </div>
  );
};
