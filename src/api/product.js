import { productSecuredApi } from "./config";

export const productControllers = {
  addProduct: (formData) => {
    return productSecuredApi.post("/product/addproduct", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
