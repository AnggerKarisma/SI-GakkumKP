import api from "./api";

const BASE_URL = "/report";

export const getReports = async () => {
    try {
        const response = await api.get(`${BASE_URL}/borrowing`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
