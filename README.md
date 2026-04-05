# 🏛️ DaPenDig — Data Penduduk Digital

**Sistem Informasi Data Kependudukan Desa Karang Sengon**
Kecamatan Klabang · Kabupaten Bondowoso · Jawa Timur

[![Deploy Status](https://img.shields.io/badge/deploy-Firebase%20Hosting-orange?logo=firebase)](https://dapendig.web.app)
![Platform](https://img.shields.io/badge/platform-PWA-blue)
![License](https://img.shields.io/badge/license-Pemdes-green)

---

## 🌐 Live URL

**https://dapendig.web.app**

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|-----------|
| 👥 Data Penduduk | Tambah, edit, hapus, cari data warga |
| 📊 Monografi | Grafik sebaran penduduk per kategori |
| 🔄 Mutasi | Catat mutasi keluar & masuk |
| ⭐ Data Vital | Kelahiran & kematian |
| 📤 Ekspor Excel | Data reguler & laporan bulanan |
| 📥 Import Excel | Import dari SIAK / Excel manual |
| 🗺️ Info Wilayah | Edit nama desa, kecamatan, dll |
| 📋 Log Aktivitas | Riwayat semua perubahan data |
| 🌙☀️ Dark / Light | Toggle tema, tersimpan otomatis |
| 📲 PWA | Install ke HP / desktop, offline-ready |
| 🔒 Role-based | Admin · Operator · Viewer |

---

## 🗂️ Struktur File

```
dapendig-karang-sengon/
├── .github/workflows/deploy.yml   ← CI/CD otomatis
├── docs/
│   ├── PANDUAN_FIREBASE.md
│   ├── PANDUAN_GITHUB.md
│   └── PANDUAN_PENGGUNAAN.md
├── public/
│   ├── index.html                 ← Halaman login
│   ├── app.html                   ← Aplikasi utama
│   ├── css/style.css              ← Semua styling
│   ├── js/
│   │   ├── firebase-config.js
│   │   ├── auth.js
│   │   └── ui.js
│   ├── icons/                     ← 8 ukuran icon PWA
│   ├── manifest.json
│   └── sw.js                      ← Service Worker
├── .firebaserc
├── .gitignore
├── deploy.bat                     ← Deploy manual (Windows)
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
└── README.md
```

---

## 🚀 Deploy

### Otomatis (GitHub Actions)
Push ke branch `main` → deploy otomatis ke Firebase Hosting.

**Setup sekali:**
1. Buka repo di GitHub → Settings → Secrets → Actions
2. Tambah secret: `FIREBASE_SERVICE_ACCOUNT_DAPENDIG`
   - Isi: service account JSON dari Firebase Console

### Manual (Windows)
Double-click **`deploy.bat`** — pastikan Firebase CLI sudah login:
```bat
firebase login
```

### Manual (Terminal)
```bash
firebase deploy --only hosting
```

---

## 🔐 Role Pengguna

| Role | Lihat | Tambah/Edit | Hapus | Admin |
|------|-------|-------------|-------|-------|
| **viewer**   | ✅ | ❌ | ❌ | ❌ |
| **operator** | ✅ | ✅ | ❌ | ❌ |
| **admin**    | ✅ | ✅ | ✅ | ✅ |

Role diatur di Firestore → koleksi `users` → dokumen `{uid}` → field `role`.

---

## ⚙️ Firebase Project

- **Project ID:** `dapendig`
- **Auth Domain:** `dapendig.firebaseapp.com`
- **Database:** Firestore
- **Hosting:** `dapendig.web.app`

---

## 📖 Dokumentasi Lengkap

Lihat folder [`docs/`](./docs/) untuk panduan lengkap:
- [Panduan Firebase](./docs/PANDUAN_FIREBASE.md)
- [Panduan GitHub](./docs/PANDUAN_GITHUB.md)
- [Panduan Penggunaan](./docs/PANDUAN_PENGGUNAAN.md)

---

*© 2026 Pemerintah Desa Karang Sengon · Klabang · Bondowoso*
