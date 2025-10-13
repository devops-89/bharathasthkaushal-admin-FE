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
    try {
      let result = await securedApi.post("/register_artisan", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
}
