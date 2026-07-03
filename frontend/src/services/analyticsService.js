import api from "./api";

const analyticsService = {
  getDashboardStats: async () => {
    const response = await api.get("/analytics");
    return response.data;
  },

  getMonthlyDonations: async () => {
    const response = await api.get("/analytics/donations");
    return response.data;
  },

  getCoursesOverview: async () => {
    const response = await api.get("/analytics/courses");
    return response.data;
  },

  getImpactOverview: async () => {
    const response = await api.get("/analytics/impact-overview");
    return response.data;
  },

  getSuccessStories: async () => {
    const response = await api.get("/analytics/success-stories");
    return response.data;
  },
};

export default analyticsService;