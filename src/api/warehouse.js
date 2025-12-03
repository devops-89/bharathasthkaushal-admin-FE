import { productSecuredApi } from "./config";

export const warehouseControllers = {
    addWarehouse: (data) => {
        return productSecuredApi.post("/warehouses", data);
    },
    getWarehouses: (page = 1, limit = 10, search = "") => {
        return productSecuredApi.get("/warehouses", {
            params: {
                page,
                limit,
                search,
            },
        });
    },
    getWarehouseDetails: (id) => {
        return productSecuredApi.get(`/warehouses/${id}`);
    },
};
