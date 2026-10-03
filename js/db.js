// ============================================================
// db.js — Helper Firestore terpusat (CRUD, subscribe, counter)
// ============================================================
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, onSnapshot, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebase-config.js";

export { serverTimestamp };

// Ambil semua dokumen (opsional orderBy)
export async function list(collName, ...constraints) {
  const q = constraints.length
    ? query(collection(db, collName), ...constraints)
    : collection(db, collName);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getOne(collName, id) {
  const snap = await getDoc(doc(db, collName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export const add = (collName, data) => addDoc(collection(db, collName), data);
export const update = (collName, id, data) => updateDoc(doc(db, collName, id), data);
export const remove = (collName, id) => deleteDoc(doc(db, collName, id));

// Real-time listener
export function subscribe(collName, cb, ...constraints) {
  const q = constraints.length
    ? query(collection(db, collName), ...constraints)
    : collection(db, collName);
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

// Nomor transaksi berurutan: TRX-20261003-0001 / PO-20261003-0001
export async function nextNumber(field, prefix) {
  const ref = doc(db, 'settings', 'counters');
  const n = await runTransaction(db, async (t) => {
    const s = await t.get(ref);
    const data = s.exists() ? s.data() : {};
    const cur = (data[field] || 0) + 1;
    t.set(ref, { ...data, [field]: cur }, { merge: true });
    return cur;
  });
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `${prefix}-${ymd}-${String(n).padStart(4, '0')}`;
}

// Normalisasi tanggal Firestore Timestamp / ISO string -> Date
export const toDate = (t) =>
  t?.toDate ? t.toDate() : (t?.seconds ? new Date(t.seconds * 1000) : new Date(t || Date.now()));
