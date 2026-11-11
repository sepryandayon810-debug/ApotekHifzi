/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ============================================================================
 * PANDUAN PENGISIAN KONEKSI DATABASE FIREBASE FIRESTORE (ONLINE + OFFLINE)
 * ============================================================================
 * 
 * Halo! File ini adalah jembatan koneksi antara Apotek Hifzi Farma dengan
 * database Cloud Firestore.
 * 
 * CARA MENGISI KONEKSI:
 * 1. Buka https://console.firebase.google.com/
 * 2. Buat Project baru (misal: "apotek-hifzi-farma")
 * 3. Pilih "Firestore Database" -> Klik "Create Database" -> Pilih mode produksi / test.
 * 4. Buka Project Settings (ikon gerigi di kiri atas) -> Pilih tab "General".
 * 5. Gulir ke bawah ke bagian "Your apps" -> Klik ikon Web (</>) -> Masukkan nama app.
 * 6. Salin objek `firebaseConfig` yang muncul, lalu isi nilai-nilainya di bawah ini:
 * 
 * CATATAN PENTING KEAMANAN DATA (OFFLINE + ONLINE):
 * - Sistem ini dibangun dengan arsitektur OFFLINE-FIRST (Local Cache).
 * - Seluruh data obat, transaksi kasir, dan stok TETAP TERSIMPAN AMAN di memori
 *   perangkat lokal walaupun internet mati total.
 * - Saat internet tersambung kembali, data akan otomatis tersinkronisasi ke Cloud Firestore.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Konfigurasi Default / Manual.
 * Anda dapat langsung mengganti string di bawah ini dengan kredensial Firebase Anda!
 */
export const MANUAL_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: '', // Masukkan Web API Key dari Firebase Console di sini
  authDomain: '', // Contoh: apotek-hifzi-farma.firebaseapp.com
  projectId: '', // Contoh: apotek-hifzi-farma
  storageBucket: '', // Contoh: apotek-hifzi-farma.appspot.com
  messagingSenderId: '', // Contoh: 123456789012
  appId: '', // Contoh: 1:123456789012:web:abcdef123456
};

const STORAGE_KEY = 'hf_firebase_config';

/**
 * Mendapatkan konfigurasi aktif (prioritas dari input UI LocalStorage, lalu dari file ini)
 */
export function getActiveFirebaseConfig(): FirebaseConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.projectId) return parsed;
    }
  } catch {
    // fallback
  }
  return MANUAL_FIREBASE_CONFIG;
}

/**
 * Menyimpan konfigurasi dari UI ke LocalStorage
 */
export function saveFirebaseConfig(config: FirebaseConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/**
 * Mengecek apakah konfigurasi Firebase sudah diisi oleh pengguna
 */
export function isFirebaseConfigured(): boolean {
  const config = getActiveFirebaseConfig();
  return Boolean(
    config.apiKey &&
    config.projectId &&
    config.apiKey.trim() !== '' &&
    config.projectId.trim() !== ''
  );
}

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;

/**
 * Inisialisasi Firebase App & Firestore dengan Offline Persistence
 */
export function getFirebaseFirestore(): { app: FirebaseApp; db: Firestore } | null {
  const config = getActiveFirebaseConfig();
  if (!config.projectId || !config.apiKey) {
    return null;
  }

  try {
    if (!cachedApp) {
      if (getApps().length > 0) {
        cachedApp = getApp();
      } else {
        cachedApp = initializeApp(config);
      }
    }

    if (!cachedDb && cachedApp) {
      // Mengaktifkan Offline Persistence berstandar enterprise
      try {
        cachedDb = initializeFirestore(cachedApp, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        });
      } catch {
        // Fallback jika sudah diinisialisasi sebelumnya
        cachedDb = getFirestore(cachedApp);
      }
    }

    return cachedApp && cachedDb ? { app: cachedApp, db: cachedDb } : null;
  } catch (err) {
    console.warn('Inisialisasi Firebase tertunda:', err);
    return null;
  }
}

/**
 * Fungsi untuk menguji koneksi Firebase Cloud secara langsung
 */
export async function testFirebaseConnection(): Promise<{
  success: boolean;
  message: string;
  details?: string;
}> {
  const config = getActiveFirebaseConfig();
  if (!config.projectId || !config.apiKey) {
    return {
      success: false,
      message: 'Kredensial Firebase belum diisi. Silakan masukkan Project ID dan API Key.',
    };
  }

  try {
    const initialized = getFirebaseFirestore();
    if (!initialized) {
      return {
        success: false,
        message: 'Gagal menginisialisasi Firebase SDK. Periksa format konfigurasi.',
      };
    }

    // Ping write & read ke collection healthcheck
    const testDocRef = doc(initialized.db, 'system_health', 'connection_test');
    await setDoc(testDocRef, {
      lastChecked: new Date().toISOString(),
      appName: 'Apotek Hifzi Farma',
      status: 'CONNECTED',
    });

    const testSnap = await getDoc(testDocRef);
    if (testSnap.exists()) {
      return {
        success: true,
        message: `Berhasil terhubung ke Cloud Firestore (${config.projectId})! Fitur sinkronisasi online aktif.`,
      };
    } else {
      return {
        success: false,
        message: 'Dokumen uji tidak terbaca kembali. Periksa Firestore Security Rules di Firebase Console.',
      };
    }
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    return {
      success: false,
      message: 'Koneksi gagal. Periksa koneksi internet atau Firestore Rules.',
      details: errorMsg,
    };
  }
}

/**
 * Sinkronisasi data lokal (Cadangan Lengkap) ke Cloud Firestore
 */
export async function syncLocalDataToCloud(fullData: any): Promise<{
  success: boolean;
  message: string;
}> {
  const initialized = getFirebaseFirestore();
  if (!initialized) {
    return {
      success: false,
      message: 'Firebase belum terhubung. Konfigurasikan kredensial terlebih dahulu.',
    };
  }

  try {
    const backupDocRef = doc(initialized.db, 'pharmacy_backups', 'latest_state');
    await setDoc(backupDocRef, {
      syncedAt: new Date().toISOString(),
      pharmacyName: fullData.pharmacyName || 'Apotek Hifzi Farma',
      version: '2.4',
      payload: fullData,
    });

    return {
      success: true,
      message: 'Seluruh database lokal berhasil disinkronkan ke Cloud Firestore!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Gagal sinkronisasi ke cloud: ${error?.message || String(error)}`,
    };
  }
}
