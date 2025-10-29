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
  getProductById: (id) => {
  return productSecuredApi.get(`/product/productdetails/${id}`);
},
createBuildStep: (formData) => {
    return productSecuredApi.post(
      "/build-step/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },                                             
      }
    );
  },

  

  getBuildSteps: (productId) => {
    return productSecuredApi.get(`/build-step/product/${productId}`);
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
