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

  registerForEvent: async (id) => {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  },
};

export default eventService;