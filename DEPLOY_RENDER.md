# 📚 Panduan Deploy ke Render (Step-by-Step)

## Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Setup Database Gratis](#setup-database-gratis)
3. [Konfigurasi di Render](#konfigurasi-di-render)
4. [Deploy Pertama Kali](#deploy-pertama-kali)
5. [Troubleshooting](#troubleshooting)
6. [Auto-Deploy dengan GitHub](#auto-deploy-dengan-github)

---

## Persiapan Awal

### Step 1: Siapkan Repository GitHub
Pastikan project ini sudah di push ke GitHub dengan branch `main`.

```bash
# Dari project folder
git status
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

✅ **Cek:** Buka https://github.com/RohmaRifqiPamungkas/Shorten-Link, pastikan sudah ada di branch `main`

---

### Step 2: Generate APP_KEY Laravel

Kamu perlu `APP_KEY` untuk env variable di Render. Generate sekarang:

```bash
# Dari project folder
php artisan key:generate --show
```

Output akan seperti:
```
base64:xxxxxxxxxxx...
```

**Simpan ini**, kamu butuh nanti di Step 7.

---

### Step 3: Daftar Akun Render (Gratis)

1. Buka: https://render.com
2. Klik **"Sign Up"** → Pilih **"Sign up with GitHub"** (lebih mudah)
3. Authorize GitHub → Login
4. Buat workspace (isi nama sesuai keinginan)

✅ **Cek:** Kamu berhasil login ke https://dashboard.render.com

---

## Setup Database Gratis

### Pilih Satu (recommended order):

#### **Opsi A: Planetscale MySQL (RECOMMENDED - paling simple)**

**Keuntungan:**
- MySQL native (cocok dengan config Laravel current)
- 5 GB gratis selamanya
- Connection string jelas

**Setup:**

1. Buka: https://planetscale.com
2. Klik **"Sign Up"** → Pilih GitHub
3. Create Organization → Create Database
4. Beri nama: `shorten-link`
5. Region: `Virginia (us-east)` atau terdekat dengan Render
6. Klik **"Create Database"**
7. Tunggu 2-3 menit sampai ready
8. Klik tab **"Connect"** → Pilih **"Node.js"**
9. Copy **connection string** (format: `mysql://user:pass@host/db?sslaccept=strict`)

**Simpan connection string ini**, kamu butuh di Step 8.

**Testing Connection:**
```bash
# Install mysql client
brew install mysql-client

# Test connect (ganti dengan connection string kamu)
mysql -h <host> -u <user> -p<pass> -D <db_name>
```

Jika berhasil, exit dengan `exit`

---

#### **Opsi B: Supabase PostgreSQL (Alternatif)**

1. Buka: https://supabase.com
2. Sign Up dengan GitHub
3. Create Project → Pilih Free tier
4. Tunggu provision selesai
5. Buka **Settings → Database**
6. Copy **Connection String** (URI)

**Jika pakai Supabase, ubah `.env` ini:**
```
DB_CONNECTION=pgsql
DB_PORT=5432
```

---

## Konfigurasi di Render

### Step 4: Login ke Render Dashboard

Buka: https://dashboard.render.com

---

### Step 5: Hubungkan GitHub ke Render

1. Klik **"Connect GitHub"** (atau sudah terhubung dari sign up)
2. Pilih repository: **`RohmaRifqiPamungkas/Shorten-Link`**
3. Authorize Render akses GitHub

✅ **Cek:** Repository terlihat di Render dashboard

---

### Step 6: Buat Web Service Baru

1. Klik **"New +"** → Pilih **"Web Service"**
2. Klik **"Connect"** pada repository `Shorten-Link`
3. Isi form berikut:

| Field | Value |
|-------|-------|
| **Name** | `shorten-link-app` |
| **Environment** | `Node` |
| **Branch** | `main` |
| **Root Directory** | (kosongkan, build dari root) |
| **Build Command** | `composer install --optimize-autoloader --no-dev && npm ci && npm run build` |
| **Start Command** | `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT` |
| **Instance Type** | `Free` (jika testing) atau `Starter` ($7/mo) |

**Penjelasan Command:**
- **Build:** Install composer (PHP deps), npm (JS deps), build frontend assets
- **Start:** Jalankan migrations (DB setup), start Laravel server di port yang disediakan Render

4. Klik **"Create Web Service"**

✅ Tunggu deploy pertama kali (akan gagal karena env vars belum di-set)

---

### Step 7: Set Environment Variables

Setelah web service dibuat, kamu akan di halaman service dashboard.

1. Scroll ke bagian **"Environment"**
2. Klik **"Add Environment Variable"**
3. Isi variable berikut (satu-satu):

```env
APP_KEY=base64:xxxxxxxxxxx...
(hasil dari Step 2)

APP_NAME=ShortenLink
APP_ENV=production
APP_DEBUG=false
APP_URL=https://shorten-link-app.onrender.com
(ganti dengan nama service kamu, tapi pattern sama)

DB_CONNECTION=mysql
(atau pgsql jika pakai Supabase)

DB_HOST=<host dari Planetscale/Supabase>
DB_PORT=3306
(atau 5432 jika PostgreSQL)

DB_DATABASE=<database_name>
DB_USERNAME=<database_user>
DB_PASSWORD=<database_password>

QUEUE_CONNECTION=database
CACHE_DRIVER=database
SESSION_DRIVER=database
```

**Cara mendapatkan DB credentials:**

**Jika Planetscale:**
- Connection string: `mysql://user:password@host.planetscale.com/database_name?sslaccept=strict`
- Parse jadi:
  - `DB_HOST=host.planetscale.com`
  - `DB_USERNAME=user`
  - `DB_PASSWORD=password`
  - `DB_DATABASE=database_name`

**Jika Supabase:**
- Buka Settings → Database → Connection String (URI)
- Copy dan paste di field, atau parse manually

4. Setelah semua variable terisi, klik **"Save"**

✅ **Cek:** Semua env variable sudah di-set dan tidak ada error

---

## Deploy Pertama Kali

### Step 8: Trigger Deploy Manual

1. Di dashboard service, scroll ke bawah
2. Klik tombol **"Manual Deploy"** atau **"Deploy"**
3. Pilih branch: `main`
4. Klik **"Deploy"**

Tunggu proses build (3-7 menit pertama kali).

**Lihat progress:**
- Klik tab **"Logs"** untuk melihat detail build

---

### Step 9: Test Service

Setelah deploy selesai, kamu akan dapat URL:
```
https://shorten-link-app.onrender.com
```

**Test endpoints:**
```bash
# Cek server running
curl https://shorten-link-app.onrender.com

# Cek database connection
curl -X GET https://shorten-link-app.onrender.com/api/health
(jika ada endpoint ini)

# Cek login
curl -X POST https://shorten-link-app.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## Troubleshooting

### Error: "Build failed"

**Solusi:**
1. Buka tab **"Logs"** → baca error message
2. Common causes:
   - `composer install` error → periksa `composer.json` syntax
   - `npm ci` error → periksa `package.json`, jalankan `npm ci` local dulu
   - Missing env variable → pastikan semua env var sudah di-set

---

### Error: "Service crashed after deploy"

**Solusi:**
1. Cek logs di tab **"Logs"**
2. Likely causes:
   - Database connection failed → test connection string
   - `APP_KEY` not set → pastikan format `base64:...`
   - Database migration error → cek migration files

**Debug:**
```bash
# Test local dulu
php artisan migrate --dry-run
```

---

### Error: "502 Bad Gateway"

**Solusi:**
- Service sedang starting (tunggu 30 detik)
- Memory limit → upgrade instance type
- Port binding error → pastikan Start Command ada `--port=$PORT`

---

### Service Spin Down (Free tier)

**Terjadi ketika:** Tidak ada traffic selama 15 menit

**Gejala:** Akses pertama kali lambat (30-60 detik)

**Solusi:**
1. Upgrade ke paid tier (`Starter` $7/mo)
2. Atau biarkan, normal untuk free tier

---

## Auto-Deploy dengan GitHub

### Step 10: Setup Auto-Deploy (Opsional)

Render bisa auto-deploy setiap kali kamu push ke `main`.

**Setup di Render Dashboard:**

1. Di Web Service dashboard, scroll ke **"Settings"**
2. Cari **"Deploy Hook"** atau **"Auto-Deploy"**
3. Jika ada setting auto-deploy dari GitHub, enable
4. Atau gunakan GitHub Actions (lihat Step 11)

---

### Step 11: GitHub Actions Workflow (Optional Advanced)

File: `.github/workflows/deploy-render.yml`

```yaml
name: Deploy to Render

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Run Tests
        run: |
          php --version
          composer --version
          npm --version
        continue-on-error: true

      - name: Deploy to Render
        if: success()
        run: |
          curl --request POST \
            --url https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys \
            --header "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
            --header "Content-Type: application/json" \
            --data '{"clearCache": "full"}'
```

**Setup di GitHub:**

1. Buka Settings → Secrets and variables → Actions
2. Add 2 secrets:
   - **`RENDER_SERVICE_ID`:** Dari Render dashboard (URL: `https://dashboard.render.com/services/<ID>`)
   - **`RENDER_API_KEY`:** Buat di Render Settings → API Keys

---

## Ringkasan Proses

| Step | Action | Duration |
|------|--------|----------|
| 1-3 | Persiapan (GitHub, APP_KEY, Render signup) | 10 menit |
| 4-5 | Setup Database (Planetscale) | 5 menit |
| 6 | Create Web Service di Render | 2 menit |
| 7 | Set Environment Variables | 5 menit |
| 8 | Deploy manual | 5-10 menit |
| 9 | Test | 2 menit |
| **TOTAL** | | ~30 menit |

---

## URL & Resources

- **Render Dashboard:** https://dashboard.render.com
- **Planetscale:** https://planetscale.com
- **Supabase:** https://supabase.com
- **Render Docs:** https://render.com/docs
- **Laravel Docs:** https://laravel.com/docs

---

## Checklist Deployment

- [ ] Repository sudah di GitHub (`main` branch)
- [ ] `APP_KEY` sudah di-generate
- [ ] Database sudah di-setup (Planetscale/Supabase)
- [ ] Render account sudah di-buat
- [ ] GitHub di-connect ke Render
- [ ] Web Service sudah di-buat
- [ ] Env variables sudah lengkap di Render
- [ ] Deploy pertama kali sudah berhasil
- [ ] Service dapat URL yang accessible
- [ ] Test akses service dari browser/curl

---

## Next Steps

1. **Push ke `main` → Automatic deploy** (jika auto-deploy enabled)
2. **Monitor logs di Render** setiap deploy
3. **Setup monitoring** (Render punya built-in monitoring)
4. **Backup database** rutin (Planetscale punya retention policy)

---

**Need help?**
- Email: rohmarifqi31@gmail.com
- Issues: https://github.com/RohmaRifqiPamungkas/Shorten-Link/issues
