/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Sesi Kasir Page - Operasional Apotek Hifzi Farma
 * Rekonsiliasi kas terpusat & tutup shift
 */

import React, { useState } from 'react';
import { ReceiptText, CheckCircle2, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const SesiKasirPage: React.FC = () => {
  const { currentShift, shifts, closeShift, sales } = usePharmacy();
  const [actualCash, setActualCash] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState('');
  const [closedSummary, setClosedSummary] = useState<any>(null);

  // Sales for current shift
  const currentShiftSales = currentShift
    ? sales.filter((s) => s.shiftId === currentShift.id && s.status === 'PAID')
    : [];
  const currentCashTotal = currentShiftSales
    .filter((s) => s.paymentMethod === 'Tunai')
    .reduce((sum, s) => sum + s.grandTotal, 0);

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    const result = closeShift(actualCash, closingNotes);
    setClosedSummary(result);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Sesi Kasir & Rekonsiliasi Kas</h2>
        <p className="text-xs text-slate-500">
          Monitoring perputaran uang tunai laci kasir dan penutupan shift kasir
        </p>
      </div>

      {currentShift ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Shift Berjalan</h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                AKTIF
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Kasir:</span>
                <strong className="text-slate-900">{currentShift.cashierName}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Dibuka Sejak:</span>
                <span className="font-mono text-slate-800">{currentShift.startTime}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Modal Awal:</span>
                <span className="font-mono font-medium">Rp {currentShift.startingCash.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Penjualan Tunai:</span>
                <span className="font-mono font-medium text-emerald-700">
                  +Rp {currentCashTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>Target Kas Fisik:</span>
                <span className="font-mono text-emerald-800 text-sm">
                  Rp {currentShift.closingCashCalculated.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Form Tutup Shift */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Form Rekonsiliasi & Tutup Shift Kasir
            </h3>

            <form onSubmit={handleCloseShift} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Hitung Fisik Uang Tunai di Laci Kasir (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  value={actualCash || ''}
                  onChange={(e) => setActualCash(Number(e.target.value) || 0)}
                  placeholder="Masukkan total uang fisik hasil hitung..."
                  className="w-full px-3 py-2 text-base font-bold font-mono border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                />
              </div>

              {actualCash > 0 && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between font-semibold ${
                    actualCash === currentShift.closingCashCalculated
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : actualCash > currentShift.closingCashCalculated
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  <span>Selisih Rekonsiliasi Kas:</span>
                  <span className="font-mono text-sm">
                    {actualCash === currentShift.closingCashCalculated
                      ? 'SEIMBANG (Rp 0)'
                      : actualCash > currentShift.closingCashCalculated
                      ? `LEBIH (+Rp ${(actualCash - currentShift.closingCashCalculated).toLocaleString('id-ID')})`
                      : `KURANG (-Rp ${(currentShift.closingCashCalculated - actualCash).toLocaleString('id-ID')})`}
                  </span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Serah Terima</label>
                <input
                  type="text"
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Contoh: Selisih uang receh parkir, laci rapi"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold shadow-xs transition-colors"
              >
                Tutup Shift & Rekonsiliasi Kas
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
          Tidak ada shift kasir yang sedang aktif saat ini.
        </div>
      )}

      {/* Riwayat Shift Terdahulu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 font-bold text-sm text-slate-900">
          Riwayat Seluruh Shift Kasir
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Kasir</th>
                <th className="px-4 py-3">Mulai</th>
                <th className="px-4 py-3">Selesai</th>
                <th className="px-4 py-3 text-right">Modal Awal</th>
                <th className="px-4 py-3 text-right">Kas Sistem</th>
                <th className="px-4 py-3 text-right">Kas Fisik</th>
                <th className="px-4 py-3 text-right">Selisih</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shifts.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-semibold text-slate-900">{s.cashierName}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{s.startTime}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{s.endTime || '-'}</td>
                  <td className="px-4 py-3 text-right font-mono">Rp {s.startingCash.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-right font-mono font-medium">
                    Rp {s.closingCashCalculated.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium">
                    {s.closingCashActual ? `Rp ${s.closingCashActual.toLocaleString('id-ID')}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold">
                    {s.difference !== undefined ? (
                      <span className={s.difference === 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        Rp {s.difference.toLocaleString('id-ID')}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {s.status}
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
