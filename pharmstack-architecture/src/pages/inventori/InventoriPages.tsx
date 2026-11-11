/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Penyesuaian Stok & Audit Stok & Konsinyasi Pages
 */

import React, { useState } from 'react';
import { SlidersHorizontal, FileText, Handshake, Plus, Check } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const PenyesuaianStokPage: React.FC = () => {
  const { products } = usePharmacy();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Penyesuaian Stok (Koreksi & Kerusakan)</h2>
          <p className="text-xs text-slate-500">Koreksi stok karena obat rusak, pecah, atau sampel pengujian</p>
        </div>
        <button className="px-3.5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Buat Penyesuaian Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-xs text-slate-600 space-y-3">
        <p className="font-semibold text-slate-800">Tata Kelola Mutasi Penyesuaian:</p>
        <p>Setiap penyesuaian stok akan dicatat dalam buku jurnal CoA dan mengurangi nilai aset persediaan secara terpusat.</p>
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-[11px] text-slate-500">
          Belum ada riwayat penyesuaian khusus pada periode ini.
        </div>
      </div>
    </div>
  );
};

export const AuditStokPage: React.FC = () => {
  const { sales, purchases, stockOpnameRecords } = usePharmacy();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Kartu Stok & Audit Mutasi</h2>
        <p className="text-xs text-slate-500">Audit log mutasi kronologis masuk dan keluar obat secara terpusat</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 font-bold text-sm text-slate-900">
          Riwayat Audit Terkini (Masuk & Keluar)
        </div>
        <div className="p-4 space-y-3 text-xs">
          {purchases.map((po) => (
            <div key={po.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-emerald-800 block">MUTASI MASUK (+): {po.invoiceNumber}</span>
                <span className="text-[11px] text-slate-500">{po.supplierName} · {po.date}</span>
              </div>
              <span className="font-mono font-bold text-emerald-800 text-xs">
                +Rp {po.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          ))}

          {sales.slice(0, 5).map((sale) => (
            <div key={sale.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 block">MUTASI KELUAR (PENJUALAN): {sale.invoiceNumber}</span>
                <span className="text-[11px] text-slate-500">{sale.date} · Kasir: {sale.cashierName}</span>
              </div>
              <span className="font-mono font-bold text-slate-800 text-xs">
                -Rp {sale.grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const KonsinyasiPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manajemen Obat Konsinyasi</h2>
          <p className="text-xs text-slate-500">Pengelolaan obat titipan pabrik/supplier dengan sistem bagi hasil margin</p>
        </div>
        <button className="px-3.5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Tambah Konsinyasi Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center text-slate-400 space-y-2 text-xs">
        <Handshake className="w-10 h-10 mx-auto opacity-30 text-emerald-600" />
        <p className="font-semibold text-slate-700">Modul Konsinyasi Terintegrasi</p>
        <p>Pencatatan obat titipan otomatis terpisah dari hutang dagang reguler dan dihitung saat terjual di kasir.</p>
      </div>
    </div>
  );
};
