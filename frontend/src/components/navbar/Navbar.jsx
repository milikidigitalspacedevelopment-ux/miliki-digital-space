import { Link, useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import { List } from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import { getDashboardPathByRole } from "../../utils/redirectByRole";

function Navbar() {
  console.log("[dev] Navbar render");
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () =>
    setMenuOpen((s) => {
      const next = !s;
      console.log("[dev] Navbar toggle ->", next);
      return next;
    });

  const role = (user?.role || user?.userType || user?.type || "").toString().toLowerCase();
  const isSuperAdmin = role === "super_admin" || role === "superadmin";

  const getDashboardPath = () => getDashboardPathByRole(role);

  const dashboardPath = getDashboardPath();
  const dashboardOptions = [
    { label: "Super Admin", path: "/super-admin" },
    { label: "Admin", path: "/admin" },
    { label: "Student", path: "/student" },
    { label: "Trainer", path: "/trainer" },
    { label: "Donor", path: "/donor" },
    { label: "Volunteer", path: "/volunteer" },
    { label: "Partner", path: "/partner" },
  ];

  const getProfilePath = () => {
    const role = (user?.role || user?.userType || user?.type || "").toString().toLowerCase();

    switch (role) {
      case "student":
        return "/student/profile";
      case "partner":
        return "/partner/profile";
      case "volunteer":
        return "/volunteer/profile";
      default:
        return getDashboardPath();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar bg-white shadow-sm"
      style={{
        position: "fixed",
        top: "42px",
        left: 0,
        right: 0,
        paddingTop: "0.25rem",
        paddingBottom: "0.25rem",
        zIndex: 1080,
      }}
    >
      <div className="container-fluid px-0 d-flex flex-column flex-lg-row align-items-center">
        <TopBar />


          {/* Upper Row */}
          <div className="d-flex justify-content-between align-items-center w-100 py-2 px-3 flex-grow-1 bg-white text-dark rounded-0 border-bottom" style={{ minHeight: "48px" }}>
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-outline-secondary d-lg-none me-2 mobile-toggle-btn"
                onClick={toggleMenu}
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={menuOpen}
                style={{ display: "inline-flex" }}
              >
                <List />
              </button>

              <Link className="navbar-brand fw-bold mb-0" to="/">
                Miliki Digital Space
              </Link>
              <span to="/">
                <img src="/nav-logo.png" alt="Miliki Logo" style={{ height: "50px", marginLeft: "8px" }} />
              </span>
            </div>

            {isAuthenticated ? (
              <div className="d-none d-lg-flex align-items-center gap-2">
                {isSuperAdmin ? (
                  <details className="position-relative">
                    <summary className="btn btn-outline-secondary" style={{ listStyle: "none" }}>
                      Dashboard
                    </summary>
                    <div className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm p-2" style={{ minWidth: "180px", zIndex: 1000 }}>
                      {dashboardOptions.map((option) => (
                        <Link key={option.path} className="d-block text-decoration-none text-dark py-1" to={option.path}>
                          {option.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link className="btn btn-outline-secondary" to={dashboardPath}>
                    Dashboard
                  </Link>
                )}
                <Link className="btn btn-outline-secondary" to={getProfilePath()}>
                  Profile
                </Link>
                <button className="btn btn-outline-secondary" onClick={handleLogout} type="button">
                  Logout
                </button>
              </div>
            ) : (
              <Link className="btn btn-outline-success d-none d-lg-block" to="/login">
                Join Now
              </Link>
            )}
          </div>

          {/* Lower Row */}
          <MobileMenu
            open={menuOpen}
            setOpen={setMenuOpen}
            isAuthenticated={isAuthenticated}
            isSuperAdmin={isSuperAdmin}
            dashboardPath={dashboardPath}
            getProfilePath={getProfilePath}
            handleLogout={handleLogout}
          />

        </div>
    </nav>
  );
}

export default Navbar; 