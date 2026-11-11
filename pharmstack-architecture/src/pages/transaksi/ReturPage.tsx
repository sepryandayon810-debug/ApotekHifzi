/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Retur Page - Retur Obat Pasien & Retur ke Distributor PBF
 */

import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Plus, Check } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const ReturPage: React.FC = () => {
  const { products, suppliers } = usePharmacy();
  const [activeTab, setActiveTab] = useState<'pbf' | 'pasien'>('pbf');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manajemen Retur Obat</h2>
          <p className="text-xs text-slate-500">
            Retur obat rusak/expired ke PBF dan klaim retur dari pasien apotek
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pbf')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'pbf' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Retur ke PBF (Distributor)
          </button>
          <button
            onClick={() => setActiveTab('pasien')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'pasien' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Retur dari Pasien
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900">
            {activeTab === 'pbf' ? 'Daftar Pengajuan Retur ke PBF' : 'Daftar Retur Pasien'}
          </h3>
          <button className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Retur Baru</span>
          </button>
        </div>

        <div className="text-center py-10 text-slate-400 space-y-2 text-xs">
          <RotateCcw className="w-8 h-8 mx-auto opacity-30" />
          <p>Belum ada rekaman retur aktif pada periode ini.</p>
          <p className="text-[11px] text-slate-400">
            Obat yang mendekati kadaluwarsa (&lt; 3 bulan) dapat diajukan tukar guling (retur) ke PBF resmi.
          </p>
        </div>
      </div>
    </div>
  );
};
