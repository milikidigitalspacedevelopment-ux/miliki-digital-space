import api from "./api";

const partnerService = {

  // list partners with optional query params { q, type, status, page, perPage }
  listPartners: async (params = {}) => {
    const response = await api.get("/partners", { params });
    return response.data;
  },

  getPartner: async (id) => {
    const response = await api.get(`/partners/${id}`);
    return response.data;
  },

  createPartner: async (payload) => {
    const response = await api.post(`/partners`, payload);
    return response.data;
  },

  updatePartner: async (id, payload) => {
    const response = await api.put(`/partners/${id}`, payload);
    return response.data;
  },

  deletePartner: async (id) => {
    const response = await api.delete(`/partners/${id}`);
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get("/partners/projects");
    return response.data;
  },

  getReports: async () => {
    const response = await api.get("/partners/reports");
    return response.data;
  },

};

export default partnerService;