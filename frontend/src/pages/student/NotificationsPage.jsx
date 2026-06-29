import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  BookOpen,
  Calendar,
  CheckCheck,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import notificationService from "../../services/notificationService";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response =
        await notificationService.getNotifications?.();

      setNotifications(response || []);
    } catch (err) {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.read
    ).length;
  }, [notifications]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead?.(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead?.();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <CheckCircle
            size={22}
            className="text-success"
          />
        );

      case "warning":
        return (
          <AlertCircle
            size={22}
            className="text-warning"
          />
        );

      case "course":
        return (
          <BookOpen
            size={22}
            className="text-primary"
          />
        );

      case "event":
        return (
          <Calendar
            size={22}
            className="text-info"
          />
        );

      default:
        return (
          <Info
            size={22}
            className="text-secondary"
          />
        );
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Notifications Error"
        message={error}
        onRetry={fetchNotifications}
      />
    );
  }

  if (!notifications.length) {
    return (
      <EmptyState
        title="No Notifications"
        description="You currently have no notifications."
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-5">

        <div>

          <h2 className="fw-bold mb-2">
            Notifications
          </h2>

          <p className="text-muted mb-0">
            Stay updated with your courses and activities.
          </p>

        </div>

        {unreadCount > 0 && (
          <button
            className="btn btn-success rounded-pill"
            onClick={markAllAsRead}
          >
            <CheckCheck
              size={18}
              className="me-2"
            />
            Mark All Read
          </button>
        )}

      </div>

      {/* Summary */}

      <div className="row mb-4">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <Bell
                  size={40}
                  className="text-primary me-3"
                />

                <div>

                  <small className="text-muted">
                    Total Notifications
                  </small>

                  <h3 className="fw-bold mb-0">
                    {notifications.length}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <AlertCircle
                  size={40}
                  className="text-warning me-3"
                />

                <div>

                  <small className="text-muted">
                    Unread
                  </small>

                  <h3 className="fw-bold mb-0">
                    {unreadCount}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Notifications List */}

      <div className="card border-0 shadow-sm rounded-5">

        <div className="card-body">

          {notifications.map((notification) => (

            <div
              key={notification.id}
              className={`border rounded-4 p-4 mb-3 ${
                !notification.read
                  ? "bg-light"
                  : ""
              }`}
            >

              <div className="d-flex">

                <div className="me-3">

                  {getIcon(notification.type)}

                </div>

                <div className="flex-grow-1">

                  <div className="d-flex justify-content-between">

                    <div>

                      <h6 className="fw-bold">

                        {notification.title}

                      </h6>

                      <p className="text-muted mb-2">

                        {notification.message}

                      </p>

                      <small className="text-secondary">

                        {notification.createdAt}

                      </small>

                    </div>

                    {!notification.read && (

                      <button
                        className="btn btn-outline-primary rounded-pill btn-sm"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                      >
                        Mark Read
                      </button>

                    )}

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default NotificationsPage;