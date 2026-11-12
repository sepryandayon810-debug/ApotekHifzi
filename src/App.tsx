/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Root Application Component - Apotek Hifzi Farma
 * Arsitektur Terpusat: Seluruh kalkulasi & aturan bisnis dikendalikan di layer Core
 */

import React, { useState } from 'react';
import { NavMenuId, Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { RuleInspectorModal } from './components/layout/RuleInspectorModal';

// Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { POSKasirPage } from './pages/kasir/POSKasirPage';
import { BukaShiftPage } from './pages/kasir/BukaShiftPage';
import { RiwayatKasirPage } from './pages/kasir/RiwayatKasirPage';
import { PrinterKasirPage } from './pages/kasir/PrinterKasirPage';
import { MemberPage } from './pages/crm/MemberPage';
import { PromoPage } from './pages/crm/PromoPage';
import { SesiKasirPage } from './pages/operasional/SesiKasirPage';
import { KasBankPage } from './pages/operasional/KasBankPage';
import { PembelianPage } from './pages/transaksi/PembelianPage';
import { ReturPage } from './pages/transaksi/ReturPage';
import { DefectaPage } from './pages/inventori/DefectaPage';
import { StokBatchPage } from './pages/inventori/StokBatchPage';
import { StokOpnamePage } from './pages/inventori/StokOpnamePage';
import {
  PenyesuaianStokPage,
  AuditStokPage,
  KonsinyasiPage,
} from './pages/inventori/InventoriPages';
import { MasterObatPage } from './pages/master/MasterObatPage';
import { SupplierPage, DokterPage } from './pages/master/SupplierDokterPages';
import {
  BiayaJasaPage,
  KategoriSatuanPage,
  JabatanPegawaiPages,
} from './pages/master/MasterGeneralPages';
import { LaporanPages } from './pages/laporan/LaporanPages';
import { PengaturanPages } from './pages/pengaturan/PengaturanPages';
import { PengaturanApotekHub } from './pages/pengaturan/PengaturanApotekHub';
import { LoginPage } from './pages/auth/LoginPage';
import { usePharmacy } from './core/usePharmacy';
import { PharmacyRules } from './core/business-rules';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function App() {
  const { settings, currentUser } = usePharmacy();
  const [activeMenu, setActiveMenu] = useState<NavMenuId>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRuleInspectorOpen, setIsRuleInspectorOpen] = useState(false);

  // Automatic redirect if active menu is not permitted for the user's role
  React.useEffect(() => {
    if (currentUser) {
      const isAllowed = PharmacyRules.canAccessMenu(currentUser.role, activeMenu);
      if (!isAllowed) {
        if (currentUser.role === 'Kasir') {
          setActiveMenu('pos');
        } else if (currentUser.role === 'Gudang') {
          setActiveMenu('defecta');
        } else {
          setActiveMenu('dashboard');
        }
      }
    }
  }, [currentUser?.role]);

  // If no user is logged in, show the Login Page
if (!currentUser) {
  return <LoginPage onLoginSuccess={() => setActiveMenu('dashboard')} />;
}
  
  // Dynamic font class
  const fontClass =
    settings.fontFamily === 'JetBrains Mono'
      ? 'font-mono'
      : settings.fontFamily === 'System Sans'
      ? 'font-sans'
      : 'font-sans';

  // Dynamic text scale
  const scaleClass =
    settings.textScale === 'compact'
      ? 'text-[13px]'
      : settings.textScale === 'large'
      ? 'text-[15px]'
      : 'text-sm';

  // Menu Metadata for TopNav Breadcrumbs
  const getMenuInfo = (id: NavMenuId): { title: string; category: string } => {
    switch (id) {
      case 'dashboard':
        return { title: 'Dashboard Utama', category: 'Perusahaan' };
      case 'cabang':
        return { title: 'Kelola Cabang', category: 'Perusahaan' };
      case 'pos':
        return { title: 'POS Kasir Penjualan', category: 'Menu Kasir' };
      case 'buka_shift':
        return { title: 'Buka Shift Kasir', category: 'Menu Kasir' };
      case 'riwayat_kasir':
        return { title: 'Riwayat Transaksi Kasir', category: 'Menu Kasir' };
      case 'printer_kasir':
        return { title: 'Pengaturan Printer Struk', category: 'Menu Kasir' };
      case 'member':
        return { title: 'Database Member Pasien', category: 'CRM' };
      case 'promo':
        return { title: 'Manajemen Promo & Kupon', category: 'CRM' };
      case 'sesi_kasir':
        return { title: 'Sesi Kasir & Rekonsiliasi Kas', category: 'Operasional' };
      case 'kas_bank':
        return { title: 'Buku Kas & Bank', category: 'Operasional' };
      case 'pembelian':
        return { title: 'Faktur Pembelian PBF', category: 'Transaksi' };
      case 'retur':
        return { title: 'Retur Obat', category: 'Transaksi' };
      case 'konsinyasi':
        return { title: 'Obat Konsinyasi', category: 'Inventori' };
      case 'defecta':
        return { title: 'Buku Defecta (Safety Stock)', category: 'Inventori' };
      case 'stok_batch':
        return { title: 'Stok & Batch FEFO', category: 'Inventori' };
      case 'stok_opname':
        return { title: 'Stok Opname Fisik', category: 'Inventori' };
      case 'penyesuaian_stok':
        return { title: 'Penyesuaian Stok', category: 'Inventori' };
      case 'audit_stok':
        return { title: 'Audit Mutasi Stok', category: 'Inventori' };
      case 'lap_penjualan':
        return { title: 'Laporan Penjualan', category: 'Laporan' };
      case 'lap_pembelian':
        return { title: 'Laporan Pembelian', category: 'Laporan' };
      case 'lap_inventori':
        return { title: 'Laporan Nilai Inventori', category: 'Laporan' };
      case 'lap_konsinyasi':
        return { title: 'Laporan Konsinyasi', category: 'Laporan' };
      case 'lap_keuangan':
        return { title: 'Laporan Keuangan', category: 'Laporan' };
      case 'lap_member':
        return { title: 'Laporan Member', category: 'Laporan' };
      case 'lap_audit':
        return { title: 'Laporan Audit Sistem', category: 'Laporan' };
      case 'master_obat':
        return { title: 'Master Data Obat', category: 'Data Master' };
      case 'supplier':
        return { title: 'Master Supplier PBF', category: 'Data Master' };
      case 'kategori_satuan':
        return { title: 'Kategori & Satuan', category: 'Data Master' };
      case 'dokter':
        return { title: 'Master Dokter Penulis Resep', category: 'Data Master' };
      case 'biaya_jasa':
        return { title: 'Tarif Tuslah & Jasa Farmasi', category: 'Data Master' };
      case 'jabatan':
        return { title: 'Master Jabatan', category: 'Data Master' };
      case 'pegawai':
        return { title: 'Master Pegawai', category: 'Data Master' };
      case 'pengguna':
        return { title: 'Manajemen Pengguna', category: 'Pengaturan' };
      case 'role_akses':
        return { title: 'Role & Hak Akses', category: 'Pengaturan' };
      case 'umum':
        return { title: 'Pengaturan Umum Profil', category: 'Pengaturan' };
      case 'metode_pembayaran':
        return { title: 'Metode Pembayaran', category: 'Pengaturan' };
      case 'bagan_akun':
        return { title: 'Bagan Akun (CoA)', category: 'Pengaturan' };
      default:
        return { title: 'Apotek Hifzi Farma', category: 'Sistem' };
    }
  };

  const menuInfo = getMenuInfo(activeMenu);

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 ${fontClass} ${scaleClass}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={(id) => setActiveMenu(id)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenRuleInspector={() => setIsRuleInspectorOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <TopNav
          currentTitle={menuInfo.title}
          categoryTitle={menuInfo.category}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenRuleInspector={() => setIsRuleInspectorOpen(true)}
        />

        {/* Viewport Router Content with Central RBAC Protection */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {!PharmacyRules.canAccessMenu(currentUser.role, activeMenu) ? (
            <div className="p-8 max-w-xl mx-auto mt-12 bg-white rounded-3xl border border-rose-200 shadow-sm text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Hak Akses Menu Dibatasi</h3>
                <p className="text-xs text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
                  Peran aktif Anda saat ini adalah <strong>{currentUser.role}</strong> ({currentUser.name}).
                  Berdasarkan aturan bisnis terpusat apotek, menu <em>"{menuInfo.title}"</em> dikunci khusus untuk peran yang berwenang.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (currentUser.role === 'Kasir') setActiveMenu('pos');
                    else if (currentUser.role === 'Gudang') setActiveMenu('defecta');
                    else setActiveMenu('dashboard');
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Menu Utama Peran ({currentUser.role})</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeMenu === 'dashboard' && (
                <DashboardPage
                  onNavigate={(id) => setActiveMenu(id)}
                  onOpenRuleInspector={() => setIsRuleInspectorOpen(true)}
                />
              )}

              {activeMenu === 'cabang' && <PengaturanPages type="cabang" />}

              {/* Menu Kasir */}
              {activeMenu === 'pos' && <POSKasirPage />}
              {activeMenu === 'buka_shift' && (
                <BukaShiftPage onNavigateToPOS={() => setActiveMenu('pos')} />
              )}
              {activeMenu === 'riwayat_kasir' && <RiwayatKasirPage />}
              {activeMenu === 'printer_kasir' && <PengaturanApotekHub />}

              {/* CRM */}
              {activeMenu === 'member' && <MemberPage />}
              {activeMenu === 'promo' && <PromoPage />}

              {/* Operasional */}
              {activeMenu === 'sesi_kasir' && <SesiKasirPage />}
              {activeMenu === 'kas_bank' && <KasBankPage />}

              {/* Transaksi */}
              {activeMenu === 'pembelian' && <PembelianPage />}
              {activeMenu === 'retur' && <ReturPage />}

              {/* Inventori */}
              {activeMenu === 'konsinyasi' && <KonsinyasiPage />}
              {activeMenu === 'defecta' && <DefectaPage />}
              {activeMenu === 'stok_batch' && <StokBatchPage />}
              {activeMenu === 'stok_opname' && <StokOpnamePage />}
              {activeMenu === 'penyesuaian_stok' && <PenyesuaianStokPage />}
              {activeMenu === 'audit_stok' && <AuditStokPage />}

              {/* Laporan */}
              {(activeMenu === 'lap_penjualan' ||
                activeMenu === 'lap_pembelian' ||
                activeMenu === 'lap_inventori' ||
                activeMenu === 'lap_konsinyasi' ||
                activeMenu === 'lap_keuangan' ||
                activeMenu === 'lap_member' ||
                activeMenu === 'lap_audit') && <LaporanPages type={activeMenu} />}

              {/* Data Master */}
              {activeMenu === 'master_obat' && (
                <MasterObatPage onOpenRuleInspector={() => setIsRuleInspectorOpen(true)} />
              )}
              {activeMenu === 'supplier' && <SupplierPage />}
              {activeMenu === 'kategori_satuan' && <KategoriSatuanPage />}
              {activeMenu === 'dokter' && <DokterPage />}
              {activeMenu === 'biaya_jasa' && <BiayaJasaPage />}
              {activeMenu === 'jabatan' && <JabatanPegawaiPages view="jabatan" />}
              {activeMenu === 'pegawai' && <JabatanPegawaiPages view="pegawai" />}

              {/* Pengaturan Master */}
              {activeMenu === 'umum' && <PengaturanApotekHub />}
              {(activeMenu === 'pengguna' ||
                activeMenu === 'role_akses' ||
                activeMenu === 'metode_pembayaran' ||
                activeMenu === 'bagan_akun') && <PengaturanPages type={activeMenu} />}
            </>
          )}
        </main>
      </div>

      {/* Central Rules & Calculations Live Inspector Modal */}
      <RuleInspectorModal
        isOpen={isRuleInspectorOpen}
        onClose={() => setIsRuleInspectorOpen(false)}
      />
    </div>
  );
}
