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
  updateProductStatus: (id, status) => {
    console.log("nhhuhuug",id,status)
    return productSecuredApi.patch(`/product/${id}/status`, {
      admin_approval_status: status,
      adminRemarks: adminRemarks,
    });
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

  createAuction: (auctionData) => {
    return productSecuredApi.post("/auction/create", auctionData);
  },
  startAuction: (auctionId) => {
    return productSecuredApi.put(`/auction/start/${auctionId}`);
  },
  getActiveAuctions: () => {
    return productSecuredApi.get("/auction/active");
  },
  getAuctionDetails: (auctionId) => {
    return productSecuredApi.get(`/auction/details/${auctionId}`);
  },
};
