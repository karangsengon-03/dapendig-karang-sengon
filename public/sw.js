// ================================================================
//  sw.js — Service Worker DaPenDig
//  Desa Karang Sengon · Klabang · Bondowoso
//
//  Strategi Update Seamless:
//  - INSTALL   : skipWaiting() langsung → tidak nunggu tab ditutup
//  - ACTIVATE  : clients.claim() → langsung ambil alih semua tab
//  - HTML/JS/CSS: Network First → selalu ambil versi terbaru dari server
//  - Gambar/font: Cache First → hemat bandwidth
//  - Firebase  : selalu bypass (tidak pernah di-cache)
//  - Soft reload: SW broadcast ke semua tab → tab reload otomatis
//
//  Cara kerja:
//  Deploy baru → SW baru install → skipWaiting langsung →
//  activate → claim tabs → broadcast 'SW_UPDATED' →
//  tab terima → window.location.reload() → user lihat versi baru
//  TANPA: uninstall, clear cache, hard refresh, close tab
// ================================================================

var CACHE_NAME = 'dapendig-v3';

// Aset gambar/font yang boleh cache-first (jarang berubah)
var CACHE_FIRST = [
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png'
];

// URL yang TIDAK PERNAH di-cache (Firebase auth & Firestore)
var NEVER_CACHE = [
  'firestore.googleapis.com',
  'firebase.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'googleapis.com/identitytoolkit',
  'firebaseapp.com/__/auth'
];

// ── INSTALL ──────────────────────────────────────────────────────
// skipWaiting() langsung → tidak perlu tutup tab / uninstall dulu
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Pre-cache hanya icon (statis, jarang berubah)
      return Promise.allSettled(
        CACHE_FIRST.map(function (url) {
          return cache.add(new Request(url, { cache: 'reload' }));
        })
      );
    }).then(function () {
      // KUNCI: langsung aktif tanpa tunggu tab lama ditutup
      return self.skipWaiting();
    })
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────────
// Hapus cache lama, claim semua tab, lalu broadcast update ke tab
self.addEventListener('activate', function (e) {
  e.waitUntil(
    // 1. Hapus cache versi lama
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) { return k !== CACHE_NAME; })
          .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      // 2. Ambil alih semua tab yang sedang buka (tanpa reload manual)
      return self.clients.claim();
    }).then(function () {
      // 3. Broadcast ke semua tab: "ada update, silakan soft reload"
      return self.clients.matchAll({ type: 'window' }).then(function (clients) {
        clients.forEach(function (client) {
          client.postMessage({ type: 'SW_UPDATED' });
        });
      });
    })
  );
});

// ── FETCH ────────────────────────────────────────────────────────
self.addEventListener('fetch', function (e) {
  var url = e.request.url;

  // Abaikan non-GET
  if (e.request.method !== 'GET') return;

  // Abaikan non-http
  if (!url.startsWith('http')) return;

  // Abaikan Firebase (selalu network langsung)
  if (NEVER_CACHE.some(function (h) { return url.includes(h); })) return;

  // ── Gambar icon: Cache First ──────────────────────────────────
  var isIcon = CACHE_FIRST.some(function (p) { return url.endsWith(p.replace(/^\//, '')); });
  if (isIcon) {
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        if (cached) return cached;
        return fetch(e.request).then(function (res) {
          if (res && res.status === 200) {
            var clone = res.clone();
            caches.open(CACHE_NAME).then(function (c) { c.put(e.request, clone); });
          }
          return res;
        });
      })
    );
    return;
  }

  // ── CDN eksternal (gstatic, cdnjs): Network First + cache fallback ──
  var isCDN = url.includes('gstatic.com') || url.includes('cdnjs.cloudflare.com');
  if (isCDN) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function () {
        return caches.match(e.request);
      })
    );
    return;
  }

  // ── HTML / JS / CSS lokal: Network First (SELALU ambil versi terbaru) ──
  // Ini yang memastikan deploy baru langsung terasa setelah soft reload
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).then(function (res) {
      if (res && res.status === 200) {
        // Simpan ke cache sebagai fallback offline
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(e.request, clone); });
      }
      return res;
    }).catch(function () {
      // Offline: pakai cache sebagai fallback
      return caches.match(e.request).then(function (cached) {
        if (cached) return cached;
        // Navigasi offline → fallback ke index.html
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ── MESSAGE ──────────────────────────────────────────────────────
// Terima pesan dari tab (misal: manual trigger update)
self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
