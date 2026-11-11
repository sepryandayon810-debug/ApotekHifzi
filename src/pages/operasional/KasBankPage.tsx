/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kas & Bank Page - Operasional Apotek Hifzi Farma
 */

import React, { useState } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Plus } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const KasBankPage: React.FC = () => {
  const { cashTransactions, addCashTransaction, chartOfAccounts } = usePharmacy();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [type, setType] = useState<'IN' | 'OUT'>('OUT');
  const [category, setCategory] = useState<'Operasional' | 'Modal Kasir' | 'Setor Bank' | 'Pembelian Tunai' | 'Lain-lain'>('Operasional');
  const [amount, setAmount] = useState<number>(0);
  const [account, setAccount] = useState('Kas Kasir');
  const [description, setDescription] = useState('');

  const kasAccounts = chartOfAccounts.filter((c) => c.code.startsWith('10'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCashTransaction({
      type,
      category,
      amount,
      account,
      description,
      recordedBy: 'Sepryanda Yon',
    });
    setAmount(0);
    setDescription('');
    setIsModalOpen(false);
  };

  const totalIn = cashTransactions.filter((t) => t.type === 'IN').reduce((s, t) => s + t.amount, 0);
  const totalOut = cashTransactions.filter((t) => t.type === 'OUT').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Buku Kas & Bank</h2>
          <p className="text-xs text-slate-500">Pencatatan kas kecil, biaya operasional, dan mutasi saldo bank</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Kas Masuk / Keluar</span>
        </button>
      </div>

      {/* Saldo Akun Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kasAccounts.map((acc) => (
          <div key={acc.code} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs text-slate-500 font-medium">{acc.name}</div>
            <div className="text-lg font-bold font-mono text-slate-900">
              Rp {acc.balance.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Kode CoA: {acc.code}</div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Mutasi Kas & Bank Terkini</h3>
          <div className="flex gap-4 text-xs">
            <span className="text-emerald-700 font-medium">Masuk: Rp {totalIn.toLocaleString('id-ID')}</span>
            <span className="text-rose-700 font-medium">Keluar: Rp {totalOut.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Akun</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3">Dicatat Oleh</th>
                <th className="px-4 py-3 text-right">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cashTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono text-slate-500">{tx.date}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{tx.account}</td>
                  <td className="px-4 py-3 text-slate-600">{tx.category}</td>
                  <td className="px-4 py-3 text-slate-700">{tx.description}</td>
                  <td className="px-4 py-3 text-slate-500">{tx.recordedBy}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold">
                    <span className={tx.type === 'IN' ? 'text-emerald-700' : 'text-rose-700'}>
                      {tx.type === 'IN' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat Kas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Pencatatan Mutasi Kas</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenis Mutasi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('OUT')}
                    className={`py-2 rounded-lg font-bold border ${
                      type === 'OUT' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    Kas Keluar (Pengeluaran)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('IN')}
                    className={`py-2 rounded-lg font-bold border ${
                      type === 'IN' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    Kas Masuk (Pemasukan)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sumber Akun</label>
                <select
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Kas Kasir">Kas Kasir</option>
                  <option value="Kas Bank BCA">Kas Bank BCA</option>
                  <option value="Kas Bank Mandiri / QRIS">Kas Bank Mandiri / QRIS</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Operasional">Operasional (Plastik, Kertas, ATK)</option>
                  <option value="Modal Kasir">Modal Kasir</option>
                  <option value="Setor Bank">Setor Tunai ke Bank</option>
                  <option value="Pembelian Tunai">Pembelian Obat Tunai</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="500"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold font-mono border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Keterangan</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Beli sabun cuci tangan & galon air"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
