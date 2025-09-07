import axios from "axios"; // Gunakan axios biasa untuk endpoint publik
import api from "./api"; // Gunakan instance axios kita untuk endpoint terproteksi

const API_URL = "http://127.0.0.1:8000/api";

// --- Endpoint Publik (Tidak butuh token) ---
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data; // Langsung kembalikan data
    } catch (error) {
        throw error; // Lemparkan error untuk ditangani komponen
    }
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_ - URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// --- Endpoint Terproteksi (Otomatis pakai token) ---
export const logout = async () => {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get("/profile");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put("/profile", profileData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
