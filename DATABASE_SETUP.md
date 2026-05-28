# 🗄️ Database Setup Guide untuk Render

Pilih satu dari dua opsi database gratis di bawah.

---

## Option A: Planetscale MySQL (⭐ RECOMMENDED)

**Keuntungan:**
- ✅ 5 GB gratis selamanya
- ✅ MySQL native (compatible dengan current config)
- ✅ Branches & rollback features
- ✅ Simple connection string
- ✅ 3 replicas (HA built-in)

### Step-by-Step

#### 1. Sign Up di Planetscale
```
1. Buka: https://planetscale.com
2. Klik "Sign up" → "Continue with GitHub"
3. Authorize GitHub
4. Create Organization (beri nama: "MyApps" atau "Personal")
```

#### 2. Create Database
```
1. Dashboard → "Create a new database"
2. Database name: shorten-link
3. Region: us-east (atau terdekat dengan Render)
4. Klik "Create database"
5. Tunggu ~2-3 menit
```

#### 3. Create User/Credentials
```
1. Buka database: shorten-link
2. Tab "Settings" → "Users"
3. Klik "New password"
4. Beri nama: render_user
5. Copy password (jangan hilang!)
6. Klik "Create user"
```

#### 4. Get Connection String
```
1. Tab "Connect"
2. Pilih "Node.js" dari dropdown
3. Copy full connection string

Format:
mysql://render_user:password@aws.connect.psdb.cloud/shorten-link?sslaccept=strict
```

#### 5. Parse Connection String
```
Pisahkan connection string jadi:

DB_HOST=aws.connect.psdb.cloud
DB_USERNAME=render_user
DB_PASSWORD=xxxxxxxxxxxx
DB_DATABASE=shorten-link
DB_PORT=3306
DB_CONNECTION=mysql
```

#### 6. Test Connection Lokal
```bash
# Buat file test.php di root
cat > test_db.php << 'EOF'
<?php
$host = "aws.connect.psdb.cloud";
$user = "render_user";
$pass = "your_password_here";
$db = "shorten-link";

try {
    $conn = new mysqli($host, $user, $pass, $db, 3306);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    echo "✅ Database connection successful!";
    $conn->close();
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}
?>
EOF

# Jalankan
php test_db.php

# Hapus file setelah test
rm test_db.php
```

---

### Planetscale Branches (Advanced)

Planetscale punya fitur "branches" untuk testing:

```
1. Main branch: production
2. Create "staging" branch untuk test
3. Merge changes dari staging → main (like Git)
```

**Setup staging:**
```
Dashboard → "Create branch"
Branch name: staging
Source: main
```

---

### Planetscale Backups

Automatic 7-day retention. Restore via dashboard jika ada masalah.

---

## Option B: Supabase PostgreSQL

**Keuntungan:**
- ✅ 500 MB free (vs 5 GB Planetscale)
- ✅ PostgreSQL (more powerful than MySQL)
- ✅ Built-in Auth system
- ✅ Edge functions
- ✅ Real-time subscriptions

**Kekurangan:**
- ❌ Kurang storage gratis
- ❌ Perlu migrate Laravel config ke PostgreSQL

### Step-by-Step

#### 1. Sign Up di Supabase
```
1. Buka: https://supabase.com
2. Klik "Start your project" → "Continue with GitHub"
3. Authorize
4. Create organization
```

#### 2. Create Project
```
1. Dashboard → "New project"
2. Project name: shorten-link
3. Database password: (save this!)
4. Region: us-east-1 (closest to Render)
5. Klik "Create new project"
6. Tunggu ~5 menit provision
```

#### 3. Get Connection String
```
1. Project Settings → "Database" (atau cari di left sidebar)
2. Tab "Connection pooling"
3. Mode: "Transaction"
4. Copy connection string
```

#### 4. Parse Connection String
```
Format dari Supabase:
postgresql://user:password@host:5432/database

DB_CONNECTION=pgsql
DB_HOST=host.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
```

#### 5. Update Laravel Config untuk PostgreSQL
```
Di .env:
DB_CONNECTION=pgsql
DB_PORT=5432

Di config/database.php pastikan sudah ada pgsql config
```

#### 6. Test Connection
```bash
# macOS/Linux
psql "postgresql://user:password@host:5432/database"

# Jika berhasil, kamu dapat prompt:
# postgres=>

# Exit dengan: \q
```

---

### Migrate from MySQL to PostgreSQL (If Needed)

```bash
# Export dari MySQL
mysqldump -u root -p database_name > backup.sql

# Import ke PostgreSQL
psql -U postgres -d database_name -f backup.sql
```

**Atau via Laravel:**
```bash
# Generate fresh migrations untuk PostgreSQL
php artisan migrate:fresh --seed
```

---

## Comparison Table

| Feature | Planetscale MySQL | Supabase PostgreSQL |
|---------|-------------------|-------------------|
| **Free Storage** | 5 GB | 500 MB |
| **Type** | MySQL 8.0 | PostgreSQL 14+ |
| **SSL** | Required | Optional |
| **Backups** | 7 days | 7 days |
| **Price (paid)** | $9/mo | $25/mo |
| **Connection Limit** | Unlimited | 20 (free) |
| **Recommendation** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Setup Summary

### Planetscale MySQL (Recommended)

```env
# Copy ke Render dashboard
DB_CONNECTION=mysql
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_DATABASE=shorten-link
DB_USERNAME=render_user
DB_PASSWORD=<from planetscale>
```

### Supabase PostgreSQL

```env
# Copy ke Render dashboard
DB_CONNECTION=pgsql
DB_HOST=<project>.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=<your password>
```

---

## Migration Setup

Saat deploy pertama ke Render, migration akan otomatis jalan:

```bash
# Di Render Start Command:
php artisan migrate --force
```

Tapi jika ada error, debug dengan:

```bash
# Render dashboard → Service → Shell (klik tombol "Connect")
php artisan migrate --dry-run
php artisan migrate --force
```

---

## Database Monitoring

### Planetscale Metrics
```
Dashboard → Database name → Insights tab
- Queries per second
- Replication lag
- Connection count
- Slow queries
```

### Supabase Metrics
```
Project Settings → Database → Logs
- Query logs
- Connection logs
- Error logs
```

---

## Backup Strategy

### Planetscale
```
Automatic: Keep last 7 days
Manual: Create snapshot via dashboard
Restore: Dashboard → Restore point
```

### Supabase
```
Automatic: Daily backups (7 days retention)
Manual: Via dashboard
Restore: Point-in-time recovery
```

---

## Production Checklist

- [ ] Database created di Planetscale/Supabase
- [ ] User/credentials created
- [ ] Connection string parsed ke env vars
- [ ] Test connection dari local
- [ ] Test connection dari Render
- [ ] Migrations running successfully
- [ ] Data seeded (jika perlu)
- [ ] Backups configured

---

## Next Steps

1. Pilih database (Planetscale recommended)
2. Create account & database
3. Get connection string
4. Set di Render environment
5. Deploy & test

---

**Issues?**
- Planetscale Docs: https://docs.planetscale.com
- Supabase Docs: https://supabase.com/docs
- Render Docs: https://render.com/docs
