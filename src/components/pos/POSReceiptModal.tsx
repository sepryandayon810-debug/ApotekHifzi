/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * POS Thermal Receipt Modal (Struk Kasir Apotek 58mm / 80mm)
 */

import React from 'react';
import { X, Printer, CheckCircle2, Download } from 'lucide-react';
import { SaleTransaction } from '../../types/pharmacy';
import { usePharmacy } from '../../core/usePharmacy';

interface POSReceiptModalProps {
  transaction: SaleTransaction | null;
  onClose: () => void;
}

export const POSReceiptModal: React.FC<POSReceiptModalProps> = ({ transaction, onClose }) => {
  const { settings } = usePharmacy();

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const is58 = settings.printerPaperWidth === '58mm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className={`relative w-full ${is58 ? 'max-w-xs' : 'max-w-sm'} bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] z-10 animate-in zoom-in-95`}>
        {/* Header */}
        <div className="px-4 py-3 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-bold">Struk Kasir ({settings.printerPaperWidth})</span>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Thermal Paper View */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div
            id="thermal-receipt-print-area"
            className={`w-full bg-white p-4 shadow-sm border border-slate-200 text-slate-800 font-mono text-[11px] leading-relaxed ${is58 ? 'max-w-[250px]' : 'max-w-[320px]'}`}
          >
            {/* Header Apotek */}
            <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">{settings.printHeader || settings.pharmacyName}</h3>
              <p className="text-[10px] text-slate-600">{settings.address}</p>
              <p className="text-[10px] text-slate-600">Telp: {settings.phone}</p>
              {settings.showPharmacistOnReceipt && (
                <>
                  <p className="text-[9px] text-slate-500 mt-0.5">APA: {settings.pharmacistInCharge}</p>
                  <p className="text-[9px] text-slate-500">SIPA: {settings.sipaNumber}</p>
                </>
              )}
            </div>

            {/* Info Transaksi */}
            <div className="space-y-0.5 border-b border-dashed border-slate-300 pb-2 mb-2 text-[10px]">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-semibold">{transaction.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{transaction.cashierName}</span>
              </div>
              {transaction.memberName && (
                <div className="flex justify-between">
                  <span>Pasien/Member:</span>
                  <span>{transaction.memberName}</span>
                </div>
              )}
              {transaction.prescription && (
                <div className="pt-1 border-t border-dotted border-slate-200 text-[9px] text-emerald-900">
                  <div>R/: {transaction.prescription.prescriptionNumber}</div>
                  <div>Dokter: {transaction.prescription.doctorName}</div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="border-b border-dashed border-slate-300 pb-2 mb-2 space-y-1.5">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-semibold text-slate-900">{item.product.name}</div>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>
                      {item.quantity} {item.product.unit} x Rp {item.unitPrice.toLocaleString('id-ID')}
                      <span className="text-[9px] text-slate-400 ml-1">({item.batch.batchNumber})</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculation Totals */}
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rp {transaction.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {transaction.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon:</span>
                  <span>-Rp {transaction.discountTotal.toLocaleString('id-ID')}</span>
                </div>
              )}
              {transaction.tuslahTotal > 0 && (
                <div className="flex justify-between">
                  <span>Tuslah Farmasi:</span>
                  <span>Rp {transaction.tuslahTotal.toLocaleString('id-ID')}</span>
                </div>
              )}
              {transaction.embalaseTotal > 0 && (
                <div className="flex justify-between">
                  <span>Embalase Wadah:</span>
                  <span>Rp {transaction.embalaseTotal.toLocaleString('id-ID')}</span>
                </div>
              )}
              {transaction.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>PPN:</span>
                  <span>Rp {transaction.taxAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {transaction.roundingAmount !== 0 && (
                <div className="flex justify-between text-slate-500 text-[9px]">
                  <span>Pembulatan:</span>
                  <span>+Rp {transaction.roundingAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-300 pt-1 mt-1">
                <span>TOTAL:</span>
                <span className="text-emerald-700">Rp {transaction.grandTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span>Metode:</span>
                <span>{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Bayar:</span>
                <span>Rp {transaction.amountPaid.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembali:</span>
                <span>Rp {transaction.change.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t border-dashed border-slate-300 pt-3 mt-3 text-[9px] text-slate-500 space-y-0.5">
              <p className="font-semibold text-slate-700">{settings.printFooter}</p>
              <p className="text-[8px] text-slate-400">Barang yang sudah dibeli tidak dapat ditukar kecuali perjanjian</p>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Thermal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
