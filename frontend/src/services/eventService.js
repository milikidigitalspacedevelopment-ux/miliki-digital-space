import api from "./api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.events)) return payload.events;
  return [];
};

const normalizeItem = (payload) => payload?.data ?? payload;

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/?api\/?$/, "");

const slugify = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const resolveImageUrl = (value) => {
  if (!value) return "/images/event.jpg";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${apiBaseUrl}${value}`;
  return `${apiBaseUrl}/${value}`;
};

const normalizeEvent = (event) => {
  if (!event || typeof event !== "object") return null;

  const eventDate = event.start_date || event.date || event.event_date || event.datetime || "TBD";
  const eventTime = event.time || event.start_time || event.event_time || "To be announced";

  return {
    ...event,
    id: event.id ?? event._id,
    title: event.title || event.name || "Untitled event",
    description: event.description || event.details || "Join us for this community event.",
    image: resolveImageUrl(event.image_url || event.image || event.thumbnail || event.cover_image),
    image_url: event.image_url || event.image || event.thumbnail || event.cover_image || "",
    event_date: event.event_date || eventDate,
    date: event.date || eventDate,
    start_date: event.start_date || eventDate,
    end_date: event.end_date || null,
    location: event.location || event.venue || "TBD",
    time: eventTime,
    slug: event.slug || slugify(event.title || event.name || event.id),
  };
};

const normalizeEventsPayload = (payload) => {
  const items = normalizeList(payload);
  return items.map((item) => normalizeEvent(item)).filter(Boolean);
};

const eventService = {
  getEvents: async () => {
    const response = await api.get("/events");
    return normalizeEventsPayload(response.data ?? response);
  },

  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    const item = normalizeItem(response.data ?? response);
    return normalizeEvent(item);
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