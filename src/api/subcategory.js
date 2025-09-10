import { productSecuredApi, subcategorySecuredApi } from "./config";

export const subcategoryControllers = {
  addCategory: (formData) => {
    return productSecuredApi.post("/category/addcategory", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
