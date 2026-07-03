import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardNavbar from "../components/navbar/DashboardNavbar";
import DashboardSidebar from "../components/navbar/DashboardSidebar";
import DashboardFooter from "../components/navbar/DashboardFooter";

function DashboardLayoutShell({
  title,
  links
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if screen is large enough to show sidebar by default
    const isLargeScreen = window.innerWidth >= 768;
    setSidebarOpen(isLargeScreen);

    const handleResize = () => {
      const isLarge = window.innerWidth >= 768;
      setSidebarOpen(isLarge);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="d-flex" style={{ overflow: "hidden", width: "100%" }}>

      <DashboardSidebar links={links} open={sidebarOpen} onCloseSidebar={closeSidebar} />

      {sidebarOpen && (
        <div
          className="d-md-none"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999
          }}
          onClick={closeSidebar}
        />
      )}

      <div className="flex-grow-1 d-flex flex-column min-vh-100" style={{ overflow: "hidden", width: "100%" }}>

        <DashboardNavbar title={title} onToggleSidebar={toggleSidebar} />

        <main className="flex-grow-1" style={{ padding: "1rem", overflowY: "auto", overflowX: "hidden", background: "linear-gradient(135deg, #f8fff4 0%, #e9fbe7 100%)" }}>

          <Outlet />

        </main>

        <DashboardFooter />

      </div>

    </div>
  );
}

export default DashboardLayoutShell;