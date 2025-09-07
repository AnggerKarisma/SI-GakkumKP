import api from "./api";

const BASE_URL = "/pajak";

export const getAllTaxes = async () => {
    try {
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTaxById = async (id) => {
    try {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTaxesByVehicleId = async (vehicleId) => {
    try {
        const response = await api.get(`${BASE_URL}/kendaraan/${vehicleId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTax = async (taxData) => {
    try {
        const response = await api.post(BASE_URL, taxData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTax = async (id, taxData) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}`, taxData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const bulkUpdateTaxes = async (updateData) => {
    try {
        const response = await api.post(`${BASE_URL}/bulk-update`, updateData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTax = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
