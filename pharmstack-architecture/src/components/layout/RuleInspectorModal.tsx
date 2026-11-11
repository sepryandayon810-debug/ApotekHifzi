/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Centralized Rules & Calculations Inspector
 * 
 * Memperlihatkan dan menguji secara live arsitektur perhitungan dan aturan bisnis terpusat.
 * Ketika rule diubah di sini, seluruh menu (POS, Master Obat, Laporan, Stok) otomatis
 * mengikuti rumus baru tanpa menyentuh kode HTML masing-masing halaman.
 */

import React, { useState } from 'react';
import { X, Check, RefreshCw, Sparkles, Sliders, ShieldCheck, Calculator, ArrowRight, Layers } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { PharmacyCalculator } from '../../core/calculator';

interface RuleInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RuleInspectorModal: React.FC<RuleInspectorModalProps> = ({ isOpen, onClose }) => {
  const { rules, updateRulesConfig, resetRulesToDefault } = usePharmacy();

  // Local state for live testing
  const [testHpp, setTestHpp] = useState<number>(10000);
  const [testMargin, setTestMargin] = useState<number>(rules.defaultMarginOtc);
  const [savedAlert, setSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = (updates: Parameters<typeof updateRulesConfig>[0]) => {
    updateRulesConfig(updates);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  // Test simulation result
  const calculatedSellPrice = PharmacyCalculator.calculateSellingPrice(
    testHpp,
    testMargin,
    rules.roundingStep
  );
  const profitMargin = PharmacyCalculator.calculateProfitMargin(testHpp, calculatedSellPrice);
  const grossProfit = PharmacyCalculator.calculateGrossProfit(testHpp, calculatedSellPrice, 1);
  const simulatedPpn = (calculatedSellPrice * rules.ppnPercent) / 100;
  const simulatedTotalWithPpn = calculatedSellPrice + simulatedPpn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900/80 rounded-lg">
              <Sliders className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Pusat Kontrol Aturan & Kalkulasi Terpusat (Central Rules Engine)
              </h2>
              <p className="text-xs text-emerald-100/90">
                Single Source of Truth: Ubah di sini, seluruh menu apotek otomatis sinkron seketika.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Architecture Explanation Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-900 text-sm">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Solusi Arsitektur Senior Software Engineer: Separation of Concerns</span>
            </div>
            <p className="leading-relaxed">
              Sesuai instruksi Anda: <strong>HTML masing-masing page hanya mengambil data dan style visual</strong>. 
              Rumus margin, PPN, Tuslah resep, Embalase, pembulatan kelipatan ratusan, hingga aturan FEFO 
              dikelola di modul terpusat (<strong>/src/core/calculator.ts</strong> & <strong>/src/core/business-rules.ts</strong>).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="font-semibold text-slate-900 block">1. Central Store</span>
                <span className="text-slate-600">Single state repository & event emitter.</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="font-semibold text-slate-900 block">2. Calculator Engine</span>
                <span className="text-slate-600">Kalkulasi harga, PPN, Tuslah & Diskon.</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="font-semibold text-slate-900 block">3. Business Rules</span>
                <span className="text-slate-600">Validasi FEFO, Expired & Safety Stock.</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="font-semibold text-slate-900 block">4. Clean View/Page</span>
                <span className="text-slate-600">Bebas kalkulasi, mudah jika ubah fitur.</span>
              </div>
            </div>
          </div>

          {savedAlert && (
            <div className="p-3 bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Aturan terpusat berhasil diperbarui! Seluruh menu telah dikalkulasi ulang otomatis.</span>
            </div>
          )}

          {/* Form Rules Terpusat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: Pajak & Pembulatan */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Pajak (PPN) & Pembulatan Kasir</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Persentase PPN (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={rules.ppnPercent}
                    onChange={(e) => handleUpdate({ ppnPercent: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono"
                  />
                  <span className="text-xs font-medium text-slate-500">%</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Standar UU HPP RI: 11%. Otomatis diaplikasikan ke faktur POS.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelipatan Pembulatan Kasir (Rp)
                </label>
                <select
                  value={rules.roundingStep}
                  onChange={(e) => handleUpdate({ roundingStep: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value={100}>Rp 100 (Standar retail farmasi)</option>
                  <option value={500}>Rp 500</option>
                  <option value={1000}>Rp 1.000</option>
                  <option value={0}>Tanpa Pembulatan (Nol)</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Membulatkan nominal ganjil ke atas agar memudahkan kembalian tunai.
                </span>
              </div>
            </div>

            {/* Box 2: Margin Harga Standar */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Margin Keuntungan Standar Obat</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Margin Obat Bebas (OTC)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      value={rules.defaultMarginOtc}
                      onChange={(e) => handleUpdate({ defaultMarginOtc: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono"
                    />
                    <span className="text-xs font-medium text-slate-500">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Margin Obat Keras (G)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      value={rules.defaultMarginKeras}
                      onChange={(e) => handleUpdate({ defaultMarginKeras: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono"
                    />
                    <span className="text-xs font-medium text-slate-500">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Margin Obat Racik Resep
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    value={rules.defaultMarginResep}
                    onChange={(e) => handleUpdate({ defaultMarginResep: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono"
                  />
                  <span className="text-xs font-medium text-slate-500">%</span>
                </div>
              </div>
            </div>

            {/* Box 3: Biaya Pelayanan Farmasi (Tuslah & Embalase) */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pelayanan Resep Dokter (Tuslah & Embalase)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tuslah Resep Standar (Rp)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={rules.tuslahResepStandard}
                    onChange={(e) => handleUpdate({ tuslahResepStandard: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Jasa apoteker per R/</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Embalase Wadah (Rp)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={rules.embalaseStandard}
                    onChange={(e) => handleUpdate({ embalaseStandard: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Biaya wadah/klip/pot</span>
                </div>
              </div>
            </div>

            {/* Box 4: Aturan Inventori & FEFO */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>Aturan FEFO & Ambang Batas Expired</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ambang Batas Peringatan Expired (Hari)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="15"
                    max="365"
                    value={rules.nearExpiryThresholdDays}
                    onChange={(e) => handleUpdate({ nearExpiryThresholdDays: Number(e.target.value) || 90 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono"
                  />
                  <span className="text-xs font-medium text-slate-500">Hari</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Batch dengan sisa &le; {rules.nearExpiryThresholdDays} hari masuk status Waspada FEFO.
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Playground (Live Sandbox) */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Simulasi Live: Pengujian Formula Terpusat</span>
            </h3>
            <div className="bg-slate-900 text-white rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tes Input HPP (Rp):</label>
                <input
                  type="number"
                  step="1000"
                  value={testHpp}
                  onChange={(e) => setTestHpp(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tes Target Margin (%):</label>
                <input
                  type="number"
                  value={testMargin}
                  onChange={(e) => setTestMargin(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Harga Jual Hasil Rule:</span>
                  <strong className="text-emerald-400 font-mono text-sm">
                    Rp {calculatedSellPrice.toLocaleString('id-ID')}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Laba Kotor Satuan:</span>
                  <span className="font-mono text-slate-200">Rp {grossProfit.toLocaleString('id-ID')} ({profitMargin}%)</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Jika Termasuk PPN ({rules.ppnPercent}%):</span>
                  <span className="font-mono text-slate-200">Rp {Math.round(simulatedTotalWithPpn).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={resetRulesToDefault}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset ke Default Farmasi</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Simpan & Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
