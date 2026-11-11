/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Defecta Page - Buku Defecta & Pengadaan Obat Apotek
 */

import React, { useState } from 'react';
import { AlertTriangle, FileText, Printer, CheckCircle2, Truck, Plus } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const DefectaPage: React.FC = () => {
  const { defectaItems, suppliers, activeBranch } = usePharmacy();
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]?.name || '');
  const [showSpModal, setShowSpModal] = useState(false);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Buku Defecta (Stok Kritis & Pengadaan)</h2>
          <p className="text-xs text-slate-500">
            Daftar otomatis obat yang stoknya telah mencapai atau di bawah batas minimum (Safety Stock)
          </p>
        </div>

        <button
          onClick={() => setShowSpModal(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Cetak Surat Pesanan (SP)</span>
        </button>
      </div>

      {/* Summary Alert */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong className="block text-sm">Ada {defectaItems.length} obat yang perlu diorder segera!</strong>
            <span className="text-amber-800">
              Sistem membandingkan total stok fisik aktif dengan batas minimum masing-masing obat.
            </span>
          </div>
        </div>
        <span className="font-mono text-amber-900 font-bold text-sm bg-amber-100 px-3 py-1 rounded-lg">
          {defectaItems.length} Obat Kritis
        </span>
      </div>

      {/* Defecta Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Nama Obat</th>
                <th className="px-4 py-3">Golongan</th>
                <th className="px-4 py-3 text-center">Stok Minimal</th>
                <th className="px-4 py-3 text-center">Stok Saat Ini</th>
                <th className="px-4 py-3 text-center">Rekomendasi Pesan</th>
                <th className="px-4 py-3 text-center">Urgensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {defectaItems.map(({ product, totalStock, deficiency, urgency }) => (
                <tr key={product.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono font-medium text-slate-700">{product.sku}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{product.name}</span>
                    <span className="text-[10px] text-slate-500">{product.category} · Rak: {product.lokasiRak}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        product.golongan === 'Keras (G)' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {product.golongan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-medium text-slate-600">
                    {product.minStock} {product.unit}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-rose-600">
                    {totalStock} {product.unit}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-emerald-800">
                    +{(deficiency || 1) + 10} {product.unit}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        urgency === 'KRITIS'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {urgency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Surat Pesanan (SP) Preview Modal */}
      {showSpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-300" />
                <h3 className="font-bold text-sm">Surat Pesanan Obat (SP Standar Farmasi)</h3>
              </div>
              <button onClick={() => setShowSpModal(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="border-b border-slate-200 pb-3 text-center space-y-0.5">
                <h4 className="font-bold text-base text-slate-900 uppercase">{activeBranch.name}</h4>
                <p className="text-slate-600">{activeBranch.address} · Telp: {activeBranch.phone}</p>
                <p className="text-[10px] text-slate-500">APA: {activeBranch.pharmacistInCharge} · SIPA: {activeBranch.sipaNumber}</p>
              </div>

              <div className="text-center font-bold text-sm text-slate-900 underline">
                SURAT PESANAN OBAT REGULER / BEBAS
              </div>

              <div className="space-y-1 text-slate-700">
                <div>Kepada Yth: <strong>{selectedSupplier}</strong></div>
                <div>Harap dikirimkan obat-obatan pesanan berikut ini:</div>
              </div>

              <table className="w-full border border-slate-200 text-left">
                <thead className="bg-slate-100 text-slate-700 text-[10px] font-bold">
                  <tr>
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Nama Obat & Dosis</th>
                    <th className="p-2 border">Bentuk Sediaan</th>
                    <th className="p-2 border text-center">Jumlah Pesan</th>
                  </tr>
                </thead>
                <tbody>
                  {defectaItems.map((item, idx) => (
                    <tr key={item.product.id}>
                      <td className="p-2 border text-center">{idx + 1}</td>
                      <td className="p-2 border font-medium">{item.product.name}</td>
                      <td className="p-2 border">{item.product.unit}</td>
                      <td className="p-2 border text-center font-bold font-mono">
                        {(item.deficiency || 1) + 10} {item.product.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-6 flex justify-between text-center text-slate-700">
                <div className="w-40">
                  <p className="text-[10px]">Penerima Distributor,</p>
                  <div className="h-14"></div>
                  <p className="border-t border-slate-300 pt-1 font-semibold">( Sales / PBF )</p>
                </div>
                <div className="w-48">
                  <p className="text-[10px]">Apoteker Penanggung Jawab,</p>
                  <div className="h-14"></div>
                  <p className="border-t border-slate-300 pt-1 font-bold">{activeBranch.pharmacistInCharge}</p>
                  <p className="text-[9px] text-slate-500">{activeBranch.sipaNumber}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setShowSpModal(false)}
                className="flex-1 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar SP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
