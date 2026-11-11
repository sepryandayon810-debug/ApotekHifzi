/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Halaman Login Sistem Apotek Hifzi Farma
 * Dilengkapi Pemilihan Akun Cepat Role (Administrator, Apoteker, Kasir, Gudang)
 * dan Validasi Hak Akses (RBAC) Terpusat
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Store,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Wifi,
  Stethoscope,
  ShoppingCart,
  Boxes,
  KeyRound,
  Code2,
} from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { UserRole } from '../../types/pharmacy';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { settings, login, switchRole } = usePharmacy();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roleProfiles: {
    role: UserRole;
    name: string;
    username: string;
    pass: string;
    desc: string;
    icon: React.ElementType;
    badgeColor: string;
    borderActive: string;
  }[] = [
    {
      role: 'Administrator',
      name: 'Sepryanda Yon',
      username: 'admin',
      pass: 'admin123',
      desc: 'Akses penuh seluruh 35+ menu: Keuangan CoA, Pengaturan, Laporan & Master Data',
      icon: ShieldCheck,
      badgeColor: 'bg-emerald-800 text-emerald-100 border-emerald-600/40',
      borderActive: 'hover:border-emerald-600 hover:bg-emerald-50/60',
    },
    {
      role: 'Apoteker',
      name: 'apt. Siti Rahmawati, S.Farm',
      username: 'apoteker',
      pass: 'apt123',
      desc: 'Pelayanan klinis: POS Resep Dokter, Defecta, Stok Batch FEFO, Mutasi Stok & Laporan',
      icon: Stethoscope,
      badgeColor: 'bg-teal-800 text-teal-100 border-teal-600/40',
      borderActive: 'hover:border-teal-600 hover:bg-teal-50/60',
    },
    {
      role: 'Kasir',
      name: 'Budi Santoso',
      username: 'kasir',
      pass: 'kasir123',
      desc: 'Operasional harian: POS Penjualan Kasir, Buka/Tutup Shift, Riwayat & Cetak Struk',
      icon: ShoppingCart,
      badgeColor: 'bg-blue-800 text-blue-100 border-blue-600/40',
      borderActive: 'hover:border-blue-600 hover:bg-blue-50/60',
    },
    {
      role: 'Gudang',
      name: 'Ahmad Faisal',
      username: 'gudang',
      pass: 'gudang123',
      desc: 'Logistik & inventori: Faktur Pembelian PBF, Defecta, Stok Opname, Retur & Audit',
      icon: Boxes,
      badgeColor: 'bg-amber-800 text-amber-100 border-amber-600/40',
      borderActive: 'hover:border-amber-600 hover:bg-amber-50/60',
    },
    {
      role: 'Developer',
      name: 'Super Admin / Engineering',
      username: 'dev',
      pass: 'dev123',
      desc: 'Super Admin & Dev: Akses penuh 35+ menu, Inspector Aturan Terpusat & Sinkronisasi Cloud',
      icon: Code2,
      badgeColor: 'bg-purple-800 text-purple-100 border-purple-600/40',
      borderActive: 'hover:border-purple-600 hover:bg-purple-50/60',
    },
  ];

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErrorMessage(res.message || 'Login gagal');
      }
    }, 250);
  };

  const handleQuickLogin = (prof: (typeof roleProfiles)[0]) => {
    setUsername(prof.username);
    setPassword(prof.pass);
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(prof.username, prof.pass);
      setIsLoading(false);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErrorMessage(res.message || 'Login gagal');
      }
    }, 150);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center font-bold text-white shadow-md text-base">
            {settings.logoInitial || 'H'}
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight leading-tight">
              {settings.pharmacyName}
            </h1>
            <p className="text-[11px] text-emerald-400 font-mono">
              SIA: {settings.siaNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>Mode Offline & Online Siap</span>
          </div>
        </div>
      </header>

      {/* Main Login Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Quick Role Switcher Demo Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full inline-block">
                Sistem Hak Akses Terpusat (RBAC)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pilih Akun Berdasarkan Peran (Role)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Setiap pengguna memiliki batasan menu terpusat yang ketat sesuai regulasi kefarmasian. Klik kartu peran di bawah untuk langsung mencoba:
              </p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {roleProfiles.map((prof) => {
                const Icon = prof.icon;
                const isCurrentForm = username === prof.username;
                return (
                  <button
                    key={prof.role}
                    type="button"
                    onClick={() => handleQuickLogin(prof)}
                    className={`p-4 rounded-2xl border text-left transition-all relative group flex flex-col justify-between ${
                      isCurrentForm
                        ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-700/60 text-emerald-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${prof.badgeColor}`}>
                            {prof.role}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                      </div>

                      <div className="font-bold text-white text-sm mb-1">{prof.name}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                        {prof.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>User: <strong className="text-emerald-300">{prof.username}</strong></span>
                      <span>Pass: <strong className="text-emerald-300">{prof.pass}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-[11px] text-slate-400 flex items-center gap-2.5">
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Jaminan Keamanan Data:</strong> Transaksi kasir disimpan aman di penyimpanan lokal (Offline-First) dan dapat disinkronkan ke Cloud Firestore kapan saja.
              </span>
            </div>
          </div>

          {/* Right Column: Standard Login Form Card */}
          <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Masuk ke Aplikasi</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Silakan masukkan kredensial akun apotek Anda
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1.5">
                  Nama Pengguna (Username / Email)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: admin, apoteker, kasir, gudang"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Sesi tersimpan otomatis
                </span>
                <span className="text-emerald-400 hover:underline cursor-pointer">
                  Bantuan Login?
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memverifikasi Hak Akses...</span>
                ) : (
                  <>
                    <span>Masuk ke Apotek Hifzi Farma</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-700/60 text-center text-[10px] text-slate-500">
              Apotek Hifzi Farma v2.4 · Standar Farmasi & RBAC Terpusat
            </div>
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="px-6 py-3 border-t border-slate-800/80 text-center text-xs text-slate-500 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px]">
          <Store className="w-3.5 h-3.5 text-emerald-400" />
          <span>{settings.pharmacyName} — {settings.address}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          APA: <strong>{settings.pharmacistInCharge}</strong> ({settings.sipaNumber})
        </div>
      </footer>
    </div>
  );
};
