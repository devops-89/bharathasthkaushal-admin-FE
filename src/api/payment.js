import axios from "axios";

const API_URL = "https://api.dev.bharathastkaushal.com/payments/api";

const paymentApi = axios.create({
    baseURL: API_URL,
});

paymentApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.accessToken = token;
    }
    return config;
});

export const paymentControllers = {
    getPayments: async (page = 1, limit = 10, sortBy = 'date', sortOrder = 'asc') => {
        try {
            const response = await paymentApi.get(`/payments`, {
                params: {
                    page,
                    limit: Number(limit),
                    sortBy,
                    sortOrder
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    getPaymentDetails: async (id) => {
        try {
            const response = await paymentApi.get(`/payments/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
};
