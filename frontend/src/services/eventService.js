import api from "./api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.events)) return payload.events;
  return [];
};

const normalizeItem = (payload) => payload?.data ?? payload;

const eventService = {
  getEvents: async () => {
    const response = await api.get("/events");
    return normalizeList(response.data ?? response);
  },

  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return normalizeItem(response.data ?? response);
  },

  getEventById: async (id) => eventService.getEvent(id),

  createEvent: async (payload) => {
    const response = await api.post("/events", payload);
    return normalizeItem(response.data ?? response);
  },

  updateEvent: async (id, payload) => {
    const response = await api.put(`/events/${id}`, payload);
    return normalizeItem(response.data ?? response);
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return normalizeItem(response.data ?? response);
  },

  uploadEventImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return normalizeItem(response.data ?? response);
  },

  registerForEvent: async (id) => {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  },
};

export default eventService;