// ============================================================
// auth.js — Autentikasi & Role-Based Access Control (RBAC)
// Login memakai collection 'users' di Firestore (password di-hash SHA-256).
// UNTUK PRODUKSI: disarankan menambah Firebase Authentication.
// ============================================================
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase-config.js";

export const ROLE_LABEL = {
  developer: 'Developer',
  owner: 'Owner',
  admin: 'Admin',
  staff: 'Staff / Kasir'
};

// Menu + role yang boleh mengaksesnya
export const MENU = [
  { id: 'dashboard', label: '📊 Dasbor',              href: 'index.html',     roles: ['developer', 'owner', 'admin', 'staff'] },
  { id: 'pos',       label: '💵 Kasir / POS',         href: 'pos.html',       roles: ['developer', 'owner', 'admin', 'staff'] },
  { id: 'inventory', label: '📦 Inventaris & Opname', href: 'inventory.html', roles: ['developer', 'owner', 'admin'] },
  { id: 'stockcard', label: '🧾 Kartu Stok Obat',     href: 'stockcard.html', roles: ['developer', 'owner', 'admin', 'staff'] },
  { id: 'patients',  label: '🧑‍⚕️ Pasien & Resep',      href: 'patients.html',  roles: ['developer', 'owner', 'admin', 'staff'] },
  { id: 'reports',   label: '📈 Laporan Keuangan',    href: 'reports.html',   roles: ['developer', 'owner', 'admin'] },
  { id: 'suppliers', label: '🚚 Pemasok',             href: 'suppliers.html', roles: ['developer', 'owner', 'admin'] },
  { id: 'settings',  label: '⚙️ Pengaturan Sistem',   href: 'settings.html',  roles: ['developer', 'owner'] },
];

export function getSession() {
  try { return JSON.parse(sessionStorage.getItem('apotek_session')); }
  catch { return null; }
}

export function can(session, menuId) {
  const m = MENU.find(x => x.id === menuId);
  return !!m && m.roles.includes(session?.role);
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function login(email, password) {
  const q = query(
    collection(db, 'users'),
    where('email', '==', email.trim().toLowerCase()),
    where('aktif', '==', true)
  );
  const snap = await getDocs(q);
  if (snap.empty) throw new Error('Email tidak terdaftar atau nonaktif.');
  const u = snap.docs[0];
  const data = u.data();
  if (data.password !== await sha256(password)) throw new Error('Password salah.');
  const session = { uid: u.id, email: data.email, nama: data.nama, role: data.role };
  sessionStorage.setItem('apotek_session', JSON.stringify(session));
  return session;
}

export function logout() {
  sessionStorage.removeItem('apotek_session');
  location.href = 'login.html';
}

// Proteksi halaman: wajib login + role sesuai. Redirect otomatis jika tidak.
export function guard(menuId) {
  const s = getSession();
  if (!s) { location.href = 'login.html'; return null; }
  if (menuId && !can(s, menuId)) { location.href = 'index.html'; return null; }
  return s;
}

// Render sidebar sesuai role pengguna yang sedang login
export function renderNav(active) {
  const s = getSession();
  const side = document.getElementById('sidebar');
  side.innerHTML = `
    <div class="brand">💊 <span>Apotek<span class="brand-sub">Sehat Selalu</span></span></div>
    <nav>
      ${MENU.filter(m => can(s, m.id))
        .map(m => `<a href="${m.href}" class="${m.id === active ? 'active' : ''}">${m.label}</a>`)
        .join('')}
    </nav>
    <div class="side-foot">
      <div class="user-chip"><b>${s.nama}</b><span>${ROLE_LABEL[s.role] || s.role}</span></div>
      <button class="btn btn-ghost btn-block" id="btnLogout">Keluar</button>
    </div>`;
  document.getElementById('btnLogout').onclick = logout;
  const burger = document.getElementById('burger');
  if (burger) burger.onclick = () => side.classList.toggle('open');
}
