/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Dashboard Page - Apotek Hifzi Farma
 * Menampilkan ringkasan metrik kasir, inventori defecta, dan peringatan FEFO
 */

import React from 'react';
import {
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Clock,
  Boxes,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Sliders,
  DollarSign,
  Pill,
} from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { PharmacyCalculator } from '../../core/calculator';
import { NavMenuId } from '../../components/layout/Sidebar';

interface DashboardPageProps {
  onNavigate: (menu: NavMenuId) => void;
  onOpenRuleInspector: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onOpenRuleInspector }) => {
  const { sales, products, defectaItems, nearExpiryBatches, currentShift, rules } = usePharmacy();

  // Metrics calculation
  const todaySales = sales.filter((s) => s.status === 'PAID');
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.grandTotal, 0);
  const todayTransactionsCount = todaySales.length;

  // Valuasi total aset obat terpusat
  const allBatches = products.flatMap((p) => p.batches);
  const { totalAssetValue, totalItemsCount } = PharmacyCalculator.calculateInventoryValuation(allBatches);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Notice: Central Architecture */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
              Sistem Terpusat Aktif
            </span>
            <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-full text-emerald-100 border border-emerald-500/30">
              v2.4 Production
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold">
            Selamat Datang di Sistem Manajemen Apotek Hifzi Farma
          </h2>
          <p className="text-xs text-emerald-200/90 max-w-2xl">
            Perhitungan harga jual, PPN {rules.ppnPercent}%, pembulatan Rp {rules.roundingStep}, 
            tarif resep (Tuslah/Embalase), dan aturan FEFO berjalan secara <strong>terpusat</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRuleInspector}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Sliders className="w-4 h-4 text-emerald-300" />
            <span>Atur Rule Bisnis</span>
          </button>
          <button
            onClick={() => onNavigate('pos')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buka POS Kasir</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Omset Hari Ini */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Omset Penjualan</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-slate-900 font-mono">
            Rp {todayRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">{todayTransactionsCount} transaksi</span>
            <span>hari ini</span>
          </div>
        </div>

        {/* Total Aset Persediaan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Valuasi Persediaan</span>
            <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-slate-900 font-mono">
            Rp {totalAssetValue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500">
            {totalItemsCount} unit dari {products.length} master item
          </div>
        </div>

        {/* Peringatan Defecta */}
        <div
          onClick={() => onNavigate('defecta')}
          className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-2 cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="text-amber-800 font-semibold">Buku Defecta (Order)</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-amber-700 font-mono">
            {defectaItems.length} Obat
          </div>
          <div className="text-[11px] text-amber-700 flex items-center justify-between">
            <span>Stok di bawah batas minimal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Peringatan FEFO / Near Expired */}
        <div
          onClick={() => onNavigate('stok_batch')}
          className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs space-y-2 cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="text-rose-800 font-semibold">Peringatan Expired (FEFO)</span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-rose-700 font-mono">
            {nearExpiryBatches.length} Batch
          </div>
          <div className="text-[11px] text-rose-700 flex items-center justify-between">
            <span>&lt; {rules.nearExpiryThresholdDays} hari kadaluwarsa</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transaksi Kasir Terkini (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Riwayat Penjualan Terkini</h3>
              <p className="text-xs text-slate-500">Transaksi kasir real-time dari shift berjalan</p>
            </div>
            <button
              onClick={() => onNavigate('riwayat_kasir')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
                <tr>
                  <th className="px-4 py-3">No. Nota</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Pasien / Member</th>
                  <th className="px-4 py-3">Metode</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-900">
                      {sale.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{sale.date.split(' ')[1]}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {sale.memberName || 'Pelanggan Umum'}
                      {sale.prescription && (
                        <span className="block text-[10px] text-emerald-700 font-medium">
                          Resep: {sale.prescription.doctorName}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{sale.paymentMethod}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      Rp {sale.grandTotal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Status Shift & Defecta Alert */}
        <div className="space-y-6">
          {/* Shift Status Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Sesi Shift Kasir</h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {currentShift ? 'AKTIF' : 'TUTUP'}
              </span>
            </div>

            {currentShift ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Kasir Bertugas:</span>
                  <strong className="text-slate-900">{currentShift.cashierName}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mulai Jam:</span>
                  <span className="font-mono text-slate-800">{currentShift.startTime}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Modal Awal Kas:</span>
                  <span className="font-mono font-medium text-slate-900">
                    Rp {currentShift.startingCash.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-2 font-semibold">
                  <span>Total Kas Sistem:</span>
                  <span className="font-mono text-emerald-700 text-sm">
                    Rp {currentShift.closingCashCalculated.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('sesi_kasir')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-xs transition-colors mt-2"
                >
                  Kelola / Tutup Shift
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-slate-500">
                  Belum ada shift kasir yang aktif saat ini. Buka shift untuk memulai transaksi kasir POS.
                </p>
                <button
                  onClick={() => onNavigate('buka_shift')}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
                >
                  Buka Shift Kasir Sekarang
                </button>
              </div>
            )}
          </div>

          {/* Quick Defecta Alert Card */}
          <div className="bg-amber-50/60 rounded-xl border border-amber-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Perlu Dipesan (Defecta)</span>
              </div>
              <span className="text-xs font-bold text-amber-700 font-mono">
                {defectaItems.length} item
              </span>
            </div>

            <div className="space-y-2">
              {defectaItems.slice(0, 3).map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white p-2.5 rounded-lg border border-amber-200/60 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-800 block">{item.product.name}</span>
                    <span className="text-[10px] text-slate-500">
                      Sisa: <strong className="text-amber-700">{item.totalStock}</strong> (Min: {item.product.minStock})
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    {item.urgency}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('defecta')}
              className="w-full py-1.5 text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center justify-center gap-1"
            >
              <span>Buat Surat Pesanan (SP)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
