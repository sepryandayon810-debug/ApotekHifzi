/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Master Obat Page - Apotek Hifzi Farma
 * Menghitung harga jual dari HPP + Margin terpusat
 */

import React, { useState } from 'react';
import { Pill, Plus, Search, Edit2, Trash2, Sliders, ShieldCheck } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { PharmacyCalculator } from '../../core/calculator';
import { GolonganObat, Product } from '../../types/pharmacy';

interface MasterObatPageProps {
  onOpenRuleInspector: () => void;
}

export const MasterObatPage: React.FC<MasterObatPageProps> = ({ onOpenRuleInspector }) => {
  const { products, addProduct, updateProduct, deleteProduct, rules } = usePharmacy();
  const [search, setSearch] = useState('');
  const [selectedGolongan, setSelectedGolongan] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [sku, setSku] = useState(`OBAT-${String(products.length + 1).padStart(3, '0')}`);
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('Analgesik & Antipiretik');
  const [unit, setUnit] = useState('Strip');
  const [golongan, setGolongan] = useState<GolonganObat>('Bebas');
  const [lokasiRak, setLokasiRak] = useState('Rak A-01');
  const [minStock, setMinStock] = useState<number>(10);
  const [buyPrice, setBuyPrice] = useState<number>(5000);
  const [marginPercent, setMarginPercent] = useState<number>(rules.defaultMarginOtc);
  const [requiresPrescription, setRequiresPrescription] = useState(false);

  // Live auto-calculated selling price via Central Calculator
  const calculatedSellPrice = PharmacyCalculator.calculateSellingPrice(
    buyPrice,
    marginPercent,
    rules.roundingStep
  );

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.genericName && p.genericName.toLowerCase().includes(search.toLowerCase()));
    const matchGol = selectedGolongan === 'Semua' || p.golongan === selectedGolongan;
    return matchSearch && matchGol;
  });

  const handleGolonganChange = (newGol: GolonganObat) => {
    setGolongan(newGol);
    if (newGol === 'Keras (G)' || newGol === 'Narkotika' || newGol === 'Psikotropika') {
      setRequiresPrescription(true);
      setMarginPercent(rules.defaultMarginKeras);
    } else {
      setRequiresPrescription(false);
      setMarginPercent(rules.defaultMarginOtc);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      sku,
      name,
      genericName: genericName || undefined,
      category,
      unit,
      golongan,
      lokasiRak,
      minStock,
      buyPrice,
      sellPrice: calculatedSellPrice,
      marginPercent,
      requiresPrescription,
      isActive: true,
      batches: [
        {
          id: `b-${Date.now()}`,
          batchNumber: `BCH-${Date.now().toString().slice(-4)}`,
          expiredDate: '2027-12-31',
          stock: 20,
          initialStock: 20,
          buyPrice,
          supplierId: 'sup-001',
        },
      ],
    });

    // Reset
    setName('');
    setGenericName('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Master Data Obat & Alkes</h2>
          <p className="text-xs text-slate-500">
            Katalog obat terpusat, HPP, formula margin keuntungan otomatis, dan batas minimum stok
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRuleInspector}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Rule Margin ({rules.defaultMarginOtc}% / {rules.defaultMarginKeras}%)</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Obat Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari obat berdasarkan nama, kode SKU, zat aktif..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {['Semua', 'Bebas', 'Bebas Terbatas', 'Keras (G)'].map((gol) => (
            <button
              key={gol}
              onClick={() => setSelectedGolongan(gol)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedGolongan === gol
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {gol}
            </button>
          ))}
        </div>
      </div>

      {/* Master Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Nama Obat & Zat Aktif</th>
                <th className="px-4 py-3">Golongan</th>
                <th className="px-4 py-3">Satuan</th>
                <th className="px-4 py-3 text-right">HPP (Beli)</th>
                <th className="px-4 py-3 text-right">Margin (%)</th>
                <th className="px-4 py-3 text-right">Harga Jual</th>
                <th className="px-4 py-3 text-center">Total Stok</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const totalStock = p.batches.reduce((s, b) => s + b.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-700">{p.sku}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{p.name}</span>
                      <span className="text-[10px] text-slate-500">{p.genericName || p.category} · Rak: {p.lokasiRak}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          p.golongan === 'Keras (G)'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {p.golongan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.unit}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600">
                      Rp {p.buyPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-800">
                      +{p.marginPercent}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      Rp {p.sellPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold">
                      <span className={totalStock <= p.minStock ? 'text-rose-600 font-extrabold' : 'text-slate-800'}>
                        {totalStock} {p.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Hapus obat "${p.name}" dari master data?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Master Obat Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Golongan Obat</label>
                  <select
                    value={golongan}
                    onChange={(e) => handleGolonganChange(e.target.value as GolonganObat)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Bebas">Bebas (Hijau)</option>
                    <option value="Bebas Terbatas">Bebas Terbatas (Biru)</option>
                    <option value="Keras (G)">Keras / G (Merah - Wajib Resep)</option>
                    <option value="Herbal / Jamu">Herbal / Jamu</option>
                    <option value="Alkes">Alat Kesehatan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Dagang Obat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paracetamol 500 mg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Generik / Zat Aktif</label>
                  <input
                    type="text"
                    placeholder="Contoh: Acetaminophen"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kategori Farmakologi</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Satuan Dosis</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Strip">Strip</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Botol">Botol</option>
                    <option value="Tube">Tube</option>
                    <option value="Box">Box</option>
                    <option value="Ampul">Ampul</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lokasi Rak</label>
                  <input
                    type="text"
                    value={lokasiRak}
                    onChange={(e) => setLokasiRak(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batas Min (Defecta)</label>
                  <input
                    type="number"
                    min="1"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value) || 5)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              {/* Pricing & Central Margin Calculator Section */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 mt-2">
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span>Perhitungan Harga Terpusat (Central Formula)</span>
                  <span className="text-[10px] text-emerald-700">Otomatis dibulatkan Rp {rules.roundingStep}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-emerald-900 block mb-1">Harga Beli HPP (Rp)</label>
                    <input
                      type="number"
                      step="500"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Number(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-emerald-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-emerald-900 block mb-1">Target Margin Keuntungan (%)</label>
                    <input
                      type="number"
                      value={marginPercent}
                      onChange={(e) => setMarginPercent(Number(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 border border-emerald-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                  <span className="text-slate-700 font-semibold">Harga Jual Akhir ke Pasien:</span>
                  <strong className="text-base font-bold font-mono text-emerald-900">
                    Rp {calculatedSellPrice.toLocaleString('id-ID')}
                  </strong>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Simpan Obat ke Master Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
