import { productSecuredApi, dashboardSecuredApi } from "./config";

export const productControllers = {
  getDashboardAuctionCount: async (status) => {
    try {
      const config = {};
      if (status) {
        config.params = { status };
      }
      const result = await dashboardSecuredApi.get("/dashboard/auctions/count", config);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getDashboardProductCount: async (status) => {
    try {
      const config = {};
      if (status) {
        config.params = { status };
      }
      const result = await dashboardSecuredApi.get("/dashboard/products/count", config);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getDashboardPaymentCount: async (status) => {
    try {
      const config = {};
      if (status) {
        config.params = { status };
      }
      const result = await dashboardSecuredApi.get("/dashboard/payments/count", config);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getDashboardBuildStepCount: async (buildStatus) => {
    try {
      const config = {};
      if (buildStatus) {
        config.params = { buildStatus };
      }
      const result = await dashboardSecuredApi.get("/dashboard/build-steps/count", config);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getAllProducts: (page = 1, pageSize = 10, search = "") => {
    return productSecuredApi.get("/product/admin/all-products", {
      params: {
        page,
        pageSize,
        search,
      },
      headers: {
        "x-company-id": "2917DA28-C412-5525-E814-A3E1E80638CB",
      },
    });
  },

  getAllProductsReady: () => {
    return productSecuredApi.get(
      "/product/admin/all-products?buildStatus=READY_FOR_AUCTION&page=1&pageSize=1000"
    );
  },

  getProductById: (id) => {
    return productSecuredApi.get(`/product/productdetails/${id}`);
  },

  addProduct: (formData) => {
    return productSecuredApi.post("/product/addproduct", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateProduct: (id, formData) => {
    return productSecuredApi.patch(`/product/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateBuildStep: (id, formData) => {
    return productSecuredApi.put(`/build-step/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateBuildStepStatus: (stepId, status, adminRemarks = "") => {
    const payload = {
      status: status,
    };

    if (status === "DISAPPROVED" || status === "REJECTED") {
      payload.admin_remarks = adminRemarks;
    }

    return productSecuredApi.post(
      `/build-step/admin/approve/${stepId}`,
      payload
    );
  },

  updateProductStatus: (id, status, adminRemarks = "", additionalData = {}) => {
    const payload = {
      admin_approval_status: status,
      ...additionalData,
    };
    if (status === "DISAPPROVED") {
      payload.admin_remarks = adminRemarks;
    }
    return productSecuredApi.patch(`/product/${id}/status`, payload);
  },

  createBuildStep: (formData) => {
    return productSecuredApi.post("/build-step/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getBuildSteps: (productId) => {
    return productSecuredApi.get(`/build-step/product/${productId}`);
  },

  getBuildStepDetails: (stepId) => {
    return productSecuredApi.get(`/build-step/details/${stepId}`);
  },

  assignStepToArtisan: (data) => {
    return productSecuredApi.patch("/build-step/assign-artisan", data);
  },

  getAssignedSteps: () => {
    return productSecuredApi.get("/build-step/artisan/my-steps");
  },

  getAllAuctions: (params = {}) => {
    return productSecuredApi.get("/auction", { params });
  },

  createAuction: (auctionData) => {
    return productSecuredApi.post("/auction/create", auctionData);
  },

  startAuction: (auctionId) => {
    return productSecuredApi.put(`/auction/start/${auctionId}`);
  },

  getAuctionDetails: (auctionId) => {
    return productSecuredApi.get(`/auction/details/${auctionId}`);
  },

  getAuctionWinners: (page = 1, limit = 10) => {
    return productSecuredApi.get(
      `/auction/winners?page=${page}&limit=${limit}`
    );
  },

  getMonthlyAuctionReport: () => {
    return productSecuredApi.get("/auction/ended/monthly");
  },

  getAuctionStatusSummary: () => {
    return productSecuredApi.get("/auction/status/summary");
  },

  getUserAuctionStats: (userId) => {
    return productSecuredApi.get(`/auction/stats/${userId}`);
  },
};