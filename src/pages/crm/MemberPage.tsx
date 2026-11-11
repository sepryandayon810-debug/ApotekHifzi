/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Member Page - CRM Apotek Hifzi Farma
 */

import React, { useState } from 'react';
import { Users, Plus, Search, Award, ShieldAlert, Check } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const MemberPage: React.FC = () => {
  const { members, addMember } = usePharmacy();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [tier, setTier] = useState<'Reguler' | 'Silver' | 'Gold' | 'VIP'>('Reguler');
  const [allergies, setAllergies] = useState('');

  const filteredMembers = members.filter((m) => {
    return (
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.code.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discountPercent = tier === 'VIP' ? 10 : tier === 'Gold' ? 5 : tier === 'Silver' ? 3 : 0;
    addMember({
      code: `MB-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      phone,
      address,
      points: 10,
      tier,
      discountPercent,
      allergies: allergies || 'Tidak ada riwayat alergi',
    });
    setName('');
    setPhone('');
    setAddress('');
    setAllergies('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Database Member & Pasien</h2>
          <p className="text-xs text-slate-500">Kelola riwayat pelanggan setia, poin belanja, dan catatan alergi</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, no. HP, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Member</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">ID Member</th>
                <th className="px-4 py-3">Nama Pasien / Pelanggan</th>
                <th className="px-4 py-3">No. Telepon / WA</th>
                <th className="px-4 py-3">Tier & Diskon</th>
                <th className="px-4 py-3">Poin Reward</th>
                <th className="px-4 py-3">Catatan Alergi Obat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{m.code}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
                  <td className="px-4 py-3 text-slate-600">{m.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.tier === 'VIP'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : m.tier === 'Gold'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : m.tier === 'Silver'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.tier} ({m.discountPercent}%)
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-800">{m.points} Poin</td>
                  <td className="px-4 py-3 text-slate-600">
                    {m.allergies && m.allergies !== 'Tidak ada alergi' ? (
                      <span className="text-rose-700 font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span>{m.allergies}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Tidak ada riwayat alergi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Pendaftaran Member Pasien Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap Pasien</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">No. WhatsApp / Telepon</label>
                <input
                  type="tel"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tingkat / Tier Member</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Reguler">Reguler (Diskon 0%)</option>
                  <option value="Silver">Silver (Diskon 3%)</option>
                  <option value="Gold">Gold (Diskon 5%)</option>
                  <option value="VIP">VIP (Diskon 10%)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Riwayat Alergi Obat</label>
                <input
                  type="text"
                  placeholder="Contoh: Alergi Penisilin, Amoxicillin"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Simpan Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
