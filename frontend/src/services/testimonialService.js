import api from "./api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.testimonials)) return payload.testimonials;
  return [];
};

const testimonialService = {
  getTestimonials: async (status) => {
    const response = await api.get("/testimonials", { params: status ? { status } : {} });
    return normalizeList(response.data ?? response);
  },
  createTestimonial: async (data) => {
    const response = await api.post("/testimonials", data);
    return response.data;
  },
  updateTestimonial: async (id, data) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response.data;
  },
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
};

export default testimonialService;
