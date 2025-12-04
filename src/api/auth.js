import { publicApi, logoutSecuredApi, securedApi } from "./config";
export const authControllers = {
  login: async (data) => {
    try {
      let result = await publicApi.post("/login", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      let result = await logoutSecuredApi.get("/logout/currentsession", {
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });
      localStorage.removeItem("accessToken");
      return result;
    } catch (error) {
      throw error;
    }
  },

  addEmployee: async (data) => {
    try {
      let result = await securedApi.post("/add_employee", data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  addArtisan: async (data) => {
    console.log(data)
    try {
      let result = await securedApi.post("/admin_register_artisan", data);
      //console.log("gsgggdegdugd", result);
      return result;
    } catch (error) {
      throw error;
    }
  },
  changePassword: async (data) => {
    try {
      let result = await securedApi.post("/changePassword", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  forgotPassword: async (data) => {
    try {
      let result = await publicApi.post("/forgotPassword", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  resetPassword: async (data) => {
    try {
      let result = await publicApi.post("/resetPassword", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
}
