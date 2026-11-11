/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PengaturanApotekHub - Pusat Pengaturan Awal Apotek
 * Mengatur Nama Apotek, Izin SIA/SIPA, Printer Thermal, Warna Tema, dan Ukuran Tulisan
 */

import React, { useState } from 'react';
import {
  Store,
  Printer,
  Palette,
  Type,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Phone,
  MapPin,
  Mail,
  FileText,
  Sliders,
  Database,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Wifi,
  AlertTriangle,
  Code2,
} from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { pharmacyStore } from '../../core/store';
import { AppSettings, TextScale, ThemeColorPalette } from '../../types/pharmacy';
import {
  FirebaseConfig,
  getActiveFirebaseConfig,
  saveFirebaseConfig,
  testFirebaseConnection,
  syncLocalDataToCloud,
  isFirebaseConfigured,
} from '../../services/firebase';

export const PengaturanApotekHub: React.FC = () => {
  const { settings, updateSettings, activeBranch } = usePharmacy();

  const [activeTab, setActiveTab] = useState<'identitas' | 'print' | 'tema' | 'database'>('identitas');
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [saveAlert, setSaveAlert] = useState(false);

  // Firebase Firestore config state
  const [cloudConfig, setCloudConfig] = useState<FirebaseConfig>(getActiveFirebaseConfig());
  const [testResult, setTestResult] = useState<{
    loading: boolean;
    data: { success: boolean; message: string; details?: string } | null;
  }>({ loading: false, data: null });
  const [syncStatus, setSyncStatus] = useState<{
    loading: boolean;
    message: string | null;
    success?: boolean;
  }>({ loading: false, message: null });
  const [backupRestoreMessage, setBackupRestoreMessage] = useState<string | null>(null);

  // Theme color palette definitions
  const themePresets: { id: ThemeColorPalette; label: string; primaryBg: string; previewHex: string }[] = [
    { id: 'emerald', label: 'Hijau Apotek Klasik', primaryBg: 'bg-emerald-700', previewHex: '#1b7a42' },
    { id: 'teal', label: 'Teal Medis Modern', primaryBg: 'bg-teal-700', previewHex: '#0f766e' },
    { id: 'green', label: 'Hijau Herbal Segar', primaryBg: 'bg-green-600', previewHex: '#16a34a' },
    { id: 'blue', label: 'Biru Klinis Rumah Sakit', primaryBg: 'bg-blue-700', previewHex: '#1d4ed8' },
    { id: 'slate', label: 'Dark Slate Minimalis', primaryBg: 'bg-slate-800', previewHex: '#334155' },
  ];

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(formData);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Kembalikan pengaturan identitas & tampilan ke default Apotek Hifzi Farma?')) {
      const defaultData: Partial<AppSettings> = {
        pharmacyName: 'Apotek Hifzi Farma',
        tagline: 'Melayani Dengan Hati, Solusi Obat Terpercaya',
        siaNumber: 'SIA.503/0482/DINKES/2023',
        pharmacistInCharge: 'apt. Sepryanda Yon, S.Farm',
        sipaNumber: 'SIPA/19920810/2022/2045',
        address: 'Jl. Raya Sehat No. 88, Jakarta Timur',
        phone: '021-87654321 / WA: 0812-9988-7766',
        email: 'admin@hifzifarma.com',
        logoInitial: 'H',
        printerPaperWidth: '58mm',
        printHeader: 'Apotek Hifzi Farma',
        printFooter: 'Terima kasih. Semoga lekas sembuh & sehat selalu.',
        themeColor: 'emerald',
        textScale: 'standard',
        fontFamily: 'Plus Jakarta Sans',
      };
      setFormData((prev) => ({ ...prev, ...defaultData }));
      updateSettings(defaultData);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-emerald-200">
              Pondasi Sistem Terpusat
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Pengaturan Master Identitas, Print & Tampilan Apotek
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-2xl mt-0.5">
            Semua perubahan nama apotek, izin apoteker, ukuran thermal print, dan warna tema di sini akan langsung 
            tersinkronisasi secara otomatis ke seluruh kasir POS, nota cetak, dan laporan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <button
            onClick={() => handleSave()}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {saveAlert && (
        <div className="p-3.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Pengaturan apotek berhasil disimpan dan langsung diterapkan ke seluruh sistem!</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('identitas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'identitas'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>1. Nama & Profil Apotek</span>
        </button>

        <button
          onClick={() => setActiveTab('print')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'print'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>2. Pengaturan Print & Struk</span>
        </button>

        <button
          onClick={() => setActiveTab('tema')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'tema'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>3. Warna Tema & Tulisan</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'database'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>4. Database & Cloud (Offline + Online)</span>
          {isFirebaseConfigured() ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Cloud Terkonfigurasi" />
          ) : (
            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">
              Offline Aktif
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: IDENTITAS & PROFIL APOTEK */}
      {activeTab === 'identitas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Input */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-700" />
              <span>Identitas Resmi Sarana Kefarmasian</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Resmi Apotek <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.pharmacyName}
                  onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                  placeholder="Contoh: Apotek Hifzi Farma"
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Huruf Inisial / Logo Singkat
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.logoInitial}
                    onChange={(e) => setFormData({ ...formData, logoInitial: e.target.value.toUpperCase() })}
                    className="w-16 px-3 py-2 text-center text-sm font-bold font-mono border border-slate-300 rounded-xl bg-white uppercase"
                  />
                  <span className="text-[11px] text-slate-500">Ditampilkan di avatar sidebar drawer</span>
                </div>
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-slate-700 block mb-1">Slogan / Tagline Apotek</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Contoh: Melayani Dengan Hati, Solusi Obat Terpercaya"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nomor Surat Izin Apotek (SIA)
                </label>
                <input
                  type="text"
                  value={formData.siaNumber}
                  onChange={(e) => setFormData({ ...formData, siaNumber: e.target.value })}
                  placeholder="SIA.503/xxxx/DINKES/2024"
                  className="w-full px-3 py-2 font-mono border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Apoteker Pengelola Apotek (APA)
                </label>
                <input
                  type="text"
                  value={formData.pharmacistInCharge}
                  onChange={(e) => setFormData({ ...formData, pharmacistInCharge: e.target.value })}
                  placeholder="apt. Sepryanda Yon, S.Farm"
                  className="w-full px-3 py-2 font-semibold border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-slate-700 block mb-1">
                Nomor Surat Izin Praktik Apoteker (SIPA)
              </label>
              <input
                type="text"
                value={formData.sipaNumber}
                onChange={(e) => setFormData({ ...formData, sipaNumber: e.target.value })}
                placeholder="SIPA/19920810/2022/2045"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
              />
            </div>

            <div className="text-xs pt-2 border-t border-slate-100">
              <label className="font-semibold text-slate-700 block mb-1">Alamat Lengkap Apotek</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Raya Sehat No. 88, Jakarta Timur"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">No. Telepon & WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="021-87654321 / WA: 0812-xxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="kontak@apotekanda.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                />
              </div>
            </div>

            <button
              onClick={() => handleSave()}
              className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Apotek</span>
            </button>
          </div>

          {/* Right: Live Identity Preview Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Pratinjau Kartu Identitas Resmi
              </span>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white space-y-4 shadow-md relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl text-emerald-300">
                    {formData.logoInitial || 'A'}
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-tight">{formData.pharmacyName}</h4>
                    <p className="text-[11px] text-emerald-200 mt-0.5 line-clamp-1">{formData.tagline}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/15 space-y-2 text-[11px] text-emerald-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{formData.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{formData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>SIA: {formData.siaNumber}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl text-[10px] space-y-0.5 border border-white/10">
                  <span className="text-emerald-300 block font-semibold">Apoteker Pengelola Apotek (APA):</span>
                  <div className="font-bold text-white text-xs">{formData.pharmacistInCharge}</div>
                  <div className="font-mono text-emerald-200">SIPA: {formData.sipaNumber}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <strong className="block font-semibold">Otomatis Terhubung:</strong>
              <p className="text-[11px] leading-relaxed">
                Ketika nama atau alamat apotek diubah di sini, header nota struk POS kasir dan kop surat pesanan (SP) 
                ke PBF otomatis menyesuaikan seketika!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENGATURAN PRINT & STRUK THERMAL */}
      {activeTab === 'print' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Options */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Konfigurasi Format Printer Thermal</span>
            </h3>

            {/* Paper Width Selection */}
            <div>
              <label className="font-semibold text-xs text-slate-700 block mb-2">
                Ukuran Kertas Thermal Printer
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, printerPaperWidth: '58mm' })}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    formData.printerPaperWidth === '58mm'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-600/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">58 mm (Kasir Kecil)</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Lebar standar printer portabel / mobile Bluetooth
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, printerPaperWidth: '80mm' })}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    formData.printerPaperWidth === '80mm'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-600/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">80 mm (Kasir Lebar)</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Lebar penuh kasir supermarket & apotek besar
                  </div>
                </button>
              </div>
            </div>

            {/* Header & Footer Custom Text */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Teks Header Struk</label>
                <input
                  type="text"
                  value={formData.printHeader}
                  onChange={(e) => setFormData({ ...formData, printHeader: e.target.value })}
                  placeholder="Nama Apotek yang tercetak paling atas"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pesan Footer Struk (Doa / Syarat Ketentuan)
                </label>
                <textarea
                  rows={2}
                  value={formData.printFooter}
                  onChange={(e) => setFormData({ ...formData, printFooter: e.target.value })}
                  placeholder="Terima kasih. Semoga lekas sembuh & sehat selalu."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Switches */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-900 block">Cetak Nama APA & SIPA</span>
                  <span className="text-[11px] text-slate-500">Mencantumkan identitas apoteker di struk kasir</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showPharmacistOnReceipt}
                  onChange={(e) => setFormData({ ...formData, showPharmacistOnReceipt: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-900 block">Cetak Nama Dokter & No. Resep</span>
                  <span className="text-[11px] text-slate-500">Jika transaksi mencakup obat resep</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showDoctorOnReceipt}
                  onChange={(e) => setFormData({ ...formData, showDoctorOnReceipt: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-900 block">Perintah Auto-Cut Kertas</span>
                  <span className="text-[11px] text-slate-500">Kirim kode pemotong kertas ESC/POS otomatis</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoCutReceipt}
                  onChange={(e) => setFormData({ ...formData, autoCutReceipt: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-900 block">Kick Cash Drawer (Buka Laci Kasir)</span>
                  <span className="text-[11px] text-slate-500">Buka laci kasir otomatis via port RJ-11 printer</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.openCashDrawer}
                  onChange={(e) => setFormData({ ...formData, openCashDrawer: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Uji Cetak Sekarang</span>
              </button>
              <button
                onClick={() => handleSave()}
                className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex-1 flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Print</span>
              </button>
            </div>
          </div>

          {/* Real-time Live Receipt Preview */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Pratinjau Struk Thermal Kasir ({formData.printerPaperWidth})
            </span>

            <div className="bg-slate-200/80 p-6 rounded-2xl flex justify-center border border-slate-300">
              <div
                className={`bg-white p-4 shadow-md border border-slate-200 font-mono text-slate-800 text-[11px] leading-relaxed transition-all ${
                  formData.printerPaperWidth === '58mm' ? 'w-[250px]' : 'w-[320px]'
                }`}
              >
                {/* Header */}
                <div className="text-center border-b border-dashed border-slate-400 pb-2.5 mb-2">
                  <h4 className="font-bold text-xs text-slate-900 uppercase">{formData.printHeader}</h4>
                  <p className="text-[10px] text-slate-600">{formData.address}</p>
                  <p className="text-[10px] text-slate-600">Telp: {formData.phone}</p>
                  {formData.showPharmacistOnReceipt && (
                    <div className="text-[9px] text-slate-500 mt-1">
                      <div>APA: {formData.pharmacistInCharge}</div>
                      <div>SIPA: {formData.sipaNumber}</div>
                    </div>
                  )}
                </div>

                {/* Trans Info */}
                <div className="space-y-0.5 border-b border-dashed border-slate-400 pb-2 mb-2 text-[10px]">
                  <div className="flex justify-between">
                    <span>No. Nota:</span>
                    <span className="font-bold">INV/20261110/001</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal:</span>
                    <span>2026-11-10 10:30:15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kasir:</span>
                    <span>Sepryanda Yon</span>
                  </div>
                  {formData.showDoctorOnReceipt && (
                    <div className="pt-1 text-[9px] text-emerald-800">
                      <div>R/: R/2026/11/045</div>
                      <div>Dokter: dr. H. Ahmad Fauzi, Sp.PD</div>
                    </div>
                  )}
                </div>

                {/* Dummy Items */}
                <div className="border-b border-dashed border-slate-400 pb-2 mb-2 space-y-1">
                  <div>
                    <div className="font-semibold text-slate-900">Paracetamol 500 mg</div>
                    <div className="flex justify-between text-slate-600 text-[10px]">
                      <span>2 Strip x Rp 6.000</span>
                      <span className="font-semibold">Rp 12.000</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Amoxicillin 500 mg (R/)</div>
                    <div className="flex justify-between text-slate-600 text-[10px]">
                      <span>1 Strip x Rp 11.000</span>
                      <span className="font-semibold">Rp 11.000</span>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-0.5 text-[10px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp 23.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jasa Tuslah Resep:</span>
                    <span>Rp 3.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Embalase Wadah:</span>
                    <span>Rp 2.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PPN (11%):</span>
                    <span>Rp 3.080</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-400 pt-1 mt-1">
                    <span>TOTAL:</span>
                    <span className="text-emerald-700">Rp 31.100</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span>Tunai:</span>
                    <span>Rp 50.000</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Kembali:</span>
                    <span>Rp 18.900</span>
                  </div>
                </div>

                {/* Footer Message */}
                <div className="text-center border-t border-dashed border-slate-400 pt-3 mt-3 text-[9px] text-slate-600 space-y-0.5">
                  <p className="font-medium">{formData.printFooter}</p>
                  <p className="text-[8px] text-slate-400">Barang yang dibeli tidak dapat ditukar kecuali perjanjian</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WARNA TEMA & TULISAN */}
      {activeTab === 'tema' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-700" />
              <span>Pilihan Palet Warna Tema Aplikasi</span>
            </h3>

            {/* Theme Palettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themePresets.map((preset) => {
                const isSelected = formData.themeColor === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, themeColor: preset.id })}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full shadow-inner shrink-0 border border-black/10"
                      style={{ backgroundColor: preset.previewHex }}
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{preset.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{preset.previewHex}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Typography Scale */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-700" />
                <span>Skala Ukuran Teks / Tulisan Antarmuka</span>
              </h4>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {(
                  [
                    { id: 'compact', label: 'Ringkas', desc: 'Data padat' },
                    { id: 'standard', label: 'Standar', desc: 'Ukuran normal' },
                    { id: 'large', label: 'Ramah Mata', desc: 'Teks lebih besar' },
                  ] as const
                ).map((scale) => (
                  <button
                    key={scale.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, textScale: scale.id })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.textScale === scale.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>{scale.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{scale.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family Selection */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <label className="font-semibold text-slate-700 block mb-1">Pilihan Font Tulisan</label>
              <select
                value={formData.fontFamily}
                onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean Farmasi)</option>
                <option value="System Sans">System Sans-Serif (Native Cepat)</option>
                <option value="JetBrains Mono">JetBrains Mono (Teknis & Data)</option>
              </select>
            </div>

            <button
              onClick={() => handleSave()}
              className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 w-full"
            >
              <Save className="w-4 h-4" />
              <span>Terapkan Tema & Warna</span>
            </button>
          </div>

          {/* Right: Theme Live Preview Sandbox */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Simulasi Tampilan UI Apotek
              </span>

              {/* Mini App UI Mockup with Selected Theme */}
              <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                {/* Header mock */}
                <div
                  className="px-4 py-3 text-white flex items-center justify-between"
                  style={{
                    backgroundColor:
                      formData.themeColor === 'emerald'
                        ? '#1b7a42'
                        : formData.themeColor === 'teal'
                        ? '#0f766e'
                        : formData.themeColor === 'green'
                        ? '#16a34a'
                        : formData.themeColor === 'blue'
                        ? '#1d4ed8'
                        : '#334155',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                      {formData.logoInitial || 'A'}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{formData.pharmacyName}</div>
                      <div className="text-[9px] text-white/80">{formData.tagline}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                    Kasir Aktif
                  </span>
                </div>

                {/* Content mock */}
                <div className="p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">Katalog Obat Populer</span>
                    <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                      Stok Terkini: 150 Unit
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">Paracetamol 500 mg</div>
                      <div className="text-[10px] text-slate-500">Strip · Batch PCT-2401</div>
                    </div>
                    <button
                      className="px-3 py-1 text-white rounded-lg text-xs font-bold shadow-xs"
                      style={{
                        backgroundColor:
                          formData.themeColor === 'emerald'
                            ? '#1b7a42'
                            : formData.themeColor === 'teal'
                            ? '#0f766e'
                            : formData.themeColor === 'green'
                            ? '#16a34a'
                            : formData.themeColor === 'blue'
                            ? '#1d4ed8'
                            : '#334155',
                      }}
                    >
                      + Tambah Rp 6.000
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Kemudahan Arsitektur:</span>
              <p className="text-[11px] leading-relaxed">
                Karena data rule dan styling disentralisasi di layer inti, merubah skema warna atau identitas apotek 
                tidak memerlukan perubahan manual pada kode puluhan file HTML.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE & CLOUD (OFFLINE + ONLINE) */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Top Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Offline Card */}
            <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-white space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Penyimpanan Lokal (Offline-First)</h4>
                  <span className="text-[10px] text-emerald-400 font-medium">Status: AKTIF & TERPROTEKSI</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seluruh data obat, transaksi kasir, stok batch, dan pengaturan tersimpan di memori perangkat lokal.
                <strong> Data TIDAK AKAN HILANG</strong> meskipun komputer atau tablet apotek Anda tidak terhubung internet.
              </p>
            </div>

            {/* Cloud Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Koneksi Cloud Firestore</h4>
                    <span className="text-[10px] font-medium text-teal-400">
                      {isFirebaseConfigured() ? 'Kredensial Terpasang' : 'Menunggu Kredensial Pengguna'}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isFirebaseConfigured()
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}>
                  {isFirebaseConfigured() ? 'Online Ready' : 'Offline Mode Only'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Menyediakan sinkronisasi cadangan otomatis ke Google Cloud Firestore saat perangkat terhubung internet.
              </p>
            </div>
          </div>

          {/* Test & Sync Alerts */}
          {testResult.data && (
            <div
              className={`p-4 rounded-2xl border text-xs font-medium flex items-start gap-3 animate-in fade-in ${
                testResult.data.success
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                  : 'bg-rose-50 text-rose-950 border-rose-300'
              }`}
            >
              <div className="p-1 rounded-md shrink-0 mt-0.5 bg-white/80">
                {testResult.data.success ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <div className="space-y-1">
                <strong className="block font-bold">
                  {testResult.data.success ? 'Koneksi Berhasil!' : 'Koneksi Cloud Belum Berhasil'}
                </strong>
                <p>{testResult.data.message}</p>
                {testResult.data.details && (
                  <p className="font-mono text-[11px] text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-200">
                    {testResult.data.details}
                  </p>
                )}
              </div>
            </div>
          )}

          {syncStatus.message && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                syncStatus.success
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              <RefreshCw className="w-4 h-4 shrink-0 text-emerald-600 animate-spin" />
              <span>{syncStatus.message}</span>
            </div>
          )}

          {backupRestoreMessage && (
            <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{backupRestoreMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Input Kredensial Firebase */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-emerald-700" />
                  <span>Kredensial Firebase Firestore</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Formulir Mandiri Pengguna
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Project ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cloudConfig.projectId}
                    onChange={(e) => setCloudConfig({ ...cloudConfig, projectId: e.target.value })}
                    placeholder="Contoh: apotek-hifzi-farma"
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    API Key (Web API Key) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cloudConfig.apiKey}
                    onChange={(e) => setCloudConfig({ ...cloudConfig, apiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Auth Domain</label>
                  <input
                    type="text"
                    value={cloudConfig.authDomain}
                    onChange={(e) => setCloudConfig({ ...cloudConfig, authDomain: e.target.value })}
                    placeholder="apotek-hifzi-farma.firebaseapp.com"
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Storage Bucket</label>
                  <input
                    type="text"
                    value={cloudConfig.storageBucket}
                    onChange={(e) => setCloudConfig({ ...cloudConfig, storageBucket: e.target.value })}
                    placeholder="apotek-hifzi-farma.appspot.com"
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Messaging Sender ID</label>
                  <input
                    type="text"
                    value={cloudConfig.messagingSenderId}
                    onChange={(e) => setCloudConfig({ ...cloudConfig, messagingSenderId: e.target.value })}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">App ID</label>
                  <input
                    type="text"
                    value={cloudConfig.appId}
                    onChange={(e) => setCloudConfig({ ...cloudConfig, appId: e.target.value })}
                    placeholder="1:1234567890:web:abcdef"
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    saveFirebaseConfig(cloudConfig);
                    setSaveAlert(true);
                    setTimeout(() => setSaveAlert(false), 2500);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Kredensial</span>
                </button>

                <button
                  type="button"
                  disabled={testResult.loading}
                  onClick={async () => {
                    saveFirebaseConfig(cloudConfig);
                    setTestResult({ loading: true, data: null });
                    const res = await testFirebaseConnection();
                    setTestResult({ loading: false, data: res });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testResult.loading ? 'animate-spin' : ''}`} />
                  <span>{testResult.loading ? 'Menguji Koneksi...' : 'Uji Koneksi Cloud'}</span>
                </button>

                <button
                  type="button"
                  disabled={syncStatus.loading}
                  onClick={async () => {
                    setSyncStatus({ loading: true, message: 'Mengunggah seluruh data apotek ke Cloud...' });
                    const fullData = JSON.parse(pharmacyStore.exportFullDatabase());
                    const res = await syncLocalDataToCloud(fullData);
                    setSyncStatus({ loading: false, message: res.message, success: res.success });
                    setTimeout(() => setSyncStatus({ loading: false, message: null }), 4000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Sinkronkan Sekarang</span>
                </button>
              </div>

              {/* Opsi Edit File Sumber Langsung */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Code2 className="w-4 h-4 text-emerald-700" />
                  <span>Opsi Alternatif: Edit File Kode Langsung</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Anda juga dapat memasukkan konfigurasi langsung pada file:
                  <code className="mx-1 px-1.5 py-0.5 bg-slate-200 font-mono text-emerald-800 rounded">
                    /src/services/firebase.ts
                  </code>
                  pada objek <code className="px-1 bg-slate-200 font-mono rounded">MANUAL_FIREBASE_CONFIG</code>.
                </p>
              </div>
            </div>

            {/* Right: Panduan & Backup/Restore JSON */}
            <div className="lg:col-span-5 space-y-5">
              {/* Step by Step Guide Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Panduan Kredensial Firebase (Gratis)</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      Buka <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline">console.firebase.google.com</a> dan buat project baru.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      Pilih menu <strong>Firestore Database</strong> &gt; klik <strong>Create database</strong> (pilih lokasi Jakarta / default).
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      Buka tab <strong>Rules</strong>, ubah menjadi <code className="bg-slate-100 px-1 font-mono text-[10px]">allow read, write: if true;</code> lalu klik <strong>Publish</strong>.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <p>
                      Klik ikon gerigi <strong>Project Settings</strong> di pojok kiri atas &gt; gulir ke <strong>Your apps</strong> &gt; klik ikon Web (<strong>&lt;/&gt;</strong>).
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      5
                    </span>
                    <p>
                      Salin nilai <code className="bg-slate-100 px-1 font-mono text-[10px]">apiKey</code> dan <code className="bg-slate-100 px-1 font-mono text-[10px]">projectId</code> ke formulir di samping.
                    </p>
                  </div>
                </div>
              </div>

              {/* Offline Backup & Restore Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Cadangkan & Pulihkan Data (JSON Offline)
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Fitur ini memungkinkan Anda mengekspor seluruh basis data apotek ke file JSON lokal sebagai cadangan mandiri kapan saja.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const jsonStr = pharmacyStore.exportFullDatabase();
                      const blob = new Blob([jsonStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Apotek_Hifzi_Farma_Backup_${new Date().toISOString().substring(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      setBackupRestoreMessage('Cadangan basis data berhasil diunduh ke komputer Anda!');
                      setTimeout(() => setBackupRestoreMessage(null), 3000);
                    }}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Cadangan JSON</span>
                  </button>

                  <label className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-slate-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pulihkan dari JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const content = event.target?.result as string;
                            const success = pharmacyStore.importFullDatabase(content);
                            if (success) {
                              setBackupRestoreMessage('Basis data berhasil dipulihkan dari file JSON!');
                            } else {
                              alert('Format file cadangan tidak valid!');
                            }
                            setTimeout(() => setBackupRestoreMessage(null), 3500);
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
