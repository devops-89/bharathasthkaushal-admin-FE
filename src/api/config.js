import Axios from "axios";
import { serverConstants } from "./server-constant";
const securedApi = Axios.create({
  baseURL: serverConstants.authenticationUrls,
});
const publicApi = Axios.create({
  baseURL: serverConstants.authenticationUrls,
});
const productSecuredApi = Axios.create({
  baseURL: serverConstants.productUrl,
});
const productPublicApi = Axios.create({
  baseURL: serverConstants.productUrl,
});
const userSecuredApi = Axios.create({
  baseURL: serverConstants.userUrl,
});
const userPublicApi = Axios.create({
  baseURL: serverConstants.userUrl,
});
const getuserSecuredApi = Axios.create({
  baseURL: serverConstants.getuserUrl,
});
const getuserPublicApi = Axios.create({
  baseURL: serverConstants.getuserUrl,
});
const logoutPublicApi = Axios.create({
  baseURL: serverConstants.logoutUrl,
});
const logoutSecuredApi = Axios.create({
  baseURL: serverConstants.logoutUrl,
})
const dashboardSecuredApi = Axios.create({
  baseURL: serverConstants.dashboardUrl,
});
const paymentSecuredApi = Axios.create({
  baseURL: serverConstants.paymentUrl,
});
const paymentPublicApi = Axios.create({
  baseURL: serverConstants.paymentUrl,
});

securedApi.interceptors.request.use((config) => {
  const token = (sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"));
  config.headers.accessToken = token;
  return config;
});
logoutSecuredApi.interceptors.request.use((config) => {
  const token = (sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"));
  config.headers.accessToken = token;
  return config;
});
productSecuredApi.interceptors.request.use((config) => {
  const token = (sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"));
  config.headers.accessToken = token;
  // config.headers.coma = "2917DA28-C412-5525-E814-A3E1E80638CB";
  config.headers["x-company-id"] = "2917DA28-C412-5525-E814-A3E1E80638CB";
  return config;
});
getuserSecuredApi.interceptors.request.use((config) => {
  const token = (sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"));
  config.headers.accessToken = token;
  return config;
});

dashboardSecuredApi.interceptors.request.use((config) => {
  const token = (sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"));
  config.headers.accessToken = token;
  return config;
});

paymentSecuredApi.interceptors.request.use((config) => {
  const token = (sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"));
  config.headers.accessToken = token;
  return config;
});


logoutSecuredApi.interceptors.request.use((config) => {
  const token = (sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"));
  config.headers.accessToken = token;
  return config;
});
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleResponseError = async (error) => {
  const originalRequest = error.config;

  const isForceLogout = error.response?.status === 401 && error.response?.data?.message === "NOT_AUTHORIZED";

  if (isForceLogout) {
    localStorage.removeItem("accessToken"); sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("user"); sessionStorage.removeItem("user");
    window.location.href = "/login";
    return Promise.reject(error);
  }

  const isUnauthorized =
    error.response &&
    (error.response.status === 401 ||
      error.response.status === 403 ||
      error.response.status === 498 ||
      (error.response.data &&
        error.response.data.message &&
        String(error.response.data.message).toLowerCase().includes("invalid token")));

  if (isUnauthorized && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["accessToken"] = token;
          return Axios(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = (sessionStorage.getItem("refreshToken") || localStorage.getItem("refreshToken"));
    const accessToken = (sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken"));

    if (!refreshToken) {
      isRefreshing = false;
      localStorage.removeItem("accessToken"); sessionStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken"); sessionStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return new Promise(function (resolve, reject) {
      publicApi
        .post("/renewAccessToken", {
          refreshToken: refreshToken,
          accessToken: accessToken,
        })
        .then((res) => {
          const newToken = res.data?.data?.accessToken || res.data?.accessToken;
          if (newToken) {
            if (sessionStorage.getItem("accessToken")) { sessionStorage.setItem("accessToken", newToken); } else { localStorage.setItem("accessToken", newToken); }
            if (res.data?.data?.refreshToken || res.data?.refreshToken) {
              if (sessionStorage.getItem("refreshToken")) { sessionStorage.setItem("refreshToken", res.data?.data?.refreshToken || res.data?.refreshToken); } else { localStorage.setItem("refreshToken", res.data?.data?.refreshToken || res.data?.refreshToken); }
            }
            originalRequest.headers["accessToken"] = newToken;
            processQueue(null, newToken);
            resolve(Axios(originalRequest));
          } else {
            throw new Error("No token returned from refresh endpoint");
          }
        })
        .catch((err) => {
          processQueue(err, null);
          localStorage.removeItem("accessToken"); sessionStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken"); sessionStorage.removeItem("refreshToken");
          window.location.href = "/login";
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }

  return Promise.reject(error);
};

securedApi.interceptors.response.use((response) => response, handleResponseError);
logoutSecuredApi.interceptors.response.use((response) => response, handleResponseError);
productSecuredApi.interceptors.response.use((response) => response, handleResponseError);
getuserSecuredApi.interceptors.response.use((response) => response, handleResponseError);
dashboardSecuredApi.interceptors.response.use((response) => response, handleResponseError);
paymentSecuredApi.interceptors.response.use((response) => response, handleResponseError);
userSecuredApi.interceptors.response.use((response) => response, handleResponseError);

export {
  securedApi,
  userPublicApi,
  userSecuredApi,
  productPublicApi,
  productSecuredApi,
  publicApi,
  logoutPublicApi,
  logoutSecuredApi,
  getuserPublicApi,
  getuserSecuredApi,
  dashboardSecuredApi,
  paymentSecuredApi,
  paymentPublicApi,
};
