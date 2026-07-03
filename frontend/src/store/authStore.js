import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || null),

  token: localStorage.getItem("token") || sessionStorage.getItem("token"),

  isAuthenticated: !!(localStorage.getItem("token") || sessionStorage.getItem("token")),

  loading: false,

  login: ({ user, token, rememberMe = true }) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  updateUser: (user) =>
    set({
      user,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  logout: () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;