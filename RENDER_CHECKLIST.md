# ✅ Render Deployment Checklist

Ikuti langkah-langkah di bawah untuk deploy ke Render dengan sukses.

---

## 🚀 Quick Start (15 menit)

### 1️⃣ Generate APP_KEY
```bash
php artisan key:generate --show
```
**Copy output ini**, contoh: `base64:xxxxx...`

---

### 2️⃣ Setup Database Gratis
**Pilih satu:**

#### Option A: Planetscale MySQL (RECOMMENDED)
- Buka: https://planetscale.com
- Sign up dengan GitHub
- Create database → Region: `us-east`
- Click "Connect" → Copy connection string

#### Option B: Supabase PostgreSQL
- Buka: https://supabase.com
- Create project → Free tier
- Settings → Database → Copy connection string
- **⚠️ Change in .env:** `DB_CONNECTION=pgsql` + `DB_PORT=5432`

---

### 3️⃣ Create Render Account
- Buka: https://render.com
- Sign up dengan GitHub
- Authorize GitHub access

---

### 4️⃣ Create Web Service di Render
1. Klik **"New +"** → **"Web Service"**
2. Connect repository: `RohmaRifqiPamungkas/Shorten-Link`
3. Isi form:

| Field | Value |
|-------|-------|
| Name | `shorten-link-app` |
| Environment | `Node` |
| Branch | `main` |
| Root Directory | (kosongkan) |
| Build Command | `composer install --optimize-autoloader --no-dev && npm ci && npm run build` |
| Start Command | `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT` |
| Instance | `Free` (atau `Starter` $7/mo) |

4. Klik **"Create Web Service"**

---

### 5️⃣ Set Environment Variables di Render

Copy-paste ke Render dashboard → Environment section:

```env
APP_KEY=base64:xxxxx...
APP_NAME=ShortenLink
APP_ENV=production
APP_DEBUG=false
APP_URL=https://shorten-link-app.onrender.com

DB_CONNECTION=mysql
DB_HOST=<host-dari-planetscale>
DB_PORT=3306
DB_DATABASE=<database-name>
DB_USERNAME=<user>
DB_PASSWORD=<password>

QUEUE_CONNECTION=database
CACHE_DRIVER=database
SESSION_DRIVER=database
```

**Parse connection string dari Planetscale:**
```
mysql://user:password@host.planetscale.com/database?sslaccept=strict
↓
DB_HOST=host.planetscale.com
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=database
```

---

### 6️⃣ Deploy Manual
1. Di Render dashboard, klik **"Manual Deploy"** atau **"Deploy"**
2. Tunggu build selesai (3-7 menit)
3. Lihat progress di tab **"Logs"**

---

### 7️⃣ Test Deployment
```bash
# Replace dengan URL service kamu dari Render dashboard
RENDER_URL=https://shorten-link-app.onrender.com

# Test server
curl $RENDER_URL

# Test login page
curl $RENDER_URL/login
```

✅ Jika berhasil, kamu dapat response HTML

---

## 🔄 Auto-Deploy (GitHub Actions)

Setelah deployment pertama berhasil, setup auto-deploy:

### Setup di GitHub:

1. Buka GitHub repo → **Settings → Secrets and variables → Actions**
2. Add 2 secrets:

   **`RENDER_SERVICE_ID`:**
   - Dari URL Render: `https://dashboard.render.com/services/<SERVICE_ID>`
   - Ambil bagian `<SERVICE_ID>`

   **`RENDER_API_KEY`:**
   - Buka: https://dashboard.render.com/account/api-tokens
   - Create token
   - Copy ke GitHub secret

3. Workflow sudah ada di `.github/workflows/deploy-render.yml`
4. Sekarang setiap push ke `main` → auto-deploy ke Render

---

## 🐛 Troubleshooting

### Build Failed

**Cek logs:**
```
Dashboard → Service → Logs tab
```

**Common errors:**
- `composer install failed` → cek `composer.json` syntax
- `npm ci failed` → jalankan `npm ci` lokal dulu
- Missing `APP_KEY` → pastikan format `base64:...`

---

### Service Crashed

**Solusi:**
1. Cek logs → error message
2. Test database connection lokal
3. Restart service di Render dashboard

---

### 502 Bad Gateway

**Causes:**
- Service sedang starting (tunggu 30 detik)
- Memory limit → upgrade instance
- Port binding error → pastikan `--port=$PORT` di Start Command

---

### Database Connection Error

**Test connection:**
```bash
# Replace dengan credentials kamu
mysql -h <host> -u <user> -p<pass> -D <database>
```

**Atau test dari Render:**
```bash
# Render dashboard → Service → Shell
mysql -h $DB_HOST -u $DB_USERNAME -p$DB_PASSWORD -D $DB_DATABASE -e "SELECT 1"
```

---

## 📊 Monitoring

**Render Dashboard:**
- Logs tab → real-time logs
- Metrics tab → CPU, memory, requests
- Events tab → deploy history

---

## 💰 Pricing Summary

| Service | Free Tier | Paid Starter |
|---------|-----------|------------|
| **Render Web** | Spin-down after 15 min | Always-on |
| **Planetscale DB** | 5 GB free | $9/mo |
| **Supabase DB** | 500 MB free | $25/mo |

**Total monthly:**
- Free: $0 (with spin-down)
- Starter: ~$7-15/mo

---

## 🔗 Resources

- **Render Docs:** https://render.com/docs
- **Planetscale Docs:** https://docs.planetscale.com
- **Laravel Docs:** https://laravel.com/docs
- **Full Guide:** Lihat `DEPLOY_RENDER.md`

---

## ✨ Next Steps

1. ✅ Deployment selesai
2. ⬜ Setup custom domain (Render + Planetscale support)
3. ⬜ Setup email notifications (Render alerts)
4. ⬜ Monitor performance & logs
5. ⬜ Backup database strategy

---

**Questions?**
- Baca `DEPLOY_RENDER.md` untuk detail lebih lengkap
- Open issue di GitHub
- Contact: rohmarifqi31@gmail.com
