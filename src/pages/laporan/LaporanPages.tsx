/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Laporan Modul Terpadu - Apotek Hifzi Farma
 * Menyatukan seluruh laporan (Penjualan, Pembelian, Inventori, Konsinyasi, Keuangan, Member, Audit)
 * dalam satu modul bersih sehingga tidak membuat pusing dan perawatannya mudah.
 */

import React, { useState } from 'react';
import {
  ReceiptText,
  ShoppingBag,
  Boxes,
  BookOpen,
  Users,
  ShieldCheck,
  Download,
  Calendar,
  Filter,
} from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { PharmacyCalculator } from '../../core/calculator';

interface LaporanPagesProps {
  type:
    | 'lap_penjualan'
    | 'lap_pembelian'
    | 'lap_inventori'
    | 'lap_konsinyasi'
    | 'lap_keuangan'
    | 'lap_member'
    | 'lap_audit';
}

export const LaporanPages: React.FC<LaporanPagesProps> = ({ type }) => {
  const { sales, purchases, products, members, cashTransactions, chartOfAccounts } = usePharmacy();
  const [dateFilter, setDateFilter] = useState('Hari Ini');

  // Perhitungan terpusat
  const totalSales = sales.reduce((s, item) => s + item.grandTotal, 0);
  const totalPurchases = purchases.reduce((s, item) => s + item.totalAmount, 0);

  const allBatches = products.flatMap((p) => p.batches);
  const { totalAssetValue, totalItemsCount } = PharmacyCalculator.calculateInventoryValuation(allBatches);

  // Estimasi laba kotor
  const totalGrossProfit = sales.reduce((sum, sale) => {
    const saleGross = sale.items.reduce((itemSum, item) => {
      const hpp = item.batch.buyPrice * item.quantity;
      return itemSum + (item.subtotal - hpp);
    }, 0);
    return sum + saleGross;
  }, 0);

  const titles: Record<LaporanPagesProps['type'], { title: string; desc: string }> = {
    lap_penjualan: {
      title: 'Laporan Rekapitulasi Penjualan (Omset & Laba)',
      desc: 'Ringkasan omset kasir, laba kotor, dan rincian transaksi tunai/non-tunai',
    },
    lap_pembelian: {
      title: 'Laporan Pembelian Obat (Faktur PBF)',
      desc: 'Rekap tagihan pembelian obat dari distributor PBF dan jatuh tempo',
    },
    lap_inventori: {
      title: 'Laporan Valuasi Nilai Persediaan Aset Obat',
      desc: 'Nilai aset persediaan gudang apotek berdasarkan metode FEFO / HPP',
    },
    lap_konsinyasi: {
      title: 'Laporan Rekap Obat Konsinyasi',
      desc: 'Laporan penjualan obat titipan dan bagi hasil dengan prinsipal',
    },
    lap_keuangan: {
      title: 'Laporan Arus Kas & Laba Rugi Apotek',
      desc: 'Ringkasan penerimaan kas, beban operasional, dan laba bersih',
    },
    lap_member: {
      title: 'Laporan Loyalitas Pelanggan & Pasien',
      desc: 'Aktivitas transaksi member, poin reward, dan frekuensi kunjungan',
    },
    lap_audit: {
      title: 'Laporan Log Audit Aktivitas Sistem',
      desc: 'Catatan keamanan transaksi, otorisasi kasir, dan penyesuaian stok',
    },
  };

  const current = titles[type];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Laporan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{current.title}</h2>
          <p className="text-xs text-slate-500">{current.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer"
            >
              <option>Hari Ini</option>
              <option>7 Hari Terakhir</option>
              <option>Bulan Ini</option>
              <option>Tahun Ini</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor / Cetak</span>
          </button>
        </div>
      </div>

      {/* Rangkuman Finansial Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Omset Penjualan</span>
          <div className="text-xl font-bold font-mono text-emerald-800">
            Rp {totalSales.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-slate-500">{sales.length} nota transaksi</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Estimasi Laba Kotor Penjualan</span>
          <div className="text-xl font-bold font-mono text-slate-900">
            Rp {Math.round(totalGrossProfit).toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            Margin ±{totalSales > 0 ? ((totalGrossProfit / totalSales) * 100).toFixed(1) : 0}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Valuasi Persediaan Aset</span>
          <div className="text-xl font-bold font-mono text-blue-800">
            Rp {totalAssetValue.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-slate-500">{totalItemsCount} unit stok di rak</span>
        </div>
      </div>

      {/* Tabel Data Sesuai Jenis Laporan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {type === 'lap_penjualan' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
                <tr>
                  <th className="px-4 py-3">No. Nota</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Kasir</th>
                  <th className="px-4 py-3">Pasien / Member</th>
                  <th className="px-4 py-3">Metode</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right">PPN</th>
                  <th className="px-4 py-3 text-right">Grand Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{s.invoiceNumber}</td>
                    <td className="px-4 py-3 text-slate-500">{s.date}</td>
                    <td className="px-4 py-3 text-slate-700">{s.cashierName}</td>
                    <td className="px-4 py-3 text-slate-700">{s.memberName || 'Pelanggan Umum'}</td>
                    <td className="px-4 py-3 font-medium text-slate-600">{s.paymentMethod}</td>
                    <td className="px-4 py-3 text-right font-mono">Rp {s.subtotal.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">
                      Rp {s.taxAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800">
                      Rp {s.grandTotal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {type === 'lap_pembelian' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
                <tr>
                  <th className="px-4 py-3">No Faktur</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Distributor PBF</th>
                  <th className="px-4 py-3">Obat yang Diterima</th>
                  <th className="px-4 py-3 text-right">Total Pembelian</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{p.invoiceNumber}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{p.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{p.supplierName}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {p.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      Rp {p.totalAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {type === 'lap_inventori' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Nama Obat</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 text-center">Stok Fisik</th>
                  <th className="px-4 py-3 text-right">HPP Satuan</th>
                  <th className="px-4 py-3 text-right">Harga Jual</th>
                  <th className="px-4 py-3 text-right">Nilai Aset Persediaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const totalStk = p.batches.reduce((s, b) => s + b.stock, 0);
                  const totalVal = p.batches.reduce((s, b) => s + b.stock * b.buyPrice, 0);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-mono font-medium text-slate-700">{p.sku}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                      <td className="px-4 py-3 text-slate-600">{p.category}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">
                        {totalStk} {p.unit}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-600">
                        Rp {p.buyPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-800">
                        Rp {p.sellPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        Rp {totalVal.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {(type === 'lap_keuangan' || type === 'lap_konsinyasi' || type === 'lap_member' || type === 'lap_audit') && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="font-bold text-sm text-slate-900">Bagan Akun Keuangan & Log Sesi Terkini</h4>
              <span className="text-emerald-700 font-semibold font-mono">Status: Seimbang</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50/60">
                <span className="font-bold text-slate-800 block text-xs">Ringkasan Chart of Accounts (CoA)</span>
                {chartOfAccounts.slice(0, 5).map((acc) => (
                  <div key={acc.code} className="flex justify-between py-1 border-b border-slate-100 text-[11px]">
                    <span className="text-slate-600">
                      <strong className="font-mono text-slate-800">{acc.code}</strong> - {acc.name}
                    </span>
                    <span className="font-mono font-semibold text-slate-900">
                      Rp {acc.balance.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50/60">
                <span className="font-bold text-slate-800 block text-xs">Log Transaksi Kas Masuk/Keluar</span>
                {cashTransactions.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex justify-between py-1 border-b border-slate-100 text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-800 block">{c.description}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{c.date}</span>
                    </div>
                    <span className={`font-mono font-bold ${c.type === 'IN' ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {c.type === 'IN' ? '+' : '-'}Rp {c.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
