import {  productSecuredApi } from "./config";

export const categoryControllers = {
  addCategory: (formData) => {
    return productSecuredApi.post("/category/addcategory", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getCategory: async () => {
    try {
      let result = await productSecuredApi.get(
        "/category/main-categories?page=1&pageSize=10"
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};
