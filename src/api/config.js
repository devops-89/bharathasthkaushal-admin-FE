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

securedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.accessToken = token;
  return config;
});

productSecuredApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.accessToken = token;
  return config;
});

userSecuredApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.accessToken = token;
  return config;
});

export {
  securedApi,
  userPublicApi,
  userSecuredApi,
  productPublicApi,
  productSecuredApi,
  publicApi,
};
