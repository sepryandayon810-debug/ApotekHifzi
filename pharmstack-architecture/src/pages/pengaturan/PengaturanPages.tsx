/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pengaturan & Kelola Cabang Modul Terpadu - Apotek Hifzi Farma
 * Menyatukan Pengguna, Role & Akses, Umum, Metode Pembayaran, Bagan Akun (CoA), dan Cabang.
 */

import React, { useState } from 'react';
import {
  UserCog,
  ShieldCheck,
  Settings,
  CreditCard,
  BookOpen,
  Store,
  Check,
  Plus,
} from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

interface PengaturanPagesProps {
  type: 'pengguna' | 'role_akses' | 'umum' | 'metode_pembayaran' | 'bagan_akun' | 'cabang';
}

export const PengaturanPages: React.FC<PengaturanPagesProps> = ({ type }) => {
  const { chartOfAccounts, activeBranch, branches } = usePharmacy();
  const [saved, setSaved] = useState(false);

  // Profile Umum State
  const [pharmacyName, setPharmacyName] = useState(activeBranch.name);
  const [address, setAddress] = useState(activeBranch.address);
  const [phone, setPhone] = useState(activeBranch.phone);
  const [apa, setApa] = useState(activeBranch.pharmacistInCharge);
  const [sipa, setSipa] = useState(activeBranch.sipaNumber);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          {type === 'pengguna' && 'Manajemen Pengguna & Akun Kasir'}
          {type === 'role_akses' && 'Matriks Role & Hak Akses Menu'}
          {type === 'umum' && 'Pengaturan Umum Profil Apotek'}
          {type === 'metode_pembayaran' && 'Konfigurasi Metode Pembayaran (EDC / QRIS)'}
          {type === 'bagan_akun' && 'Bagan Akun Standar Farmasi (Chart of Accounts)'}
          {type === 'cabang' && 'Kelola Cabang Apotek Hifzi Farma'}
        </h2>
        <p className="text-xs text-slate-500">
          Konfigurasi terpusat untuk otorisasi, profil operasional, dan parameter sistem apotek
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Pengaturan berhasil disimpan!</span>
        </div>
      )}

      {/* 1. Pengaturan Umum */}
      {type === 'umum' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Resmi Apotek</label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-sm font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor Telepon Apotek</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Alamat Lengkap Apotek</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Apoteker Pengelola Apotek (APA)</label>
                <input
                  type="text"
                  value={apa}
                  onChange={(e) => setApa(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor SIPA APA</label>
                <input
                  type="text"
                  value={sipa}
                  onChange={(e) => setSipa(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition-colors mt-2"
            >
              Simpan Profil Apotek
            </button>
          </form>
        </div>
      )}

      {/* 2. Pengguna */}
      {type === 'pengguna' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Nama Pengguna</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role Akses</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-slate-900">Developer (Super Admin / Engineering)</td>
                <td className="px-4 py-3 font-mono text-purple-700 font-bold">dev</td>
                <td className="px-4 py-3 font-mono text-slate-600">developer@hifzifarma.com</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    Developer
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-emerald-700 font-semibold">Aktif</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-slate-900">Sepryanda Yon</td>
                <td className="px-4 py-3 font-mono text-slate-700 font-bold">admin</td>
                <td className="px-4 py-3 font-mono text-slate-600">admin@hifzifarma.com</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Administrator
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-emerald-700 font-semibold">Aktif</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-slate-900">apt. Siti Rahmawati, S.Farm</td>
                <td className="px-4 py-3 font-mono text-slate-700 font-bold">apoteker</td>
                <td className="px-4 py-3 font-mono text-slate-600">siti.farmasi@hifzifarma.com</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Apoteker
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-emerald-700 font-semibold">Aktif</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-slate-900">Budi Santoso</td>
                <td className="px-4 py-3 font-mono text-slate-700 font-bold">kasir</td>
                <td className="px-4 py-3 font-mono text-slate-600">budi.kasir@hifzifarma.com</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Kasir
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-emerald-700 font-semibold">Aktif</td>
              </tr>
              <tr className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-slate-900">Ahmad Faisal</td>
                <td className="px-4 py-3 font-mono text-slate-700 font-bold">gudang</td>
                <td className="px-4 py-3 font-mono text-slate-600">faisal.logistik@hifzifarma.com</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Gudang
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-emerald-700 font-semibold">Aktif</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Role & Akses */}
      {type === 'role_akses' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Matriks Hak Akses Per Menu & Fitur (RBAC Policy)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-2.5">Menu / Modul</th>
                  <th className="p-2.5 text-center text-purple-700">Developer (Super Admin)</th>
                  <th className="p-2.5 text-center">Administrator</th>
                  <th className="p-2.5 text-center">Apoteker</th>
                  <th className="p-2.5 text-center">Kasir</th>
                  <th className="p-2.5 text-center">Gudang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { menu: 'Dashboard & Analitik', dev: true, admin: true, apt: true, kasir: false, gdg: false },
                  { menu: 'POS Kasir & Penjualan', dev: true, admin: true, apt: true, kasir: true, gdg: false },
                  { menu: 'Pelayanan Resep Dokter & SIP', dev: true, admin: true, apt: true, kasir: false, gdg: false },
                  { menu: 'Master Obat & Formula Margin HPP', dev: true, admin: true, apt: true, kasir: false, gdg: false },
                  { menu: 'Stok Opname & Defecta', dev: true, admin: true, apt: true, kasir: false, gdg: true },
                  { menu: 'Faktur Pembelian PBF & Retur', dev: true, admin: true, apt: true, kasir: false, gdg: true },
                  { menu: 'Laporan Keuangan & CoA', dev: true, admin: true, apt: false, kasir: false, gdg: false },
                  { menu: 'Konfigurasi Rule Terpusat & Live Sandbox', dev: true, admin: true, apt: false, kasir: false, gdg: false },
                  { menu: 'Firestore Cloud Sync & Debugging Code', dev: true, admin: true, apt: false, kasir: false, gdg: false },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-medium text-slate-800">{row.menu}</td>
                    <td className="p-2.5 text-center font-bold text-purple-700">{row.dev ? '✅' : '❌'}</td>
                    <td className="p-2.5 text-center">{row.admin ? '✅' : '❌'}</td>
                    <td className="p-2.5 text-center">{row.apt ? '✅' : '❌'}</td>
                    <td className="p-2.5 text-center">{row.kasir ? '✅' : '❌'}</td>
                    <td className="p-2.5 text-center">{row.gdg ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Metode Pembayaran */}
      {type === 'metode_pembayaran' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'Uang Tunai (Cash)', status: 'Aktif (Default)', icon: '💵' },
            { name: 'QRIS Statis & Dinamis', status: 'Aktif', icon: '📱' },
            { name: 'Transfer Bank BCA', status: 'Aktif (Rek: 872-001-9922)', icon: '🏦' },
            { name: 'Kartu Debit / EDC Mandiri', status: 'Aktif', icon: '💳' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <span className="text-xs text-emerald-700 font-semibold">{item.status}</span>
                </div>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded-lg border border-emerald-200 font-bold">
                ON
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 5. Bagan Akun (CoA) */}
      {type === 'bagan_akun' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Kode Akun</th>
                <th className="px-4 py-3">Nama Akun Akuntansi</th>
                <th className="px-4 py-3">Klasifikasi</th>
                <th className="px-4 py-3 text-right">Saldo Saat Ini</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartOfAccounts.map((coa) => (
                <tr key={coa.code} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{coa.code}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{coa.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        coa.type === 'Aktiva'
                          ? 'bg-blue-50 text-blue-800'
                          : coa.type === 'Pendapatan'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {coa.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    Rp {coa.balance.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. Kelola Cabang */}
      {type === 'cabang' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((b) => (
            <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {b.code}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {b.isActive ? 'OPERASIONAL' : 'TUTUP'}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">{b.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{b.address}</p>
              </div>
              <div className="border-t border-slate-100 pt-2 text-xs text-slate-600 space-y-0.5">
                <div>APA: <strong>{b.pharmacistInCharge}</strong></div>
                <div className="font-mono text-[11px] text-slate-500">SIPA: {b.sipaNumber}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
