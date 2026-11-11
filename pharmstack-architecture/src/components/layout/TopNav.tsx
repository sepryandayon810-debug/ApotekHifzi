/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Top Navigation Header
 */

import React from 'react';
import { Menu, Sliders, Store, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usePharmacy } from '../../core/usePharmacy';

interface TopNavProps {
  currentTitle: string;
  categoryTitle: string;
  onOpenMobileMenu: () => void;
  onOpenRuleInspector: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTitle,
  categoryTitle,
  onOpenMobileMenu,
  onOpenRuleInspector,
}) => {
  const {
    activeBranch,
    branches,
    setActiveBranch,
    currentShift,
    rules,
    settings,
    currentUser,
    logout,
  } = usePharmacy();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-700 truncate max-w-[180px]">{settings.pharmacyName}</span>
            <span>/</span>
            <span className="text-slate-600">{categoryTitle}</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-none mt-0.5">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right: Branch Selector, Shift Status, Central Rules Quick Trigger */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Branch selector */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium">
          <Store className="w-3.5 h-3.5 text-emerald-600" />
          <select
            value={activeBranch.id}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="bg-transparent border-none outline-none cursor-pointer pr-1"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Shift status */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors bg-emerald-50 text-emerald-800 border-emerald-200">
          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          {currentShift ? (
            <span>Shift: <strong className="font-semibold">{currentShift.cashierName}</strong> (Aktif)</span>
          ) : (
            <span className="text-amber-800">Shift Belum Dibuka</span>
          )}
        </div>

        {/* Central Rules & Calculations Engine Button */}
        <button
          onClick={onOpenRuleInspector}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shadow-xs transition-colors whitespace-nowrap"
          title="Buka Panel Aturan & Kalkulasi Terpusat"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Rule Terpusat</span>
          <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-[10px] font-mono">
            PPN {rules.ppnPercent}%
          </span>
        </button>

        {/* Current User Role Pill */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 rounded-lg text-xs transition-colors">
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.avatarLetter}
              </div>
              <span className="font-semibold hidden lg:inline max-w-[100px] truncate">{currentUser.name}</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm(`Keluar dari akun ${currentUser.name}?`)) {
                  logout();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Keluar / Ganti Akun"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
