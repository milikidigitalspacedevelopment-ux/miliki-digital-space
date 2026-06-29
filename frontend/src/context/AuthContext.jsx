import {
  createContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /*
  --------------------------------
  Initialize Session
  --------------------------------
  */

  useEffect(() => {
    initializeAuth();
  }, []);

  console.log("[dev] AuthProvider render", { user, token, loading });

  const initializeAuth = async () => {
    try {
      setLoading(true);


      const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedUserRaw = localStorage.getItem("user") || sessionStorage.getItem("user");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      if (storedUserRaw) {
        setUser(JSON.parse(storedUserRaw));
      }

      /*
      Optional:
      Verify token with backend
      */

      try {
        const response = await authService.getCurrentUser();
        const currentUser = response.data || response.user;

        setUser(currentUser);

        // Persist using same storage used for the token
        if (localStorage.getItem("token")) {
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          sessionStorage.setItem("user", JSON.stringify(currentUser));
        }
      } catch (err) {
        logout();
      }
    } catch (err) {
      console.error(err);

      logout();
    } finally {
      setLoading(false);
    }
  };

  /*
  --------------------------------
  Login
  --------------------------------
  */

  const login = ({ token, user, rememberMe = true }) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setToken(token);
    setUser(user);
    setError(null);
  };

  /*
  --------------------------------
  Update User
  --------------------------------
  */

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  /*
  --------------------------------
  Logout
  --------------------------------
  */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
    setToken(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,

        isAuthenticated:
          !!token,

        login,

        logout,

        updateUser,

        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;