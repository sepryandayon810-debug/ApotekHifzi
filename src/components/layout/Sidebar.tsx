/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Sidebar Navigation Component
 * Replicates the exact mobile drawer and desktop sidebar from user screenshots:
 * Apotek Hifzi Farma, Sepryanda Yon (Administrator)
 */

import React from 'react';
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  Clock,
  History,
  Printer,
  Users,
  Tag,
  ReceiptText,
  Wallet,
  ShoppingBag,
  RotateCcw,
  Handshake,
  AlertTriangle,
  Boxes,
  ClipboardCheck,
  SlidersHorizontal,
  FileText,
  Pill,
  Truck,
  Layers,
  Stethoscope,
  BadgeDollarSign,
  Briefcase,
  UserCheck,
  UserCog,
  ShieldCheck,
  Settings,
  CreditCard,
  BookOpen,
  LogOut,
  ChevronRight,
  Sliders,
  X
} from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';
import { PharmacyRules } from '../../core/business-rules';
import { UserRole } from '../../types/pharmacy';

export type NavMenuId =
  // Perusahaan
  | 'dashboard'
  | 'cabang'
  // Menu Kasir
  | 'pos'
  | 'buka_shift'
  | 'riwayat_kasir'
  | 'printer_kasir'
  // CRM
  | 'member'
  | 'promo'
  // Operasional
  | 'sesi_kasir'
  | 'kas_bank'
  // Transaksi
  | 'pembelian'
  | 'retur'
  // Inventori
  | 'konsinyasi'
  | 'defecta'
  | 'stok_batch'
  | 'stok_opname'
  | 'penyesuaian_stok'
  | 'audit_stok'
  // Laporan
  | 'lap_penjualan'
  | 'lap_pembelian'
  | 'lap_inventori'
  | 'lap_konsinyasi'
  | 'lap_keuangan'
  | 'lap_member'
  | 'lap_audit'
  // Data Master
  | 'master_obat'
  | 'supplier'
  | 'kategori_satuan'
  | 'dokter'
  | 'biaya_jasa'
  | 'jabatan'
  | 'pegawai'
  // Pengaturan
  | 'pengguna'
  | 'role_akses'
  | 'umum'
  | 'metode_pembayaran'
  | 'bagan_akun';

interface NavSection {
  title: string;
  items: {
    id: NavMenuId;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
  }[];
}

