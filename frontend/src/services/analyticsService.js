import api from "./api";

const analyticsService = {
  getDashboardStats: async () => {
    const response =
      await api.get("/analytics");

    return response.data;
  },

  getMonthlyDonations: async () => {
    const response =
      await api.get(
        "/analytics/donations"
      );

    return response.data;
  },

  getCoursesOverview: async () => {
    const response =
      await api.get(
        "/analytics/courses"
      );

    return response.data;
  },
};

export default analyticsService;