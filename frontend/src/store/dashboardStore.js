import { create } from "zustand";

const useDashboardStore = create((set) => ({
  stats: [],

  recentActivities: [],

  loading: false,

  setStats: (stats) =>
    set({
      stats,
    }),

  setRecentActivities: (
    recentActivities
  ) =>
    set({
      recentActivities,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),
}));

export default useDashboardStore;