/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Master General Pages: Biaya Jasa, Kategori & Satuan, Jabatan, Pegawai
 */

import React, { useState } from 'react';
import { BadgeDollarSign, Layers, Briefcase, UserCheck, Plus, Check } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const BiayaJasaPage: React.FC = () => {
  const { serviceFees, updateServiceFee } = usePharmacy();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feeVal, setFeeVal] = useState<number>(0);

  const handleEdit = (id: string, current: number) => {
    setEditingId(id);
    setFeeVal(current);
  };

  const handleSave = (id: string) => {
    updateServiceFee(id, feeVal);
    setEditingId(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Master Tarif Biaya Jasa Farmasi</h2>
        <p className="text-xs text-slate-500">
          Aturan tarif Tuslah lembar resep, jasa racik salep/puyer, dan biaya embalase wadah terpusat
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
            <tr>
              <th className="px-4 py-3">Nama Layanan Jasa</th>
              <th className="px-4 py-3">Jenis Layanan</th>
              <th className="px-4 py-3 text-right">Tarif Biaya (Rp)</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {serviceFees.map((fee) => (
              <tr key={fee.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-slate-900">{fee.name}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {fee.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                  {editingId === fee.id ? (
                    <input
                      type="number"
                      step="500"
                      value={feeVal}
                      onChange={(e) => setFeeVal(Number(e.target.value) || 0)}
                      className="w-28 px-2 py-1 border border-emerald-500 rounded text-right font-mono"
                    />
                  ) : (
                    `Rp ${fee.fee.toLocaleString('id-ID')}`
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {editingId === fee.id ? (
                    <button
                      onClick={() => handleSave(fee.id)}
                      className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
                    >
                      Simpan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(fee.id, fee.fee)}
                      className="px-3 py-1 text-emerald-700 hover:bg-emerald-50 rounded-lg text-[11px] font-semibold"
                    >
                      Ubah Tarif
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const KategoriSatuanPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Master Kategori & Satuan Dosis</h2>
        <p className="text-xs text-slate-500">Standarisasi kategori farmakologi dan satuan kemasan sediaan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Kategori Obat Farmakologi</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {['Analgesik & Antipiretik', 'Antibiotik', 'Antihistamin / Alergi', 'Saluran Pencernaan / Maag', 'Antidiabetes', 'Vitamin & Suplemen', 'Dermatologi / Kulit', 'Antihipertensi', 'Kardiovaskular'].map((cat) => (
              <span key={cat} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Satuan Kemasan & Sediaan</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {['Strip', 'Tablet', 'Kapsul', 'Botol', 'Tube', 'Box', 'Sachet', 'Ampul', 'Vial', 'Puyer'].map((unit) => (
              <span key={unit} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-mono font-medium border border-emerald-200">
                {unit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const JabatanPegawaiPages: React.FC<{ view: 'jabatan' | 'pegawai' }> = ({ view }) => {
  const staff = [
    { name: 'Sepryanda Yon', role: 'Apoteker Pengelola Apotek (APA)', stra: 'STRA.19920810/2022', status: 'Aktif' },
    { name: 'Siti Rahmawati', role: 'Tenaga Teknis Kefarmasian (TTK)', stra: 'STRTTK.19960211/2023', status: 'Aktif' },
    { name: 'Budi Santoso', role: 'Kasir & Frontliner', stra: '-', status: 'Aktif' },
    { name: 'Ahmad Faisal', role: 'Staf Gudang & Logistik', stra: '-', status: 'Aktif' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          {view === 'jabatan' ? 'Master Struktur Jabatan Apotek' : 'Master Data Pegawai & Apoteker'}
        </h2>
        <p className="text-xs text-slate-500">Pengelolaan personil kefarmasian, nomor STRA/SIPTTK, dan penugasan</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
            <tr>
              <th className="px-4 py-3">Nama Lengkap</th>
              <th className="px-4 py-3">Jabatan / Peran</th>
              <th className="px-4 py-3">Nomor Registrasi STRA/TTK</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((s, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                <td className="px-4 py-3 text-slate-700">{s.role}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{s.stra}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
