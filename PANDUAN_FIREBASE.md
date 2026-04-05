# 🔥 Panduan Firebase — DaPenDig

## 1. Info Project

| Item | Nilai |
|------|-------|
| Project ID | `dapendig` |
| Auth Domain | `dapendig.firebaseapp.com` |
| Storage Bucket | `dapendig.firebasestorage.app` |
| Hosting URL | https://dapendig.web.app |

---

## 2. Struktur Firestore

### Koleksi `penduduk`
Dokumen ID = NIK (atau auto-ID)

| Field | Tipe | Keterangan |
|-------|------|-----------|
| `nik` | string | NIK 16 digit |
| `no_kk` | string | Nomor KK |
| `nama_lengkap` | string | Nama lengkap |
| `jenis_kelamin` | string | `Laki-laki` / `Perempuan` |
| `hubungan_keluarga` | string | Kepala Keluarga, Istri, Anak, dll |
| `status_perkawinan` | string | Kawin, Belum Kawin, dll |
| `pendidikan` | string | SD, SMP, SMA, D3, S1, dll |
| `pekerjaan` | string | Dari daftar PKJ |
| `golongan_darah` | string | A, B, AB, O |
| `agama` | string | Islam, Kristen, dll |
| `tempat_lahir` | string | Kota lahir |
| `tanggal_lahir` | string | Format `YYYY-MM-DD` |
| `nama_ibu` | string | Nama ibu kandung |
| `nama_ayah` | string | Nama ayah kandung |
| `rt` | string | RT (3 digit, misal `001`) |
| `rw` | string | RW (3 digit, misal `001`) |
| `status` | string | `aktif` / `nonaktif` |
| `created_by` | string | Email user yang input |
| `created_at` | timestamp | Waktu input |

### Koleksi `mutasi_keluar` / `mutasi_masuk`
| Field | Tipe |
|-------|------|
| `nik_target` | string |
| `tujuan` / `asal` | string |
| `tanggal` | string `YYYY-MM-DD` |
| `keterangan` | string |

### Koleksi `lahir`
| Field | Tipe |
|-------|------|
| `nama_lengkap` | string |
| `jenis_kelamin` | string |
| `tanggal_lahir` | string |
| `nama_ibu` | string |
| `no_kk` | string |

### Koleksi `meninggal`
| Field | Tipe |
|-------|------|
| `nik_target` | string |
| `tanggal` | string |
| `sebab` | string |

### Koleksi `users`
| Field | Tipe |
|-------|------|
| `email` | string |
| `role` | string (`admin` / `operator` / `viewer`) |
| `nama` | string |

### Koleksi `config`
Dokumen `wilayah`:
| Field | Tipe |
|-------|------|
| `desa` | string |
| `kecamatan` | string |
| `kabupaten` | string |
| `provinsi` | string |
| `tahun` | string |

### Koleksi `log`
| Field | Tipe |
|-------|------|
| `aksi` | string |
| `keterangan` | string |
| `nik_target` | string |
| `oleh` | string (email) |
| `ts` | timestamp |

---

## 3. Setup Pengguna Baru

1. Buka **Firebase Console** → Authentication → Users → Add User
2. Masukkan email dan password
3. Salin UID pengguna baru
4. Buka Firestore → koleksi `users` → buat dokumen dengan ID = UID tersebut
5. Isi field:
   ```
   email: "email@desa.go.id"
   role:  "operator"
   nama:  "Nama Perangkat"
   ```

**Role yang tersedia:**
- `admin` — akses penuh
- `operator` — tambah & edit data, tidak bisa hapus
- `viewer` — hanya lihat data

---

## 4. Deploy Rules & Indexes

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes

# Deploy hosting saja
firebase deploy --only hosting

# Deploy semua sekaligus
firebase deploy
```

---

## 5. Backup Data

Untuk backup manual:
1. Ekspor data dari aplikasi (menu Ekspor Data → Excel)
2. Untuk backup Firestore penuh, gunakan Firebase Console → Firestore → Export

---

## 6. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "Permission denied" saat akses data | Cek role user di koleksi `users` |
| Login gagal terus | Cek email di Firebase Authentication |
| Data tidak muncul setelah login | Cek koneksi internet, reload halaman |
| Deploy gagal | Jalankan `firebase login` ulang |

---

*© 2026 Pemdes Karang Sengon*
