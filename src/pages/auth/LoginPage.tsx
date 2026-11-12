/**
 * Halaman Login Sistem Apotek Hifzi Farma
 * Sistem Autentikasi Aman & Proteksi Hak Akses (RBAC)
 * Bebas kebocoran kredensial (tanpa mengekspos akun/password di layar publik)
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
  ArrowRight,
  Wifi,
  KeyRound,
  FileCheck2,
  Pill,
} from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { settings, login } = usePharmacy();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage('Silakan masukkan nama pengguna dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErrorMessage(res.message || 'Nama pengguna atau kata sandi tidak valid!');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center font-bold text-white shadow-md text-lg">
            {settings.logoInitial || 'H'}
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight leading-tight">
              {settings.pharmacyName}
            </h1>
            <p className="text-[11px] text-emerald-400 font-mono">
              SIA: {settings.siaNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>Sistem Farmasi Terenkripsi</span>
          </div>
        </div>
      </header>

      {/* Main Login Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sisi Kiri: Profil Resmi & Proteksi Regulasi */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Portal Autentikasi Resmi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Sistem Manajemen Informasi Apotek Modern
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Akses sistem dibatasi secara ketat berdasarkan wewenang tugas (RBAC). Setiap staf hanya dapat mengakses modul yang telah diizinkan oleh manajemen apotek.
              </p>
            </div>

            {/* Jaminan Keamanan Sistem */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 shrink-0">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Standar Regulasi Kefarmasian</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Mendukung penelusuran resep dokter, nomor SIPA apoteker, dan audit mutasi obat psikotropika/prekursor.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="p-2 rounded-lg bg-teal-950/80 text-teal-400 border border-teal-800/40 shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Kontrol FEFO & Defecta Otomatis</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Validasi tanggal kedaluwarsa batch obat secara ketat saat penjualan POS dan penerimaan faktur PBF.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/40 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Privasi Data & Pembatasan Role</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hak akses keuangan & data laba rugi dilindungi khusus untuk Owner, Developer, dan Administrator.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Form Login Bersih */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Masuk ke Aplikasi</h3>
              <p className="text-xs text-slate-400 mt-1">
                Silakan masukkan kredensial resmi akun Anda untuk memulai sesi kerja
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1.5">
                  Nama Pengguna (Username atau Email)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username atau email Anda"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-emerald-500 focus:border-emerald-500 transition-colors"
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
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-emerald-500 focus:border-emerald-500 transition-colors"
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
                  Sesi tersimpan aman
                </span>
                <span className="text-slate-500 hover:text-slate-300 cursor-pointer">
                  Lupa Kata Sandi?
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Sistem Informasi Apotek v2.4</span>
              <span className="text-emerald-500 font-medium">RBAC Kemenkes RI</span>
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
