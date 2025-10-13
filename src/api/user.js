import { getuserSecuredApi } from "./config";

export const userControllers = {

  getUserListGroup: async (group) => {
    try {
      let result = await getuserSecuredApi.get(
        `/users/getUserList?group=${group}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      return result;
    } 
  
    catch (error) {
    throw error;

    }
    
  },    

};