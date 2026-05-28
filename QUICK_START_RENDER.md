# 🚀 Deploy Render: 5 Menit Quick Start

## 0️⃣ Pre-Reqs (5 menit)

```bash
# 1. Generate APP_KEY (copy output)
php artisan key:generate --show
# Output: base64:xxxxxxx...

# 2. Commit ke GitHub
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## 1️⃣ Database Setup (3 menit)

**Planetscale (recommended):**
1. https://planetscale.com → Sign up GitHub
2. Create database: `shorten-link`
3. Get connection string dari tab "Connect"

**Copy-paste dari connection string:**
```
mysql://user:password@host.planetscale.com/db?sslaccept=strict
                ↓
DB_HOST=host.planetscale.com
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=db
```

## 2️⃣ Render Setup (5 menit)

1. https://render.com → Sign up GitHub
2. New Web Service → Connect to `Shorten-Link` repo
3. Fill form:
   - **Name:** `shorten-link-app`
   - **Build:** `composer install --optimize-autoloader --no-dev && npm ci && npm run build`
   - **Start:** `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT`
4. Create → Tunggu build

## 3️⃣ Environment Variables (2 menit)

Copy-paste ke Render Environment section:

```env
APP_KEY=base64:xxxxx
APP_NAME=ShortenLink
APP_ENV=production
APP_URL=https://shorten-link-app.onrender.com
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=<dari planetscale>
DB_PORT=3306
DB_DATABASE=<dari planetscale>
DB_USERNAME=<dari planetscale>
DB_PASSWORD=<dari planetscale>

QUEUE_CONNECTION=database
CACHE_DRIVER=database
SESSION_DRIVER=database
```

4. Save

## 4️⃣ Deploy (5 menit)

1. Render dashboard → Service name
2. Click "Manual Deploy" → Select branch `main`
3. Wait for build complete
4. Get URL: `https://shorten-link-app.onrender.com`

## 5️⃣ Test

```bash
curl https://shorten-link-app.onrender.com
```

**✅ Done!** Kamu sudah di Render.

---

## Next: Auto-Deploy

Agar setiap push ke GitHub automatic deploy:

1. GitHub repo → Settings → Secrets
2. Add:
   - `RENDER_SERVICE_ID`: Dari Render URL `/services/<ID>`
   - `RENDER_API_KEY`: Buat di Render account settings

Workflow sudah ada di `.github/workflows/deploy-render.yml`

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| Build failed | Check logs → fix composer/npm issues |
| 502 error | Wait 30s or check DB connection |
| Database error | Verify connection string format |

---

**Full guide:** Read `DEPLOY_RENDER.md`  
**Database guide:** Read `DATABASE_SETUP.md`  
**Checklist:** Read `RENDER_CHECKLIST.md`
