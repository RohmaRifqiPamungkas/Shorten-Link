#!/bin/bash
set -e

# Jalankan Composer install kalau folder vendor belum ada
if [ ! -d "/var/www/html/vendor" ]; then
  echo "Menjalankan composer install..."
  composer install --optimize-autoloader --no-dev
fi

# Pastikan permission storage & bootstrap/cache
echo "Mengatur permission storage & bootstrap/cache..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Jalankan migrasi database (opsional, bisa dihapus kalau takut merusak data)
# echo "Menjalankan artisan migrate..."
# php artisan migrate --force

# Start Apache (biar container jalan terus)
echo "Menjalankan Apache..."
exec apache2-foreground
