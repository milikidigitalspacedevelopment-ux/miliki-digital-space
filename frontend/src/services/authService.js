import api from "./api";

const authService = {
  login: async (credentials) => {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(
      "/auth/register",
      userData
    );

    return response.data;
  },

  logout: async () => {
    const token =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");

    const response = await api.post(
      "/auth/logout",
      { token }
    );

    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post(
      "/auth/forgot-password",
      { email }
    );

    return response.data;
  },

  resetPassword: async (
    token,
    password
  ) => {
    const response = await api.post(
      `/auth/reset-password/${token}`,
      { password }
    );

    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post(
      `/auth/verify-email/${token}`
    );

    return response.data;
  },

  resendVerificationEmail: async (
    email
  ) => {
    const response = await api.post(
      "/auth/resend-verification",
      { email }
    );

    return response.data;
  },

  refreshToken: async () => {
    const token =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");

    const response = await api.post(
      "/auth/refresh",
      { token }
    );

    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get(
      "/auth/me"
    );

    return response.data;
  },
};

export default authService;