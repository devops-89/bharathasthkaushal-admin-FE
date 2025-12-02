import { productSecuredApi } from "./config";

export const warehouseControllers = {
    addWarehouse: (data) => {
        return productSecuredApi.post("/warehouse/create", data);
    },
    getWarehouses: (page = 1, pageSize = 10, search = "") => {
        return productSecuredApi.get("/warehouse/list", {
            params: {
                page,
                pageSize,
                search,
            },
        });
    },
};
