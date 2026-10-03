// ============================================================
// firebase-config.js — Inisialisasi Firebase / Firestore
// GANTI nilai di bawah dengan konfigurasi project Firebase Anda.
// (Firebase Console → Project Settings → "Your apps" → Web app)
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCF2nBwzMTvSilTZBTlPfBb_-8P33SbXPU",
  authDomain: "managementhifzicellv2.firebaseapp.com",
  projectId: "managementhifzicellv2",
  storageBucket: "managementhifzicellv2.firebasestorage.app",
  messagingSenderId: "543101815187",
  appId: "1:543101815187:web:99f0dbc95766e4c2434066"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
