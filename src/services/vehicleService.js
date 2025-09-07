import api from "./api";

const BASE_URL = "/kendaraan";

export const getAllVehicles = async () => {
    try {
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getVehicleById = async (id) => {
    try {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createVehicle = async (vehicleData) => {
    try {
        const response = await api.post(BASE_URL, vehicleData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateVehicle = async (id, vehicleData) => {
    try {
        const response = await api.put(`${BASE_URL}/${id}`, vehicleData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteVehicle = async (id) => {
    try {
        const response = await api.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateVehicleStatus = async (id, statusData) => {
    try {
        const response = await api.patch(
            `${BASE_URL}/${id}/status`,
            statusData,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
