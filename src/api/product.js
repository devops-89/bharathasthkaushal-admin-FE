import { productSecuredApi } from "./config";

export const productControllers = {
  getAllProducts: async () => {
    try {
      let res = await productSecuredApi.get("/product/getallproducts");
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  addProduct: async (formData) => {
    try {
      let res = await productSecuredApi.post("product/addproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id, formData) => {
    try {
      let res = await productSecuredApi.put(
        `/product/updateproduct/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      let res = await productSecuredApi.delete(`/product/deleteproduct/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};
