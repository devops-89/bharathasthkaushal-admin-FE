import { getuserSecuredApi, dashboardSecuredApi } from "./config";
export const userControllers = {
  getUserListGroup: async (group, page = 1, pageSize = 50, hasAddress = null) => {
    try {
      let result = await getuserSecuredApi.get(`/users/getUserList`, {
        params: {
          user_group: group,
          page: page,
          limit: pageSize,
          ...(hasAddress !== null && { hasAddress }),
        },
        headers: { "Cache-Control": "no-cache" }
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllUsers: async (params = {}) => {
    try {
      return await getuserSecuredApi.get(`/users/getUserList`, {
        params,
        headers: { "Cache-Control": "no-cache" }
      });
    } catch (error) {
      throw error;
    }
  },
  getUserProfile: async (id) => {
    try {
      let result = await getuserSecuredApi.get(`/users/${id}/profile`);
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

  getUserDetails: async () => {
    try {
      const result = await getuserSecuredApi.get("/users/userdetails", {
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  getDashboardUserCount: async (userGroup, verifyStatus) => {
    try {
      const config = { params: {} };
      if (userGroup) {
        config.params.userGroup = userGroup;
      }
      if (verifyStatus) {
        config.params.verifyStatus = verifyStatus;
      }
      const result = await dashboardSecuredApi.get("/dashboard/users/count", config);
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateUserProfile: async (data) => {
    try {
      const result = await getuserSecuredApi.post("/users/updateprofile", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
