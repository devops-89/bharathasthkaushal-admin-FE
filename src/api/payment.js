import { paymentSecuredApi } from "./config";
export const paymentControllers = {
    getPayments: async (
        page = 1,
        limit = 10,
        sortBy = "date",
        sortOrder = "desc",
        search = "",
        status = "",
    ) => {
        try {
            const params = {
                page,
                limit: Number(limit),
                sortBy,
                sortOrder,
            };
            if (search) params.search = search;
            if (status && status !== "ALL") params.paymentStatus = status;

            const response = await paymentSecuredApi.get(`/payments`, {
                params: params,
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    exportPayments: async (fromDate, toDate) => {
        try {
            const params = {};
            if (fromDate) params.fromDate = fromDate;
            if (toDate) params.toDate = toDate;
            const response = await paymentSecuredApi.get('/payments/export', {
                params,
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    getPaymentDetails: async (id) => {
        try {
            const response = await paymentSecuredApi.get(`/payments/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
};
