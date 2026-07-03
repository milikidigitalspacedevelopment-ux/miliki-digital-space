import {
  Navigate,
  Outlet
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

function ProtectedRoute() {

  const {
    isAuthenticated,
    loading
  } = useAuth();

  if (loading) {

    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">

        <div className="spinner-border text-success" />

      </div>
    );

  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

export default ProtectedRoute;