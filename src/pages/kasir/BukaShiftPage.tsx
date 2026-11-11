/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Buka Shift Page - Apotek Hifzi Farma
 */

import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

interface BukaShiftPageProps {
  onNavigateToPOS: () => void;
}

export const BukaShiftPage: React.FC<BukaShiftPageProps> = ({ onNavigateToPOS }) => {
  const { currentShift, openShift } = usePharmacy();
  const [cashierName, setCashierName] = useState('Sepryanda Yon');
  const [startingCash, setStartingCash] = useState<number>(500000);
  const [notes, setNotes] = useState('Shift Pagi Reguler');

  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    openShift(startingCash, cashierName, notes);
    onNavigateToPOS();
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Buka Shift Kasir</h2>
            <p className="text-xs text-slate-500">
              Registrasi modal awal kasir dan aktifkan sesi penjualan POS
            </p>
          </div>
        </div>

        {currentShift ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Shift Kasir Sedang Aktif</span>
            </div>
            <div className="space-y-2 text-xs text-emerald-950">
              <div className="flex justify-between">
                <span>Nama Kasir:</span>
                <strong>{currentShift.cashierName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Waktu Buka:</span>
                <span className="font-mono">{currentShift.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Modal Awal Kas:</span>
                <span className="font-mono font-bold">Rp {currentShift.startingCash.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-t border-emerald-200 pt-2 font-semibold">
                <span>Kas Terhitung Sistem:</span>
                <span className="font-mono text-emerald-800 text-sm">
                  Rp {currentShift.closingCashCalculated.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={onNavigateToPOS}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Lanjut ke Layar Kasir POS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleOpenShift} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Kasir Bertugas
              </label>
              <input
                type="text"
                required
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Modal Awal Cash Drawer (Rp)
              </label>
              <input
                type="number"
                required
                min="0"
                step="10000"
                value={startingCash}
                onChange={(e) => setStartingCash(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-base font-bold font-mono border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-emerald-600"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Uang receh pecahan kecil di laci kasir saat awal shift.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Catatan Shift (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Shift Pagi, pergantian laci A"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <Clock className="w-4 h-4" />
              <span>Buka Shift & Masuk POS</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
