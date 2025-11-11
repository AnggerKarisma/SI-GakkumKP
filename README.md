# 🧩 Fullstack Project — Laravel (Backend) & React (Frontend)

Proyek ini merupakan aplikasi fullstack modern yang menggabungkan kekuatan **Laravel** sebagai backend dan **React.js** sebagai frontend. Dokumentasi lengkap ini dirancang untuk memudahkan developer dalam setup, development, dan deployment.

---

## 📋 Daftar Isi

- [⚙️ Persiapan Awal](#️-persiapan-awal)
- [🧱 Setup Backend (Laravel)](#-setup-backend-laravel)
- [🖥️ Setup Frontend (React)](#️-setup-frontend-react)
- [🔗 Integrasi Backend dan Frontend](#-integrasi-backend-dan-frontend)
- [🚀 Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [🏗️ Build Production](#-build-production)
- [🧩 Struktur Folder Utama](#-struktur-folder-utama)
- [🔧 Konfigurasi Penting](#-konfigurasi-penting)
- [🐛 Troubleshooting](#-troubleshooting)

---

## ⚙️ Persiapan Awal

Sebelum memulai, pastikan semua software berikut sudah terinstall di sistem Anda:

| Software | Versi Minimum | Cek dengan perintah |
|-----------|----------------|---------------------|
| PHP | 8.2+ | `php -v` |
| Composer | 2.x | `composer -v` |
| Node.js | 18+ | `node -v` |
| NPM | 9+ | `npm -v` |
| Git | - | `git --version` |
| MySQL / MariaDB | 5.7+ | Lihat phpMyAdmin |

> ⚠️ **Pastikan semua versi sesuai atau lebih tinggi dari yang tertera.**

---

## 🧱 Setup Backend (Laravel)

### 1. Clone Repository & Masuk Folder Backend

```bash
git clone <url-repository>
cd <nama-folder-project>
```

### 2. Install Dependencies Backend

```bash
composer install
```

### 3. Setup File Environment

Buat file `.env` berdasarkan `.env.example`:

```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi lokal Anda:

```env
APP_NAME=LPPTD
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lpptd_db
DB_USERNAME=root
DB_PASSWORD=

# CORS Configuration (untuk React frontend)
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Mail Configuration (opsional)
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=no-reply@lpptd.local

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=debug

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Setup Database

#### a. Buat Database (di phpMyAdmin atau MySQL CLI)

```sql
CREATE DATABASE lpptd_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### b. Jalankan Migration

```bash
php artisan migrate
```

#### c. Jalankan Seeder (opsional, untuk data dummy)

```bash
php artisan migrate --seed
```

### 6. Cache Konfigurasi (Development)

```bash
php artisan config:cache
```

### 7. Buat Storage Link untuk Public Files

```bash
php artisan storage:link
```

---

## 🖥️ Setup Frontend (React)

### 1. Install Dependencies Frontend

```bash
npm install
```

### 2. Setup File Environment

Buat file `.env` di root folder project:

```env
VITE_API_URL=http://localhost:8000/api
```

> Pastikan `VITE_API_URL` mengarah ke backend Laravel yang sedang berjalan.

### 3. Verifikasi Konfigurasi

Periksa file `vite.config.js` untuk memastikan konfigurasi sudah benar:

```javascript
// vite.config.js sudah dikonfigurasi dengan React plugin
```

---

## 🔗 Integrasi Backend dan Frontend

### CORS Configuration

Pastikan backend sudah dikonfigurasi untuk menerima request dari frontend:

1. Edit `.env` backend:
   ```env
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

2. Middleware CORS sudah diatur di `bootstrap/app.php`

### API URL di Frontend

Frontend akan menggunakan `VITE_API_URL` dari `.env` untuk semua request API:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
const response = await fetch(`${API_URL}/endpoint`);
```

---

## 🚀 Menjalankan Aplikasi

### Opsi 1: Jalankan Secara Manual (Recommended untuk Development)

#### Terminal 1 - Backend (Laravel)

```bash
php artisan serve
```

Server Laravel berjalan di: **http://localhost:8000**

#### Terminal 2 - Queue Worker (untuk background jobs)

```bash
php artisan queue:listen --tries=1
```

#### Terminal 3 - Frontend (React + Vite)

```bash
npm run dev
```

Server React berjalan di: **http://localhost:5173**

### Opsi 2: Jalankan dengan Concurrently (Satu Command)

```bash
npm run dev
```

Command ini akan menjalankan ketiga proses bersamaan:
- Laravel server
- Queue worker
- Vite dev server

> ℹ️ Pastikan Anda sudah berada di root folder project.

---

## 🏗️ Build Production

### Build Frontend (React)

```bash
npm run build
```

Output akan tersimpan di folder `dist/`.

### Optimasi Backend untuk Production

```bash
composer install --optimize-autoloader --no-dev

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Setup untuk Deployment

1. Copy file `.env` ke server dan sesuaikan konfigurasi
2. Generate APP_KEY baru jika belum ada
3. Run migrations di server production
4. Setup web server (Nginx/Apache) untuk mengarahkan ke `public/` folder
5. Setup React build di folder public atau CDN terpisah

---

## 🧩 Struktur Folder Utama

```
project-root/
├── app/                          # Kode aplikasi Laravel
│   ├── Http/
│   │   ├── Controllers/          # Request handlers
│   │   ├── Middleware/           # Custom middleware
│   │   └── Requests/             # Form request validation
│   ├── Models/                   # Database models
│   ├── Policies/                 # Authorization policies
│   └── Providers/                # Service providers
│
├── bootstrap/                    # Bootstrap file Laravel
│   ├── app.php                   # Konfigurasi aplikasi
│   └── providers.php             # Provider registration
│
├── config/                       # Konfigurasi aplikasi
│   ├── app.php                   # App configuration
│   ├── auth.php                  # Authentication
│   ├── database.php              # Database connection
│   ├── filesystems.php           # Storage configuration
│   ├── logging.php               # Log channels
│   ├── mail.php                  # Mail configuration
│   ├── sanctum.php               # API token auth
│   └── session.php               # Session configuration
│
├── database/                     # Database files
│   ├── migrations/               # Schema migrations
│   ├── seeders/                  # Data seeders
│   └── factories/                # Model factories for testing
│
├── public/                       # Web root (akses publik)
│   ├── index.php                 # Entry point Laravel
│   ├── storage/                  # Public storage files
│   └── vendor/                   # Public assets
│
├── resources/                    # Resource files
│   └── views/                    # Blade templates (jika ada)
│
├── routes/                       # Route definitions
│   ├── api.php                   # API routes
│   ├── web.php                   # Web routes
│   └── console.php               # Console commands
│
├── src/                          # React source code
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API services
│   ├── styles/                   # Global styles
│   ├── App.jsx                   # Main App component
│   └── main.jsx                  # React entry point
│
├── storage/                      # Generated files
│   ├── app/                      # Application storage
│   ├── logs/                     # Application logs
│   └── framework/                # Framework files
│
├── tests/                        # Test files
│   ├── Feature/                  # Feature tests
│   ├── Unit/                     # Unit tests
│   └── Pest.php                  # Pest configuration
│
├── vendor/                       # Composer dependencies
├── node_modules/                 # NPM dependencies
│
├── .env                          # Environment variables (local)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── .editorconfig                 # Editor config
├── .prettierrc.json              # Prettier config
├── eslint.config.js              # ESLint rules
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── package.json                  # NPM dependencies & scripts
├── composer.json                 # PHP dependencies
├── phpunit.xml                   # PHPUnit configuration
├── artisan                       # Laravel CLI
├── README.md                     # Documentation (file ini)
└── index.html                    # React entry HTML
```

---

## 🔧 Konfigurasi Penting

### Database Configuration (`config/database.php`)

Pilih driver yang digunakan (MySQL, PostgreSQL, SQLite, dll):

```php
'default' => env('DB_CONNECTION', 'mysql'),
```

### Filesystem Configuration (`config/filesystems.php`)

Konfigurasi storage untuk upload files:

```php
'default' => env('FILESYSTEM_DISK', 'local'),
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app/private'),
    ],
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
    ],
]
```

### Logging Configuration (`config/logging.php`)

Pilih channel untuk logging:

```php
'default' => env('LOG_CHANNEL', 'stack'),
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => explode(',', (string) env('LOG_STACK', 'single')),
    ],
    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
    ],
]
```

### Mail Configuration (`config/mail.php`)

Setup untuk mengirim email:

```php
'mailers' => [
    'smtp' => [
        'transport' => 'smtp',
        'host' => env('MAIL_HOST'),
        'port' => env('MAIL_PORT'),
        'username' => env('MAIL_USERNAME'),
        'password' => env('MAIL_PASSWORD'),
    ],
]
```

### Middleware (`bootstrap/app.php`)

Daftarkan middleware custom:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
        'superadmin' => \App\Http\Middleware\SuperAdminMiddleware::class,
    ]);
})
```

---

## 🐛 Troubleshooting

### Error: "Class not found" atau "Model not found"

**Solusi:**

```bash
composer dump-autoload
php artisan cache:clear
php artisan config:clear
```

### Database Connection Error

**Solusi:**

1. Verifikasi `.env` - DB_HOST, DB_USERNAME, DB_PASSWORD
2. Pastikan MySQL/MariaDB running
3. Pastikan database sudah dibuat

```bash
mysql -u root -p
CREATE DATABASE lpptd_db;
```

### CORS Error di Frontend

**Solusi:**

1. Verifikasi `CORS_ALLOWED_ORIGINS` di `.env` backend
2. Pastikan URL frontend benar: `http://localhost:5173`
3. Clear browser cache
4. Restart Laravel server

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 504 Gateway Timeout

**Solusi:**

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Node Modules Issues

**Solusi:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Sudah Terpakai

Ganti port default:

**Laravel:**

```bash
php artisan serve --port=8001
```

**React/Vite:**

```bash
npm run dev -- --port 5174
```

---

## 🔗 Useful Links

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Pest PHP Testing](https://pestphp.com)
- [ESLint Configuration](https://eslint.org)

---

## 🤝 Contributing

Ketika berkontribusi pada project ini:

1. Buat branch baru: `git checkout -b feature/nama-fitur`
2. Commit changes: `git commit -m "feat: deskripsi fitur"`
3. Push ke branch: `git push origin feature/nama-fitur`
4. Buat Pull Request dengan deskripsi lengkap

---
