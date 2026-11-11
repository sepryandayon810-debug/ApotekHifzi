/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Riwayat Kasir Page - Apotek Hifzi Farma
 */

import React, { useState } from 'react';
import { History, Search, Printer, Eye, Filter, Calendar } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { SaleTransaction } from '../../types/pharmacy';
import { POSReceiptModal } from '../../components/pos/POSReceiptModal';

export const RiwayatKasirPage: React.FC = () => {
  const { sales } = usePharmacy();
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<SaleTransaction | null>(null);

  const filteredSales = sales.filter((s) => {
    return (
      s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.cashierName.toLowerCase().includes(search.toLowerCase()) ||
      (s.memberName && s.memberName.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi Kasir</h2>
          <p className="text-xs text-slate-500">Daftar seluruh nota penjualan obat dan resep</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari No. Nota, Pasien, Kasir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">No. Nota</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Kasir</th>
                <th className="px-4 py-3">Pasien / Member</th>
                <th className="px-4 py-3">Item Obat</th>
                <th className="px-4 py-3">Metode</th>
                <th className="px-4 py-3 text-right">Total Akhir</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {sale.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{sale.date}</td>
                  <td className="px-4 py-3 text-slate-700">{sale.cashierName}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {sale.memberName || 'Pelanggan Umum'}
                    {sale.prescription && (
                      <span className="block text-[10px] text-emerald-700 font-medium">
                        Resep: {sale.prescription.doctorName}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {sale.items.length} item ({sale.items.map((i) => i.product.name).join(', ')})
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{sale.paymentMethod}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    Rp {sale.grandTotal.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedTx(sale)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Cetak Struk</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <POSReceiptModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
};
