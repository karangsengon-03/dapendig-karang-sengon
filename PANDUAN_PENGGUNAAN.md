# 📖 Panduan Penggunaan — DaPenDig

**Data Penduduk Digital · Desa Karang Sengon**

---

## 1. Akses Aplikasi

Buka browser dan kunjungi: **https://dapendig.web.app**

Untuk akses lebih cepat, pasang sebagai aplikasi (PWA):
- **Android/Chrome:** Ketuk menu ⋮ → "Tambahkan ke layar utama"
- **iPhone/Safari:** Ketuk ikon Bagikan → "Tambahkan ke Layar Utama"
- **Desktop/Chrome:** Klik ikon install di address bar

---

## 2. Login

1. Masukkan **email** dan **password** yang diberikan admin
2. Klik **Masuk**
3. Jika lupa password, hubungi admin untuk reset

---

## 3. Menu Navigasi

Navigasi utama ada di **sidebar kiri** (desktop) atau ketuk ikon ☰ (mobile):

| Menu | Fungsi |
|------|--------|
| 🏠 **Beranda** | Statistik ringkas + aktivitas bulan ini |
| 👥 **Penduduk** | Daftar & manajemen data warga |
| 📊 **Monografi** | Grafik data penduduk |
| 🔄 **Mutasi** | Catat mutasi keluar & masuk |
| ⭐ **Vital** | Catat kelahiran & kematian |

---

## 4. Mengelola Data Penduduk

### Tambah Data Baru
1. Buka menu **Penduduk**
2. Klik tombol **＋** (pojok kanan bawah)
3. Isi formulir lengkap
4. Klik **Simpan**

### Cari Data
Di halaman Penduduk, gunakan kolom pencarian:
- **NIK** — cari berdasarkan nomor NIK
- **Nama** — cari berdasarkan nama
- **No. KK** — cari berdasarkan nomor KK
- **RT/RW** — filter per RT/RW

### Edit Data
1. Klik nama warga dari daftar
2. Klik tombol **✏️ Edit**
3. Ubah data yang perlu diubah
4. Klik **Simpan**

### Hapus Data
1. Klik nama warga → **🗑️ Hapus**
2. Konfirmasi penghapusan
3. *Catatan: hanya admin yang bisa menghapus*

### Lihat Anggota Keluarga
Di detail warga, klik **No. KK** (berwarna biru) untuk melihat seluruh anggota keluarga dalam KK tersebut.

---

## 5. Mutasi Penduduk

### Mutasi Keluar
1. Buka menu **Mutasi** → tab **Keluar**
2. Klik **＋ Catat Mutasi Keluar**
3. Cari NIK atau nama warga
4. Isi tujuan pindah dan tanggal
5. Simpan — status warga otomatis berubah menjadi nonaktif

### Mutasi Masuk
1. Buka menu **Mutasi** → tab **Masuk**
2. Klik **＋ Catat Mutasi Masuk**
3. Isi data warga yang masuk
4. Simpan — warga otomatis ditambahkan ke data penduduk aktif

---

## 6. Data Vital

### Catat Kelahiran
1. Buka menu **Vital** → tab **Kelahiran**
2. Klik **＋ Catat Kelahiran**
3. Isi nama bayi, jenis kelamin, tanggal lahir, nama ibu
4. Simpan

### Catat Kematian
1. Buka menu **Vital** → tab **Kematian**
2. Klik **＋ Catat Kematian**
3. Cari NIK warga yang meninggal
4. Isi tanggal dan sebab kematian
5. Simpan — status warga otomatis nonaktif

---

## 7. Ekspor Data

1. Klik ikon ☰ → **📤 Ekspor Data**
2. Pilih jenis:
   - **Data Reguler** — pilih koleksi (Penduduk / Mutasi / dll)
   - **Laporan Bulanan** — pilih bulan & tahun
3. Klik **📊 Excel** — file .xlsx akan otomatis terunduh

---

## 8. Import Data dari Excel

1. Klik ☰ → **📥 Import Excel**
2. Klik area unggah atau seret file .xlsx / .csv
3. Petakan kolom Excel ke field DAPENDIG
4. Klik **Import** — proses berjalan otomatis

**Format yang didukung:** `.xlsx`, `.xls`, `.csv`
**Template:** Klik **Download Template** untuk format yang sudah benar

---

## 9. Edit Info Wilayah

1. Klik ☰ → **🗺️ Edit Info Wilayah**
2. Ubah nama desa, kecamatan, kabupaten, provinsi, atau tahun
3. Klik **💾 Simpan**

---

## 10. Ganti Tema

Klik **🌙 / ☀️** di bagian bawah sidebar untuk beralih antara Mode Gelap dan Mode Terang. Pilihan tersimpan otomatis.

---

## 11. Log Aktivitas

Di menu **Akun/Settings**, tersedia log semua perubahan data:
- Siapa yang mengubah
- Kapan perubahan dilakukan
- Jenis aksi (tambah, edit, hapus, mutasi, dll)

---

## 12. FAQ

**Q: Data tidak muncul setelah login?**
A: Periksa koneksi internet, lalu reload halaman.

**Q: Tidak bisa menghapus data?**
A: Fitur hapus hanya untuk role **admin**. Hubungi admin desa.

**Q: Import gagal / data tidak sesuai?**
A: Gunakan template yang tersedia. Pastikan kolom NIK dan Nama Lengkap terisi.

**Q: Lupa password?**
A: Hubungi admin desa untuk reset password melalui Firebase Console.

---

*© 2026 Pemerintah Desa Karang Sengon · Klabang · Bondowoso*
