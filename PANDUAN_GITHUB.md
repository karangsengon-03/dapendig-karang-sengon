# 🐙 Panduan GitHub — DaPenDig

## 1. Repo

**URL:** https://github.com/karangsengon-03/dapendig-karang-sengon

---

## 2. Setup Deploy Otomatis (sekali saja)

### Langkah 1 — Dapatkan Service Account Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project **dapendig**
3. Klik ⚙️ → **Project Settings** → tab **Service Accounts**
4. Klik **Generate new private key** → simpan file JSON

### Langkah 2 — Tambahkan Secret di GitHub

1. Buka repo GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Klik **New repository secret**
3. Name: `FIREBASE_SERVICE_ACCOUNT_DAPENDIG`
4. Value: paste seluruh isi file JSON service account
5. Klik **Add secret**

### Langkah 3 — Push ke main

Setelah secret ditambahkan, setiap push ke branch `main` akan otomatis deploy ke Firebase Hosting.

```bash
git add .
git commit -m "Update aplikasi"
git push origin main
```

Pantau progress di tab **Actions** di repo GitHub.

---

## 3. Workflow File

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy DaPenDig ke Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_DAPENDIG }}
          projectId: dapendig
          channelId: live
```

---

## 4. Upload File ke GitHub (tanpa Git)

Jika tidak familiar dengan Git, bisa upload langsung di browser:

1. Buka repo di GitHub
2. Klik **Add file** → **Upload files**
3. Drag & drop file yang diubah
4. Scroll bawah → **Commit changes** → Commit ke `main`
5. GitHub Actions akan otomatis deploy

---

## 5. Deploy Manual (Windows)

Pastikan sudah install [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
npm install -g firebase-tools
firebase login
```

Lalu double-click **`deploy.bat`** di folder project.

Atau via terminal:
```bash
cd dapendig-karang-sengon
firebase deploy --only hosting
```

---

## 6. Cek Status Deploy

- Buka tab **Actions** di repo GitHub
- ✅ Hijau = deploy berhasil
- ❌ Merah = ada error, klik untuk lihat log

Live URL: **https://dapendig.web.app**

---

*© 2026 Pemdes Karang Sengon*
