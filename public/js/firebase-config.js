// ================================================================
//  firebase-config.js — DaPenDig
//  Desa Karang Sengon · Klabang · Bondowoso
//  Catatan: Firebase di-init inline di app.html (compat mode)
//  File ini dipakai oleh index.html (login page)
// ================================================================

// Konfigurasi Firebase — identik dengan yang ada di app.html
var FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBoQyPIVSp3iAqElO8H6utBSW90fcHqoNI",
  authDomain:        "dapendig.firebaseapp.com",
  projectId:         "dapendig",
  storageBucket:     "dapendig.firebasestorage.app",
  messagingSenderId: "400697386418",
  appId:             "1:400697386418:web:855f4984e4b4207ceeb0ab"
};

// Inisialisasi hanya jika belum diinit (mencegah error duplikat)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
  } catch (e) {
    console.error('[firebase-config] Init error:', e);
  }
}
