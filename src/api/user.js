import { getuserSecuredApi } from "./config";
export const userControllers = {
  // getUserListGroup: async (group) => {
  //   try {
  //     let result = await getuserSecuredApi.get(
  //       `/users/getUserList?user_group=${group}`,
  //       { headers: { "Cache-Control": "no-cache" } }
  //     );
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
 
  getUserListGroup: async (group, page = 1, pageSize = 50) => {
    try {
      let result = await getuserSecuredApi.get(`/users/getUserList`, {
        params: {
          user_group: group,
          page: page,
          //pageSize: pageSize
           limit: pageSize, 
        },
        headers: { "Cache-Control": "no-cache" }
      });

      return result;
    } catch (error) {
      throw error;
    }
  },


  
updateUserStatus: async (id, status) => {
  try {
    return await getuserSecuredApi.patch(`/users/${id}/status`, { status });
  } catch (error) {
    throw error;
  }
},
  verifyArtisan: async (id) => {
    try {
      const body = { verifyStatus: "VERIFIED" };
      const response = await getuserSecuredApi.patch(
        `/users/${id}/verify-status`,
        body
      );
      console.log("hey guyssss", response);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
