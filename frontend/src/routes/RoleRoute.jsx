import {
  Navigate,
  Outlet
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

function RoleRoute({
  allowedRoles
}) {

  const {
    user
  } = useAuth();

  if (!user) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );

  }

  return <Outlet />;
}

export default RoleRoute; 