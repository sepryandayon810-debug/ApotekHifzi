/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Printer Kasir Page - Apotek Hifzi Farma
 */

import React, { useState } from 'react';
import { Printer, Check, RefreshCw } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const PrinterKasirPage: React.FC = () => {
  const { activeBranch } = usePharmacy();
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('58mm');
  const [autoCut, setAutoCut] = useState(true);
  const [openCashDrawer, setOpenCashDrawer] = useState(true);
  const [headerText, setHeaderText] = useState(activeBranch.name);
  const [footerText, setFooterText] = useState('Semoga lekas sembuh & sehat selalu');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestPrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengaturan Thermal Printer Kasir</h2>
            <p className="text-xs text-slate-500">Konfigurasi printer struk nota belanja apotek</p>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Pengaturan printer berhasil disimpan!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ukuran Kertas Thermal</label>
              <select
                value={paperWidth}
                onChange={(e) => setPaperWidth(e.target.value as '58mm' | '80mm')}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-sm"
              >
                <option value="58mm">58 mm (Ukuran Standar Kasir Kecil)</option>
                <option value="80mm">80 mm (Ukuran Lebar Kasir Besar)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Koneksi Port / Driver</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-sm">
                <option>USB Thermal Receipt Printer (Default)</option>
                <option>Bluetooth ESC/POS Mobile Printer</option>
                <option>Network LAN / Wi-Fi IP Printer</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={autoCut}
                onChange={(e) => setAutoCut(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Aktifkan Perintah Auto-Cut Kertas (Bila printer mendukung cutter)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={openCashDrawer}
                onChange={(e) => setOpenCashDrawer(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Otomatis Buka Laci Kasir (Kick Cash Drawer via RJ-11)</span>
            </label>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Header Nota</label>
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Footer / Pesan Nota</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleTestPrint}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Tes Print Kertas</span>
            </button>

            <button
              type="submit"
              className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition-colors flex-1"
            >
              Simpan Konfigurasi Printer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
