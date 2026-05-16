# Medbook

Medbook is split into two apps:

- `src/frontend`: React/Vite user interface.
- `src/backend`: Laravel REST API.

The Laravel app should serve JSON only. The React app should call the backend through `VITE_API_BASE_URL`.

## Local setup

Backend:

```sh
cd src/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Frontend:

```sh
cd src/frontend
npm install
cp .env.example .env
npm run dev
```

Default local URLs:

- React frontend: `http://localhost:5173`
- Laravel API: `http://localhost:8000`
- API status: `http://localhost:8000/api/status`
