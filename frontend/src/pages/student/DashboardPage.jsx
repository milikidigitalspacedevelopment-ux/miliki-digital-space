import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  ClipboardList,
  Bell,
  Clock,
  ArrowRight,
  User,
} from "lucide-react";

import ChartCard from "../../components/charts/ChartCard";
import AreaChartComponent from "../../components/charts/AreaChartComponent";
import LineChartComponent from "../../components/charts/LineChartComponent";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import courseService from "../../services/courseService";
import analyticsService from "../../services/analyticsService";
import notificationService from "../../services/notificationService";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, coursesRes, notificationsRes] = await Promise.all([
        analyticsService.getStudentStats?.(),
        courseService.getMyCourses?.(),
        notificationService.getNotifications?.(),
      ]);

      setStats(statsRes || {});
      setCourses(coursesRes || []);
      setNotifications(notificationsRes || []);
    } catch (err) {
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Dashboard Error"
        message={error}
        onRetry={fetchDashboard}
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Welcome */}

      <div className="mb-5">

        <h2 className="fw-bold mb-2">
          Welcome Back 👋
        </h2>

        <p className="text-muted mb-4">
          Continue learning and track your progress.
        </p>

        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-3 mb-4">
          <div className="col">
            <Link
              to="/student/notifications"
              className="card border-0 shadow-sm rounded-5 text-decoration-none h-100"
            >
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-light rounded-4 p-3 d-inline-flex align-items-center justify-content-center">
                  <Bell size={24} className="text-danger" />
                </div>
                <div>
                  <small className="text-muted d-block">
                    Notifications
                  </small>
                  <h5 className="fw-bold mb-0">
                    {notifications.length}
                  </h5>
                </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link
              to="/student/profile"
              className="card border-0 shadow-sm rounded-5 text-decoration-none h-100"
            >
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-light rounded-4 p-3 d-inline-flex align-items-center justify-content-center">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <small className="text-muted d-block">
                    Profile
                  </small>
                  <h5 className="fw-bold mb-0">Account</h5>
                </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link
              to="/student/settings"
              className="card border-0 shadow-sm rounded-5 text-decoration-none h-100"
            >
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-light rounded-4 p-3 d-inline-flex align-items-center justify-content-center">
                  <User size={24} className="text-warning" />
                </div>
                <div>
                  <small className="text-muted d-block">
                    Settings
                  </small>
                  <h5 className="fw-bold mb-0">Account</h5>
                </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link
              to="/student/my-courses"
              className="card border-0 shadow-sm rounded-5 text-decoration-none h-100"
            >
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-light rounded-4 p-3 d-inline-flex align-items-center justify-content-center">
                  <BookOpen size={24} className="text-success" />
                </div>
                <div>
                  <small className="text-muted d-block">
                    My Courses
                  </small>
                  <h5 className="fw-bold mb-0">Continue</h5>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* Statistics */}

      <div className="row g-4 mb-5">

        <div className="col-12 col-sm-6 col-lg-3">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <BookOpen
                  size={35}
                  className="text-primary me-3"
                />

                <div>

                  <small className="text-muted">
                    My Courses
                  </small>

                  <h3 className="fw-bold mb-0">
                    {stats?.courses || 0}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-12 col-sm-6 col-lg-3">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <GraduationCap
                  size={35}
                  className="text-success me-3"
                />

                <div>

                  <small className="text-muted">
                    Certificates
                  </small>

                  <h3 className="fw-bold mb-0">
                    {stats?.certificates || 0}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-12 col-sm-6 col-lg-3">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <ClipboardList
                  size={35}
                  className="text-warning me-3"
                />

                <div>

                  <small className="text-muted">
                    Assignments
                  </small>

                  <h3 className="fw-bold mb-0">
                    {stats?.assignments || 0}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-12 col-sm-6 col-lg-3">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <Bell
                  size={35}
                  className="text-danger me-3"
                />

                <div>

                  <small className="text-muted">
                    Notifications
                  </small>

                  <h3 className="fw-bold mb-0">
                    {notifications.length}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Charts */}

      <div className="row g-4 mb-5">

        <div className="col-lg-8">

          <ChartCard title="Learning Progress">
            <AreaChartComponent />
          </ChartCard>

        </div>

        <div className="col-lg-4">

          <ChartCard title="Course Completion">
            <LineChartComponent />
          </ChartCard>

        </div>

      </div>

      {/* Current Courses */}

      <div className="card border-0 shadow-sm rounded-5 mb-5">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h5 className="fw-bold mb-0">
              Continue Learning
            </h5>

            <Link
              to="/student/my-courses"
              className="btn btn-outline-primary rounded-pill d-inline-flex align-items-center"
            >
              View All
            </Link>

          </div>

          <div className="row g-4">

            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="col-12 col-sm-6 col-lg-4"
              >
                <div className="card border rounded-5 h-100">

                  <div className="card-body">

                    <h5 className="fw-bold">
                      {course.title}
                    </h5>

                    <p className="text-muted">
                      {course.instructor}
                    </p>

                    <div className="progress mb-3">
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${course.progress || 0}%`,
                        }}
                      />
                    </div>

                    <small className="text-muted">
                      {course.progress || 0}% Completed
                    </small>

                  </div>

                  <div className="card-footer bg-white border-0">

                    <Link
                      to="/student/my-courses"
                      className="btn btn-success rounded-pill w-100 d-inline-flex justify-content-center align-items-center"
                    >
                      Continue
                      <ArrowRight
                        size={16}
                        className="ms-2"
                      />
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Notifications */}

      <div className="card border-0 shadow-sm rounded-5">

        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Recent Notifications
          </h5>

          {notifications.length === 0 ? (
            <p className="text-muted">
              No notifications available.
            </p>
          ) : (
            notifications.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="border-bottom py-3"
                role="button"
                onClick={() => navigate("/student/notifications")}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-start">

                  <Clock
                    size={18}
                    className="text-secondary me-3 mt-1"
                  />

                  <div>

                    <div className="fw-semibold">
                      {item.title}
                    </div>

                    <small className="text-muted">
                      {item.message}
                    </small>

                  </div>

                </div>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;