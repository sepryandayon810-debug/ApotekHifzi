/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pembelian Page - Transaksi Pembelian Obat dari PBF/Distributor
 */

import React, { useState } from 'react';
import { ShoppingBag, Plus, Search, Truck, Calendar, Check } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

export const PembelianPage: React.FC = () => {
  const { purchases, suppliers, products, addPurchaseInvoice } = usePharmacy();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [invoiceNumber, setInvoiceNumber] = useState(`FP/PBF/${Date.now().toString().slice(-4)}`);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiredDate, setExpiredDate] = useState('2027-12-31');
  const [quantity, setQuantity] = useState<number>(10);
  const [unitPrice, setUnitPrice] = useState<number>(5000);

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setUnitPrice(prod.buyPrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedSupplier) return;

    const subtotal = quantity * unitPrice;
    addPurchaseInvoice({
      invoiceNumber,
      supplierId,
      supplierName: selectedSupplier.name,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          batchNumber: batchNumber || `BCH-${Date.now().toString().slice(-4)}`,
          expiredDate,
          quantity,
          unit: selectedProduct.unit,
          unitPrice,
          subtotal,
        },
      ],
      totalAmount: subtotal,
      status: 'Lunas',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Faktur Pembelian & Penerimaan Barang</h2>
          <p className="text-xs text-slate-500">
            Pencatatan faktur PBF, input no batch, expired date, dan restock otomatis
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Input Faktur Masuk (PBF)</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-3">No. Faktur</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Distributor / PBF</th>
                <th className="px-4 py-3">Item Obat & Batch</th>
                <th className="px-4 py-3 text-right">Total Faktur</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{po.invoiceNumber}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{po.date}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{po.supplierName}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {po.items.map((i, idx) => (
                      <div key={idx}>
                        {i.productName} ({i.quantity} {i.unit}) · Batch: {i.batchNumber} (Exp: {i.expiredDate})
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    Rp {po.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input Faktur Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Penerimaan Faktur Pembelian Obat</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">No. Faktur PBF</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Distributor / PBF</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Produk Obat</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor Batch</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BCH-9901"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Expired</label>
                  <input
                    type="date"
                    required
                    value={expiredDate}
                    onChange={(e) => setExpiredDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jumlah Datang (Qty)</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Harga Beli HPP Satuan (Rp)</label>
                  <input
                    type="number"
                    step="100"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex justify-between font-bold text-emerald-950">
                <span>Total Nilai Faktur:</span>
                <span className="font-mono text-sm">
                  Rp {(quantity * unitPrice).toLocaleString('id-ID')}
                </span>
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
                  Terima Barang & Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
