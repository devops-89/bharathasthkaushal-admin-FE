import { productSecuredApi } from "./config";
export const productControllers = {
  addProduct: (formData) => {
    return productSecuredApi.post("/product/addproduct", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAllProducts: () => {
    return productSecuredApi.get("/product/admin/all-products");
  },
  getAllProductsReady: () => {
    return productSecuredApi.get(
      "/product/admin/all-products?buildStatus=READY_FOR_AUCTION"
    );
  },
  getProductById: (id) => {
    return productSecuredApi.get(`/product/productdetails/${id}`);
  },
 
updateProductStatus: (id, status, adminRemarks = "") => {
  const payload = {
    admin_approval_status: status,
    
  };
  if (status === "REJECTED") {
    payload.adminRemarks = adminRemarks;
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
  assignStepToArtisan: (data) => {
  return productSecuredApi.patch("/build-step/assign-artisan", data);
},

  // createAuction: (auctionData) => {
  //   return productSecuredApi.post("/auction/create", auctionData);
  // },
  // startAuction: (auctionId) => {
  //   return productSecuredApi.put(`/auction/start/${auctionId}`);
  // },
  // getActiveAuctions: () => {
  //   return productSecuredApi.get("/auction");
  // },
  // getAuctionDetails: (auctionId) => {
  //   return productSecuredApi.get(`/auction/details/${auctionId}`);
  // },
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
  return productSecuredApi.get(`/auction/winners?page=${page}&limit=${limit}`);
},

};
