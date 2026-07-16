import api from "./api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.campaigns)) return payload.campaigns;
  return [];
};

const normalizeItem = (payload) => payload?.data ?? payload;

const campaignService = {
  getCampaigns: async () => {
    const response = await api.get("/campaigns");
    return normalizeList(response.data ?? response);
  },

  getCampaign: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return normalizeItem(response.data ?? response);
  },

  getCampaignById: async (id) => campaignService.getCampaign(id),

  createCampaign: async (data) => {
    const response = await api.post("/campaigns", data);
    return normalizeItem(response.data ?? response);
  },

  updateCampaign: async (id, data) => {
    const response = await api.put(`/campaigns/${id}`, data);
    return normalizeItem(response.data ?? response);
  },

  deleteCampaign: async (id) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  donateToCampaign: async (id, data) => {
    const response = await api.post(`/campaigns/${id}/donate`, data);
    return response.data;
  },
};

export default campaignService;