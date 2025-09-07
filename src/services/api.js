import axios from "axios";

// Definisikan base URL API Anda di satu tempat.
const API_URL = "http://127.0.0.1:8000/api";

// Buat sebuah instance axios baru.
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Gunakan "interceptor" untuk menambahkan token otentikasi secara otomatis
// ke setiap permintaan yang dikirim melalui instance ini.
axiosInstance.interceptors.request.use(
    (config) => {
        // Ambil token yang sudah disimpan di localStorage saat login.
        const token = localStorage.getItem("authToken");
        if (token) {
            // Jika token ada, tambahkan ke header 'Authorization'.
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Lakukan sesuatu jika ada error pada konfigurasi permintaan.
        return Promise.reject(error);
    },
);

export default axiosInstance;
