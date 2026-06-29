import api from "./api";

const volunteerService = {

  // list volunteers with optional params { q, skills, status, page, perPage }
  listVolunteers: async (params = {}) => {
    const response = await api.get("/volunteers", { params });
    return response.data;
  },

  getVolunteer: async (id) => {
    const response = await api.get(`/volunteers/${id}`);
    return response.data;
  },

  createVolunteer: async (payload) => {
    const response = await api.post(`/volunteers`, payload);
    return response.data;
  },

  updateVolunteer: async (id, payload) => {
    const response = await api.put(`/volunteers/${id}`, payload);
    return response.data;
  },

  deleteVolunteer: async (id) => {
    const response = await api.delete(`/volunteers/${id}`);
    return response.data;
  },

  getTasks: async () => {
    const response = await api.get("/volunteers/tasks");
    return response.data;
  },

  getEvents: async () => {
    const response = await api.get("/volunteers/events");
    return response.data;
  },

};

export default volunteerService;