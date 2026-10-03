// ============================================================================
// roles.js — Konfigurasi Role-Based Access Control (RBAC)
// ============================================================================

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Truck,
  Settings,
} from "lucide-react";

export const ROLES = {
  developer: "Developer",
  owner: "Owner",
  admin: "Admin",
  staff: "Staff",
};

// Definisi menu & hak akses per role
export const MENU = [
  {
    key: "dashboard",
    label: "Dasbor",
    path: "/",
    icon: LayoutDashboard,
    roles: ["developer", "owner", "admin", "staff"],
  },
  {
    key: "pos",
    label: "Kasir / POS",
    path: "/pos",
    icon: ShoppingCart,
    roles: ["developer", "owner", "admin", "staff"],
  },
  {
    key: "inventory",
    label: "Inventaris",
    path: "/inventory",
    icon: Package,
    roles: ["developer", "owner", "admin"],
  },
  {
    key: "patients",
    label: "Pasien & Resep",
    path: "/patients",
    icon: Users,
    roles: ["developer", "owner", "admin", "staff"],
  },
  {
    key: "reports",
    label: "Laporan",
    path: "/reports",
    icon: BarChart3,
    roles: ["developer", "owner"],
  },
  {
    key: "suppliers",
    label: "Pemasok",
    path: "/suppliers",
    icon: Truck,
    roles: ["developer", "owner", "admin"],
  },
  {
    key: "settings",
    label: "Pengaturan",
    path: "/settings",
    icon: Settings,
    roles: ["developer", "owner"],
  },
];

export function getMenuForRole(role) {
  return MENU.filter((m) => m.roles.includes(role));
}

export function canAccess(path, role) {
  const item = MENU.find((m) => m.path === path);
  if (!item) return true;
  return item.roles.includes(role);
}
