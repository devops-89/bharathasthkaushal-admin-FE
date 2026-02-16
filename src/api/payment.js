import { paymentSecuredApi } from "./config";
export const paymentControllers = {
    getPayments: async (
        page = 1,
        limit = 10,
        sortBy = "date",
        sortOrder = "asc",
    ) => {
        try {
            const response = await paymentSecuredApi.get(`/payments`, {
                params: {
                    page,
                    limit: Number(limit),
                    sortBy,
                    sortOrder,
                },
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