interface SidebarProps {
  activeMenu: NavMenuId;
  onSelectMenu: (menu: NavMenuId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenRuleInspector: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  isOpenMobile,
  onCloseMobile,
  onOpenRuleInspector,
}) => {
  const {
    defectaItems,
    nearExpiryBatches,
    currentShift,
    settings,
    currentUser,
    logout,
    switchRole,
  } = usePharmacy();

  // Dynamic theme background class
  const themeBgColor =
    settings.themeColor === 'teal'
      ? 'bg-[#0f766e]'
      : settings.themeColor === 'green'
      ? 'bg-[#16a34a]'
      : settings.themeColor === 'blue'
      ? 'bg-[#1e40af]'
      : settings.themeColor === 'slate'
      ? 'bg-[#1e293b]'
      : 'bg-[#1b7a42]'; // emerald default

  const sections: NavSection[] = [
    {
      title: 'PERUSAHAAN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'cabang', label: 'Kelola Cabang', icon: Store },
      ],
    },
    {
      title: 'MENU KASIR',
      items: [
        { id: 'pos', label: 'POS Kasir', icon: ShoppingCart },
        { id: 'buka_shift', label: 'Buka Shift', icon: Clock, badge: currentShift ? 'Aktif' : undefined },
        { id: 'riwayat_kasir', label: 'Riwayat Kasir', icon: History },
        { id: 'printer_kasir', label: 'Printer Kasir', icon: Printer },
      ],
    },
    {
      title: 'CRM',
      items: [
        { id: 'member', label: 'Member', icon: Users },
        { id: 'promo', label: 'Promo', icon: Tag },
      ],
    },
    {
      title: 'OPERASIONAL',
      items: [
        { id: 'sesi_kasir', label: 'Sesi Kasir', icon: ReceiptText },
        { id: 'kas_bank', label: 'Kas & Bank', icon: Wallet },
      ],
    },
    {
      title: 'TRANSAKSI',
      items: [
        { id: 'pembelian', label: 'Pembelian', icon: ShoppingBag },
        { id: 'retur', label: 'Retur', icon: RotateCcw },
      ],
    },
    {
      title: 'INVENTORI',
      items: [
        { id: 'konsinyasi', label: 'Konsinyasi', icon: Handshake },
        {
          id: 'defecta',
          label: 'Defecta',
          icon: AlertTriangle,
          badge: defectaItems.length > 0 ? defectaItems.length : undefined,
        },
        {
          id: 'stok_batch',
          label: 'Stok & Batch',
          icon: Boxes,
          badge: nearExpiryBatches.length > 0 ? `${nearExpiryBatches.length} Exp` : undefined,
        },
        { id: 'stok_opname', label: 'Stok Opname', icon: ClipboardCheck },
        { id: 'penyesuaian_stok', label: 'Penyesuaian Stok', icon: SlidersHorizontal },
        { id: 'audit_stok', label: 'Audit Stok', icon: FileText },
      ],
    },
    {
      title: 'LAPORAN',
      items: [
        { id: 'lap_penjualan', label: 'Lap. Penjualan', icon: ReceiptText },
        { id: 'lap_pembelian', label: 'Lap. Pembelian', icon: ShoppingBag },
        { id: 'lap_inventori', label: 'Lap. Inventori', icon: Boxes },
        { id: 'lap_konsinyasi', label: 'Lap. Konsinyasi', icon: Handshake },
        { id: 'lap_keuangan', label: 'Lap. Keuangan', icon: BookOpen },
        { id: 'lap_member', label: 'Lap. Member', icon: Users },
        { id: 'lap_audit', label: 'Lap. Audit', icon: ShieldCheck },
      ],
    },
    {
      title: 'DATA MASTER',
      items: [
        { id: 'master_obat', label: 'Master Obat', icon: Pill },
        { id: 'supplier', label: 'Supplier', icon: Truck },
        { id: 'kategori_satuan', label: 'Kategori & Satuan', icon: Layers },
        { id: 'dokter', label: 'Dokter', icon: Stethoscope },
        { id: 'biaya_jasa', label: 'Biaya Jasa', icon: BadgeDollarSign },
        { id: 'jabatan', label: 'Jabatan', icon: Briefcase },
        { id: 'pegawai', label: 'Pegawai', icon: UserCheck },
      ],
    },
    {
      title: 'PENGATURAN',
      items: [
        { id: 'pengguna', label: 'Pengguna', icon: UserCog },
        { id: 'role_akses', label: 'Role & Akses', icon: ShieldCheck },
        { id: 'umum', label: 'Umum & Cloud', icon: Settings },
        { id: 'metode_pembayaran', label: 'Metode Pembayaran', icon: CreditCard },
        { id: 'bagan_akun', label: 'Bagan Akun (CoA)', icon: BookOpen },
      ],
    },
  ];

  // Rule Terpusat: Filter menu yang diizinkan untuk Role Pengguna Aktif
  const activeRole: UserRole = currentUser?.role || 'Administrator';
  const accessibleSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => PharmacyRules.canAccessMenu(activeRole, item.id)),
    }))
    .filter((section) => section.items.length > 0);

  const handleItemClick = (id: NavMenuId) => {
    onSelectMenu(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full ${themeBgColor} text-white select-none transition-colors duration-300`}>
      {/* Header Profile matching user & active role */}
      <div className="p-4 border-b border-white/20 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-lg text-white shadow-inner shrink-0">
              {currentUser?.avatarLetter || settings.logoInitial || 'U'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-white text-sm tracking-tight truncate max-w-[125px]">
                  {currentUser?.name || 'Pengguna'}
                </span>
                <span className="text-[10px] font-bold bg-black/40 text-emerald-200 px-2 py-0.5 rounded-full border border-white/20 shrink-0">
                  {currentUser?.role || 'User'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/90 mt-0.5">
                <Store className="w-3.5 h-3.5 opacity-80 shrink-0" />
                <span className="truncate max-w-[140px]">{settings.pharmacyName}</span>
              </div>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

       {/* Central Architecture Live Rules Button (Hanya tampil untuk Owner & Developer) */}
{(activeRole === 'Developer' || activeRole === 'Owner') && (
  <button
    onClick={onOpenRuleInspector}
    className="w-full mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-xs text-emerald-100 border border-emerald-500/40 transition-colors shadow-sm"
  >
    <div className="flex items-center gap-2">
      <Sliders className="w-3.5 h-3.5 text-emerald-300" />
      <span className="font-medium">Rule & Perhitungan Terpusat</span>
    </div>
    <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded text-emerald-100">Live</span>
  </button>
)}

        {/* Central Architecture Live Rules Button */}
        <button
          onClick={onOpenRuleInspector}
          className="w-full mt-2.5 flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-xs text-emerald-100 border border-emerald-500/40 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-medium">Rule & Perhitungan Terpusat</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded text-emerald-100">Live</span>
        </button>
      </div>

      {/* Navigation Scrollable Section (Only accessible items) */}
      <div className="flex-1 overflow-y-auto py-2 px-2.5 space-y-4 scrollbar-thin scrollbar-thumb-emerald-800">
        {accessibleSections.map((section) => (
          <div key={section.title} className="space-y-0.5">
            <div className="px-3 py-1 text-[11px] font-semibold text-emerald-200/70 tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left ${
                    isActive
                      ? 'bg-emerald-900 text-white font-medium shadow-sm'
                      : 'text-emerald-50 hover:bg-emerald-700/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-200'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-semibold bg-emerald-950/80 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-600/30">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 opacity-40 transition-transform ${isActive ? 'opacity-100 translate-x-0.5' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Keluar */}
      <div className="p-3 border-t border-emerald-600/40 bg-[#166737] shrink-0">
        <button
          onClick={() => {
            if (confirm(`Keluar dari akun ${currentUser?.name || ''} (${activeRole})?`)) {
              logout();
            }
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-emerald-100 hover:bg-emerald-800/60 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold">Keluar Akun</span>
          </div>
          <span className="text-[10px] text-emerald-200/80 font-mono bg-black/20 px-2 py-0.5 rounded">
            {activeRole}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 shrink-0 border-r border-emerald-700/30 flex-col h-screen sticky top-0 shadow-md">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slides out just like in screenshots) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
