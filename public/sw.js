// ================================================================
//  sw.js — Service Worker DaPenDig
//  Desa Karang Sengon · Klabang · Bondowoso
//  Strategi: Cache First untuk aset statis, Network First untuk Firebase
// ================================================================

var CACHE_NAME = 'dapendig-v1';

// Aset yang di-cache saat install
var PRECACHE = [
  '/',
  '/index.html',
  '/app.html',
  '/css/style.css',
  '/js/firebase-config.js',
  '/js/auth.js',
  '/js/ui.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// URL yang tidak pernah di-cache (Firebase, CDN dinamis)
var NEVER_CACHE = [
  'firestore.googleapis.com',
  'firebase.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'firebaseapp.com',
  'googleapis.com/identitytoolkit'
];

// ── INSTALL ──────────────────────────────────────────────────────
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE.map(function (url) {
        return new Request(url, { cache: 'reload' });
      }));
    }).then(function () {
      return self.skipWaiting();
    }).catch(function (err) {
      console.warn('[SW] Precache gagal (normal di dev):', err);
    })
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────────
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// ── FETCH ────────────────────────────────────────────────────────
self.addEventListener('fetch', function (e) {
  var url = e.request.url;

  // Jangan cache Firebase / CDN auth
  var isFirebase = NEVER_CACHE.some(function (h) { return url.includes(h); });
  if (isFirebase) return;

  // Hanya handle GET
  if (e.request.method !== 'GET') return;

  // Hanya handle http/https
  if (!url.startsWith('http')) return;

  // CDN (gstatic, cdnjs) — Network first, fallback cache
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

  // Aset lokal — Cache first, fallback network
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (res) {
        if (res && res.status === 200 && res.type !== 'opaque') {
          var clone = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function () {
        // Offline fallback untuk navigasi
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ── MESSAGE: SKIP WAITING ────────────────────────────────────────
self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
