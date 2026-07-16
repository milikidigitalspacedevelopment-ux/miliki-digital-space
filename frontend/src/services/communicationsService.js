import api from "./api";

const communicationsService = {
  sendMassEmail: async (payload) => api.post("/communications/mass-email", payload),
  sendQueuedEmails: async (payload) => api.post("/communications/send-queued", payload),
  notifyContent: async (payload) => api.post("/communications/notify-content", payload),
};

export default communicationsService;
