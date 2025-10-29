import { getuserSecuredApi } from "./config";

export const needAssistanceControllers = {
  getAllNeedAssistance: (pageSize = 10, page = 1, status = '') => {
    return  getuserSecuredApi.get(
      `/need-assistance?pageSize=${pageSize}&page=${page}&status=${status}`
    );
  },
  getNeedAssistanceById: (id) => {
    return  getuserSecuredApi.get(`/need-assistance/${id}`);
  },

  updateNeedAssistanceStatus: (id, data) => {
    return  getuserSecuredApi.patch(`/need-assistance/update-status/${id}`, data);
  }
  
};