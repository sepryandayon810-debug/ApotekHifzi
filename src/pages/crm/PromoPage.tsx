/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Promo Page - CRM Apotek Hifzi Farma
 */

import React from 'react';
import { Tag, Sparkles, Percent, Calendar } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const PromoPage: React.FC = () => {
  const { promos } = usePharmacy();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Manajemen Promo & Voucher</h2>
        <p className="text-xs text-slate-500">Daftar kode kupon dan diskon promosi apotek</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                {p.code}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                {p.isActive ? 'AKTIF' : 'NONAKTIF'}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900">{p.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Nilai Diskon:{' '}
                <strong className="text-emerald-700">
                  {p.discountType === 'percentage'
                    ? `${p.discountValue}%`
                    : `Rp ${p.discountValue.toLocaleString('id-ID')}`}
                </strong>
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Minimal Belanja:</span>
                <span className="font-mono font-medium text-slate-700">
                  Rp {p.minPurchase.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Periode:</span>
                <span>{p.startDate} s/d {p.endDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
