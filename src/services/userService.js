import api from "./api";

const BASE_URL = "/admin/users";

export const getAllUsers = async () => {
    try {
        const response = await api.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await api.get(`${BASE_URL}/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUserByAdmin = async (userData) => {
    try {
        const response = await api.post(BASE_URL, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserDetail = async (userId, userData) => {
    try {
        const response = await api.put(`${BASE_URL}/${userId}`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`${BASE_URL}/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
