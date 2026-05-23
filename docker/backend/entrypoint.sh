#!/usr/bin/env sh
set -eu

cd /var/www/backend

# Laravel expects these directories to exist and be writable. Because we mount
# `storage/` as a named volume, it starts empty on first run.
mkdir -p \
  storage/app \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  bootstrap/cache

# Dev-only: keep permissions simple across Docker Desktop / Linux VM.
chmod -R 0777 storage bootstrap/cache || true

# Wait for MySQL when configured. This avoids running migrations before the DB is ready.
if [ "${DB_CONNECTION:-}" = "mysql" ]; then
  php -v >/dev/null 2>&1 || true
  tries=60
  while [ "$tries" -gt 0 ]; do
    if php -r '
      $h=getenv("DB_HOST") ?: "mysql";
      $p=getenv("DB_PORT") ?: "3306";
      $d=getenv("DB_DATABASE") ?: "medbook";
      $u=getenv("DB_USERNAME") ?: "root";
      $pw=getenv("DB_PASSWORD") ?: "";
      try {
        new PDO("mysql:host={$h};port={$p};dbname={$d}", $u, $pw, [PDO::ATTR_TIMEOUT=>1]);
        exit(0);
      } catch (Throwable $e) {
        exit(1);
      }
    '; then
      break
    fi
    tries=$((tries - 1))
    sleep 1
  done

  if [ "$tries" -le 0 ]; then
    echo "MySQL not reachable; giving up." >&2
    exit 1
  fi
fi

# Ensure APP_KEY exists for Laravel. In Docker we inject env vars (not .env),
# so generate a stable dev key and persist it in the storage volume.
if [ -z "${APP_KEY:-}" ]; then
  KEY_FILE="storage/app/.medbook_app_key"
  mkdir -p "$(dirname "$KEY_FILE")"
  if [ -f "$KEY_FILE" ]; then
    export APP_KEY="$(cat "$KEY_FILE")"
  else
    export APP_KEY="$(php -r "echo 'base64:' . base64_encode(random_bytes(32));")"
    printf "%s" "$APP_KEY" > "$KEY_FILE"
  fi
fi

# Install PHP dependencies into the container-managed vendor/ volume.
if [ ! -f vendor/autoload.php ]; then
  composer install --no-interaction --prefer-dist
fi

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  php artisan migrate --force
fi

# Seed demo data once (persist marker in the storage volume).
if [ "${RUN_SEEDERS:-false}" = "true" ]; then
  SEED_CLASS="${DB_SEED_CLASS:-}"
  SEED_MARKER="storage/app/.medbook_db_seeded${SEED_CLASS:+.${SEED_CLASS}}"
  mkdir -p "$(dirname "$SEED_MARKER")"
  if [ ! -f "$SEED_MARKER" ]; then
    if [ -n "$SEED_CLASS" ]; then
      php artisan db:seed --class="$SEED_CLASS" --force
    else
      php artisan db:seed --force
    fi
    : > "$SEED_MARKER"
  fi
fi

# `php artisan serve` clears most env vars when auto-reload is enabled (it only
# passes through a small allowlist). In Docker we rely on Compose-provided env
# (DB_HOST, etc.), so we run with --no-reload.
exec php artisan serve --host=0.0.0.0 --port=8000 --no-reload
