import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="auth-page min-vh-100 d-flex align-items-center justify-content-center">
      <Outlet />
    </div>
  );
}

export default AuthLayout;