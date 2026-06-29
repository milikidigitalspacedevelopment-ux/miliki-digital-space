import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AuthGuard({ children }) {

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {

    return <Navigate to="/login" replace />;

  }

  return children;

}

export default AuthGuard;