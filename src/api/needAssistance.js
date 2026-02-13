import { getuserSecuredApi } from "./config";
export const needAssistanceControllers = {
  getAllNeedAssistance: (pageSize = 10, page = 1, status = "") => {
    const params = { pageSize, page, status };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );

    return getuserSecuredApi.get("/need-assistance", {
      params: filteredParams,
    });
  },
  getNeedAssistanceById: (id) => {
    return getuserSecuredApi.get(`/need-assistance/${id}`);
  },

  updateNeedAssistanceStatus: (id, data) => {
    return getuserSecuredApi.patch(`/need-assistance/update-status/${id}`, data);
  }

};