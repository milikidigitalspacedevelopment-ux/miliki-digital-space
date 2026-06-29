import { create } from "zustand";

const useUserStore = create((set) => ({
  profile: null,

  loading: false,

  error: null,

  setProfile: (profile) =>
    set({
      profile,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  clearProfile: () =>
    set({
      profile: null,
      error: null,
    }),
}));

export default useUserStore;