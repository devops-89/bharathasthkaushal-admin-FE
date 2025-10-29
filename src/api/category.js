  import {  productSecuredApi } from "./config";
  export const categoryControllers = {
    addCategory: (formData) => {
      return productSecuredApi.post("/category/addcategory", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
            
        },
      });
    },
    getCategory: async (page = 1, pageSize = 10) => {
      try {
        let result = await productSecuredApi.get(
          `/category/main-categories?page=${page}&pageSize=${pageSize}`,
          { headers: { "Cache-Control": "no-cache" } }
        );
        return result;
      } catch (error) {
        throw error;
      }
    },
    getSubCategory: async (categoryId) => {
      try {
        let result = await productSecuredApi.get(
          `/category/getsubcategory/${categoryId}`,
          {
            headers: { "Cache-Control": "no-cache" },
          }
        );
        return result;
      } catch (error) {
        throw error ;
      }

    },
    getallSubcategory: async(categoryId)=>
    {
      try{
        let result = await productSecuredApi.get(
          `/category/getallsubcategory`,
          {
            headers:{"cache-control":"no-cache"},
          }
        );
        console.log("wjdsdhjhdec",result)
        return result;

      } catch (error)
      {
        throw error;
      }
    } ,
  };
