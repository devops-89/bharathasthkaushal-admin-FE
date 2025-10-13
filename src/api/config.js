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
const getuserSecuredApi=Axios.create({
  baseURL: serverConstants.getuserUrl,
});
const getuserPublicApi=Axios.create({
  baseURL:serverConstants.getuserUrl,
});
const logoutPublicApi = Axios.create({
  baseURL: serverConstants.logoutUrl,
});
const logoutSecuredApi= Axios.create({
  baseURL: serverConstants.logoutUrl,
})
securedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.accessToken = token;
  return config;
});

logoutSecuredApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.accessToken = token;
  return config;
});

productSecuredApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.accessToken = token;
  return config;
});


getuserSecuredApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.accessToken = token;
  return config;
});

logoutSecuredApi.interceptors.request.use((config) => {
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
  logoutPublicApi,
  logoutSecuredApi,
  getuserPublicApi,
  getuserSecuredApi,
};
