import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
});

const getStoredToken = () =>
  localStorage.getItem("token") ||
  sessionStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  sessionStorage.getItem("accessToken");

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("refreshToken");
      localStorage.removeItem("refreshToken");

      const authPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
      const isAuthPage = authPaths.some((path) => window.location.pathname.startsWith(path));

      if (!isAuthPage) {
        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;