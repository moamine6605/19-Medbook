#!/usr/bin/env sh
set -eu

cd /var/www/frontend

if [ ! -f node_modules/.medbook_node_modules_ready ]; then
  npm ci
  # Marker file inside the named volume so we don't re-install on every boot.
  : > node_modules/.medbook_node_modules_ready
fi

exec npm run dev -- --host 0.0.0.0 --port 5173
