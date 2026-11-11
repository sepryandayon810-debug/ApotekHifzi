/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Stok Opname Page - Apotek Hifzi Farma
 */

import React, { useState } from 'react';
import { ClipboardCheck, Plus, Check } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const StokOpnamePage: React.FC = () => {
  const { products, stockOpnameRecords, addStockOpname } = usePharmacy();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [productId, setProductId] = useState(products[0]?.id || '');
  const [physicalCount, setPhysicalCount] = useState<number>(0);
  const [notes, setNotes] = useState('Pemeriksaan fisik rak reguler');

  const selectedProduct = products.find((p) => p.id === productId);
  const selectedBatch = selectedProduct?.batches[0];

  const handleOpenModal = () => {
    if (selectedBatch) {
      setPhysicalCount(selectedBatch.stock);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedBatch) return;

    const diff = physicalCount - selectedBatch.stock;
    const lossValue = diff < 0 ? Math.abs(diff) * selectedBatch.buyPrice : 0;

    addStockOpname({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      batchNumber: selectedBatch.batchNumber,
      systemStock: selectedBatch.stock,
      physicalStock: physicalCount,
      difference: diff,
      hpp: selectedBatch.buyPrice,
      lossValue,
      auditor: 'apt. Sepryanda Yon',
      notes,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Stok Opname Fisik Apotek</h2>
          <p className="text-xs text-slate-500">
            Penyesuaian stok sistem dengan hitung fisik riil di rak & lemari penyimpanan
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Input Hasil Opname</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Obat & Batch</th>
                <th className="px-4 py-3 text-center">Stok Sistem</th>
                <th className="px-4 py-3 text-center">Stok Fisik</th>
                <th className="px-4 py-3 text-center">Selisih</th>
                <th className="px-4 py-3 text-right">Nilai Kerugian/Selisih</th>
                <th className="px-4 py-3">Auditor</th>
                <th className="px-4 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockOpnameRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono text-slate-500">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{r.productName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Batch: {r.batchNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-medium">{r.systemStock}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">{r.physicalStock}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold">
                    {r.difference === 0 ? (
                      <span className="text-emerald-700">0 (Cocok)</span>
                    ) : r.difference > 0 ? (
                      <span className="text-blue-700">+{r.difference}</span>
                    ) : (
                      <span className="text-rose-700">{r.difference}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    Rp {r.lossValue.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.auditor}</td>
                  <td className="px-4 py-3 text-slate-500">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Opname Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Pencatatan Hasil Hitung Fisik</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Produk</label>
                <select
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    const p = products.find((prod) => prod.id === e.target.value);
                    if (p && p.batches[0]) setPhysicalCount(p.batches[0].stock);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stok Sistem: {p.batches[0]?.stock || 0} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Jumlah Hitung Fisik Riil di Rak ({selectedProduct?.unit})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={physicalCount}
                  onChange={(e) => setPhysicalCount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-base font-bold font-mono border border-slate-300 rounded-xl bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Auditor</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Simpan & Update Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
