/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Supplier & Dokter Master Pages - Apotek Hifzi Farma
 */

import React, { useState } from 'react';
import { Truck, Stethoscope, Plus, Search, Phone, MapPin, Award } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const SupplierPage: React.FC = () => {
  const { suppliers, addSupplier } = usePharmacy();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState(`PBF-0${suppliers.length + 1}`);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [paymentTermDays, setPaymentTermDays] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier({
      code,
      name,
      phone,
      address,
      licenseNumber: licenseNumber || 'PBF/REG/2026',
      leadTimeDays: 2,
      paymentTermDays,
    });
    setName('');
    setPhone('');
    setAddress('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Master Data Distributor (PBF)</h2>
          <p className="text-xs text-slate-500">Pedagang Besar Farmasi rekanan resmi pengadaan obat</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Supplier PBF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {s.code}
              </span>
              <span className="text-[10px] text-slate-500">Termin: {s.paymentTermDays} Hari</span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Izin: {s.licenseNumber}</p>
            </div>

            <div className="border-t border-slate-100 pt-2 space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{s.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">{s.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Supplier PBF</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama PBF / Distributor</label>
                <input
                  type="text"
                  required
                  placeholder="PT Kimia Farma..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">No. Izin PBF</label>
                <input
                  type="text"
                  placeholder="PBF/DKI/2026/xxx"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Telepon / Kontak</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat Gudang</label>
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
                  className="flex-1 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold">
                  Simpan PBF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const DokterPage: React.FC = () => {
  const { doctors, addDoctor } = usePharmacy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [sipNumber, setSipNumber] = useState('');
  const [specialty, setSpecialty] = useState('Dokter Umum');
  const [clinicOrHospital, setClinicOrHospital] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDoctor({
      name,
      sipNumber: sipNumber || 'SIP.446/DINKES/2026',
      specialty,
      clinicOrHospital: clinicOrHospital || 'Klinik Swasta',
      phone: phone || '0812-0000-0000',
    });
    setName('');
    setSipNumber('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Master Data Dokter Penulis Resep</h2>
          <p className="text-xs text-slate-500">Database dokter perujuk dan nomor Surat Izin Praktik (SIP)</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                <p className="text-xs text-emerald-700 font-semibold">{d.specialty}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-2 space-y-1 text-xs text-slate-600">
              <div className="font-mono text-[11px] text-slate-500">SIP: {d.sipNumber}</div>
              <div>Instansi: {d.clinicOrHospital}</div>
              <div className="text-[11px] text-slate-500">Telp: {d.phone}</div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Data Dokter</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="dr. Ahmad Fauzi, Sp.PD"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor SIP Dokter</label>
                <input
                  type="text"
                  required
                  placeholder="SIP.446/1029/DINKES/2026"
                  value={sipNumber}
                  onChange={(e) => setSipNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Spesialisasi</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Klinik / Rumah Sakit Praktik</label>
                <input
                  type="text"
                  value={clinicOrHospital}
                  onChange={(e) => setClinicOrHospital(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold">
                  Simpan Dokter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
