#!/bin/bash
set -e

cd /var/www/html

if [ -f "composer.json" ]; then
  if [ ! -d "vendor" ]; then
    echo "Menjalankan composer install..."
    composer install --optimize-autoloader --no-dev
  fi
else
  echo "⚠️ composer.json tidak ditemukan, skip composer install"
fi

echo "Mengatur permission storage & bootstrap/cache..."
mkdir -p storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "Menjalankan Apache..."
exec apache2-foreground
