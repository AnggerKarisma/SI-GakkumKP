import api from "./api";

/**
 * Mengambil semua data statistik untuk halaman dashboard.
 */
export const getDashboardData = async () => {
    try {
        const response = await api.get("/dashboard");
        return response.data;
    } catch (error) {
        throw error;
    }
};
