import { productSecuredApi } from "./config";

export const warehouseControllers = {
    addWarehouse: (data) => {
        return productSecuredApi.post("/warehouses", data);
    },
    getWarehouses: (page = 1, limit = 10, search = "") => {
        const params = {
            page,
            limit,
            search,
        };

        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(
                ([_, value]) => value !== "" && value !== null && value !== undefined,
            ),
        );

        return productSecuredApi.get("/warehouses", {
            params: filteredParams,
        });
    },
    getWarehouseDetails: (id, page = 1, limit = 10, search = "") => {
        const params = { page, limit, search };
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(
                ([_, value]) => value !== "" && value !== null && value !== undefined
            )
        );
        return productSecuredApi.get(`/warehouses/${id}`, { params: filteredParams });
    },
    getWarehousesByCountry: (country) => {
        return productSecuredApi.get(`/warehouses?country=${country}`);
    },
    updateWarehouse: (id, data) => {
        return productSecuredApi.patch(`/warehouses/${id}`, data);
    },
};
