#!/usr/bin/env sh
set -eu

cd /var/www/backend

# Ensure a writable sqlite DB path when using sqlite.
if [ "${DB_CONNECTION:-}" = "sqlite" ] && [ -n "${DB_DATABASE:-}" ]; then
  mkdir -p "$(dirname "$DB_DATABASE")"
  if [ ! -f "$DB_DATABASE" ]; then
    : > "$DB_DATABASE"
  fi
fi

# Install PHP dependencies into the container-managed vendor/ volume.
if [ ! -f vendor/autoload.php ]; then
  composer install --no-interaction --prefer-dist
fi

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  php artisan migrate --force
fi

exec php artisan serve --host=0.0.0.0 --port=8000

