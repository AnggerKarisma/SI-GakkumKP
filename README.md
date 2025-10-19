# 🧩 Fullstack Project — Laravel (Backend) & React (Frontend)

Proyek ini terdiri dari dua bagian utama:
- **Backend** → Framework **Laravel** (PHP)
- **Frontend** → Framework **React.js** (JavaScript)

Dokumen ini menjelaskan **langkah-langkah lengkap** untuk men-setup, menjalankan, dan memahami struktur proyek ini.  
Cocok untuk **developer junior** yang akan melanjutkan pengembangan proyek ini.

---

## 📁 Struktur Folder

```
project-root/
│
├── backend/         # Folder Laravel (API)
│   ├── app/
│   ├── routes/
│   ├── config/
│   ├── public/
│   ├── composer.json
│   └── ...
│
└── frontend/        # Folder React
    ├── src/
    ├── public/
    ├── package.json
    └── ...
```

---

## ⚙️ Persiapan Awal

### 1. Pastikan Sudah Terinstall

| Software | Versi Minimum | Cek dengan perintah |
|-----------|----------------|---------------------|
| PHP | 8.1+ | `php -v` |
| Composer | 2.x | `composer -v` |
| Node.js | 18+ | `node -v` |
| NPM | 9+ | `npm -v` |
| Git | - | `git --version` |
| MySQL / MariaDB | - | - |

> ⚠️ **Pastikan semua versi sesuai atau lebih tinggi.**

---

## 🧱 Setup Backend (Laravel)

Masuk ke folder backend:

```bash
cd backend
```

### 1. Install Dependencies
```bash
composer install
```

### 2. Setup File Environment
Buat file `.env` berdasarkan `.env.example`:

```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi lokal Anda:
```env
APP_NAME=LaravelApp
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=

# Jika API digunakan oleh React di localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Generate Key Aplikasi
```bash
php artisan key:generate
```

### 4. Migrasi & Seeder Database
```bash
php artisan migrate --seed
```

> Jika database belum dibuat, buat dulu database kosong di phpMyAdmin atau MySQL sebelum menjalankan migrate.

### 5. Jalankan Server Laravel
```bash
php artisan serve
```

Server default:  
👉 **http://localhost:8000**

---

## 🖥️ Setup Frontend (React)

Masuk ke folder frontend:

```bash
cd frontend
```

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi File `.env`
Buat file `.env` (jika belum ada) di folder `frontend` dan isi seperti ini:

```env
VITE_API_URL=http://localhost:8000/api
```

> Pastikan URL di atas mengarah ke backend Laravel yang sedang berjalan.

### 3. Jalankan Server React
```bash
npm run dev
```

Server default:  
👉 **http://localhost:5173**

---

## 🔗 Integrasi Backend dan Frontend

Frontend React akan berkomunikasi dengan Backend Laravel melalui API endpoint.  
Contoh penggunaan di React:

```javascript
// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
```

Contoh request:
```javascript
// src/pages/Login.jsx
import api from '../api/axios';

async function loginUser(email, password) {
  const res = await api.post('/login', { email, password });
  console.log(res.data);
}
```

---

## 🧩 Build Production

### Frontend
Untuk membuat versi build production:
```bash
npm run build
```
Hasil build akan berada di folder `frontend/dist`.

Biasanya hasil build ini dapat dipindahkan ke folder Laravel (`backend/public`) jika ingin disatukan.

---

## 🔍 Tips Pengembangan

### Menjalankan Kedua Server Secara Bersamaan
Gunakan dua terminal:
- **Terminal 1 (Backend):**
  ```bash
  cd backend
  php artisan serve
  ```
- **Terminal 2 (Frontend):**
  ```bash
  cd frontend
  npm run dev
  ```

### Jika Menggunakan Postman
Base URL:
```
http://localhost:8000/api
```

Contoh endpoint:
```
GET /api/users
POST /api/login
```

---

## 🧠 Struktur Folder Utama

### Backend (Laravel)
| Folder | Deskripsi |
|--------|------------|
| `app/Models` | Menyimpan model database |
| `app/Http/Controllers` | Logic endpoint API |
| `routes/api.php` | Routing API |
| `database/migrations` | Struktur tabel database |
| `database/seeders` | Data awal untuk testing |
| `.env` | Konfigurasi environment |

### Frontend (React)
| Folder | Deskripsi |
|--------|------------|
| `src/components` | Komponen UI (reusable) |
| `src/pages` | Halaman utama aplikasi |
| `src/api` | Konfigurasi request API |
| `src/context` | State management (opsional) |
| `src/assets` | Gambar, ikon, dll |
| `vite.config.js` | Konfigurasi build Vite |

---

## 🧩 Catatan Tambahan

- Pastikan **port Laravel (8000)** dan **port React (5173)** tidak bentrok.
- Jika ada error CORS, pastikan konfigurasi middleware Laravel `cors.php` mengizinkan origin `http://localhost:5173`.
- Gunakan branch `dev` untuk pengembangan fitur baru, lalu merge ke `main` setelah testing.

---

## 🧑‍💻 Kontributor

- **Lead Developer:** [Nama Kamu]
- **Frontend Developer:** [Nama Developer Frontend]
- **Backend Developer:** [Nama Developer Backend]

---

## 📄 Lisensi

Proyek ini berada di bawah lisensi **MIT License** — bebas digunakan dan dimodifikasi dengan tetap mencantumkan atribusi.

---