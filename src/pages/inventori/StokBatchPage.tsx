/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Stok & Batch Page - FEFO Monitoring Apotek Hifzi Farma
 */

import React, { useState } from 'react';
import { Boxes, Search, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { PharmacyRules } from '../../core/business-rules';

export const StokBatchPage: React.FC = () => {
  const { products, rules } = usePharmacy();
  const [filterExp, setFilterExp] = useState<'all' | 'warning' | 'safe'>('all');
  const [search, setSearch] = useState('');

  const allBatches = products.flatMap((p) =>
    p.batches.map((b) => {
      const status = PharmacyRules.checkBatchStatus(b, rules.nearExpiryThresholdDays);
      return {
        product: p,
        batch: b,
        ...status,
      };
    })
  );

  const filtered = allBatches.filter((item) => {
    const matchSearch =
      item.product.name.toLowerCase().includes(search.toLowerCase()) ||
      item.batch.batchNumber.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (filterExp === 'warning') return item.status === 'WARNING' || item.status === 'EXPIRED';
    if (filterExp === 'safe') return item.status === 'SAFE';
    return true;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manajemen Stok & Batch (FEFO Tracker)</h2>
          <p className="text-xs text-slate-500">
            First Expired First Out: Monitoring tanggal kadaluwarsa per batch obat secara terpusat
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari obat / no batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="flex gap-1 p-1 bg-slate-200 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterExp('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterExp === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterExp('warning')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterExp === 'warning' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Waspada Expired
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Nama Obat</th>
                <th className="px-4 py-3">Nomor Batch</th>
                <th className="px-4 py-3">Tgl Kadaluwarsa</th>
                <th className="px-4 py-3">Sisa Hari</th>
                <th className="px-4 py-3 text-right">Stok Fisik</th>
                <th className="px-4 py-3 text-right">HPP Satuan</th>
                <th className="px-4 py-3 text-right">Valuasi Batch</th>
                <th className="px-4 py-3 text-center">Status FEFO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={`${item.product.id}-${item.batch.id}`} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{item.product.name}</span>
                    <span className="text-[10px] text-slate-500">{item.product.sku} · {item.product.category}</span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{item.batch.batchNumber}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{item.batch.expiredDate}</td>
                  <td className="px-4 py-3 font-mono font-semibold">
                    <span className={item.daysLeft <= 90 ? 'text-rose-600' : 'text-slate-700'}>
                      {item.daysLeft} hari
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {item.batch.stock} {item.product.unit}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600">
                    Rp {item.batch.buyPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800">
                    Rp {(item.batch.stock * item.batch.buyPrice).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        item.status === 'EXPIRED'
                          ? 'bg-rose-600 text-white'
                          : item.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
