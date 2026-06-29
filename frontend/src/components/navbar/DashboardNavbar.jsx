import React, { useEffect, useRef, useState } from "react";
import { FaBell, FaEnvelope, FaBars, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import notificationService from "../../services/notificationService";
import UserDropdown from "./UserDropdown";

function DashboardNavbar({ title, onToggleSidebar }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await notificationService.getNotifications?.();
        if (mounted) setNotifications(res || []);
      } catch (err) {
        // ignore
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <nav className="navbar navbar-expand bg-white shadow-sm" style={{ padding: "0.75rem 1rem" }}>

      <button
        className="btn btn-light me-2"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        style={{ padding: "0.5rem" }}
      >
        <FaBars />
      </button>

      <button
        className="btn btn-light me-3"
        onClick={() => navigate("/")}
        aria-label="Go to home"
        style={{ padding: "0.5rem" }}
      >
        <FaHome />
      </button>

      <h5 className="mb-0 fw-bold" style={{ fontSize: "1rem" }}>{title}</h5>

      <div className="ms-auto d-flex align-items-center" style={{ gap: "0.75rem" }}>

        <div className="position-relative" ref={wrapperRef}>
          <button
            className="btn btn-light position-relative"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            style={{ padding: "0.5rem" }}
          >
            <FaBell />

            {unread > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unread}
              </span>
            )}
          </button>

          {open && (
            <div
              className="card shadow-sm"
              style={{ position: "absolute", right: 0, top: "48px", width: "min(340px, calc(100vw - 2rem))", zIndex: 1050 }}
            >
              <div className="card-body p-2">
                <div className="d-flex justify-content-between align-items-center px-2 mb-2">
                  <strong>Notifications</strong>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={async () => {
                      try {
                        await notificationService.markAllAsRead?.();
                        setNotifications((prev) => prev.map((p) => ({ ...p, read: true })));
                      } catch (err) {
                        // ignore
                      }
                    }}
                  >
                    Mark all
                  </button>
                </div>

                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {notifications.length === 0 && (
                    <div className="text-muted p-3">No notifications</div>
                  )}

                  {notifications.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      className={`d-flex gap-3 align-items-start p-2 ${item.read ? "text-muted" : "fw-semibold"}`}
                      role="button"
                      onClick={() => {
                        setOpen(false);
                        navigate("/student/notifications");
                      }}
                    >
                      <div style={{ width: 36 }}>
                        <FaBell />
                      </div>
                      <div>
                        <div>{item.title}</div>
                        <small className="text-muted">{item.message}</small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 text-center">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      setOpen(false);
                      navigate("/student/notifications");
                    }}
                  >
                    View all
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="btn btn-light" onClick={() => navigate("/student/notifications")}> 
          <FaEnvelope />
        </button>

        <UserDropdown />

      </div>
    </nav>
  );
}

export default DashboardNavbar;