import { productSecuredApi } from "./config";
export const categoryControllers = {
  addCategory: (formData) => {
    return productSecuredApi.post("/category/addcategory", formData, {
      headers: {
        "Content-Type": "multipart/form-data",

      },
    });
  },
  getCategory: async (page = 1, pageSize = 1000) => {
    try {
      let result = await productSecuredApi.get(
        `/category/main-categories?page=${page}&pageSize=${pageSize}`,
        { headers: { "Cache-Control": "no-cache", "x-company-id": "2917DA28-C412-5525-E814-A3E1E80638CB" } }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getSubCategory: async (categoryId, page = 1, pageSize = 1000) => {
    try {
      let result = await productSecuredApi.get(
        `/category/getsubcategory/${categoryId}?page=${page}&pageSize=${pageSize}`,
        {
          headers: { "Cache-Control": "no-cache" },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }

  },
  getallSubcategory: async (categoryId) => {
    try {
      let result = await productSecuredApi.get(
        `/category/getallsubcategory?page=1&pageSize=1000`,
        {
          headers: { "cache-control": "no-cache" },
        }
      );

      //console.log("wjdsdhjhdec", result)
      return result;

    } catch (error) {
      throw error;
    }
  },
};
