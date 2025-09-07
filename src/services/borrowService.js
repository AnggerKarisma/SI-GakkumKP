import api from "./api";

const BASE_URL = "/pinjam";

export const getAllBorrows = async () => {
    try {
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBorrowById = async (id) => {
    try {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createBorrow = async (borrowData) => {
    try {
        const response = await api.post(BASE_URL, borrowData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const returnVehicle = async (id) => {
    try {
        const response = await api.patch(`${BASE_URL}/return/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBorrowStatistics = async () => {
    try {
        const response = await api.get(`${BASE_URL}/statistics`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const generateBorrowReport = async (reportData) => {
    try {
        const response = await api.post(
            `${BASE_URL}/generate-report`,
            reportData,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteBorrow = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
