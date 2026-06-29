import {
  Users,
  BookOpen,
  GraduationCap,
  HandCoins,
  CalendarDays,
  PlusCircle,
  FileText,
  HeartHandshake,
} from "lucide-react";

import { useEffect } from "react";
import ChartCard from "../../components/charts/ChartCard";
import AreaChartComponent from "../../components/charts/AreaChartComponent";
import LineChartComponent from "../../components/charts/LineChartComponent";
import PieChartComponent from "../../components/charts/PieChartComponent";
import DonutChartComponent from "../../components/charts/DonutChartComponent";
import analyticsService from "../../services/analyticsService";
import notificationService from "../../services/notificationService";
import useDashboardStore from "../../store/dashboardStore";
import useNotificationStore from "../../store/notificationStore";

function DashboardPage() {
  const defaultStats = [
    {
      title: "Total Users",
      value: "12,548",
      icon: <Users size={26} />,
      bg: "bg-primary",
    },
    {
      title: "Programs",
      value: "34",
      icon: <GraduationCap size={26} />,
      bg: "bg-success",
    },
    {
      title: "Courses",
      value: "127",
      icon: <BookOpen size={26} />,
      bg: "bg-warning",
    },
    {
      title: "Donations",
      value: "$68,420",
      icon: <HandCoins size={26} />,
      bg: "bg-danger",
    },
  ];

  const stats = useDashboardStore((s) => s.stats) || defaultStats;
  const recentActivities = useDashboardStore((s) => s.recentActivities) || [];
  const loading = useDashboardStore((s) => s.loading);

  const setStats = useDashboardStore((s) => s.setStats);
  const setRecentActivities = useDashboardStore((s) => s.setRecentActivities);
  const setLoading = useDashboardStore((s) => s.setLoading);

  const setNotifications = useNotificationStore((s) => s.setNotifications);

  const upcomingEvents = [
    {
      id: 1,
      title: "Women Empowerment Summit",
      date: "Aug 20",
    },
    {
      id: 2,
      title: "Digital Skills Workshop",
      date: "Aug 25",
    },
    {
      id: 3,
      title: "Youth Leadership Forum",
      date: "Sep 02",
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const dashboard = await analyticsService.getDashboardStats();
        if (dashboard) {
          // Expecting shape { stats: [...], recentActivities: [...] }
          if (dashboard.stats) setStats(dashboard.stats);
          if (dashboard.recentActivities)
            setRecentActivities(dashboard.recentActivities);
        }

        const notifications =
          await notificationService.getNotifications();
        if (notifications) setNotifications(notifications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [setLoading, setStats, setRecentActivities, setNotifications]);

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Dashboard
          </h2>

          <p className="text-muted mb-0">
            Overview of Miliki Foundation activities.
          </p>
        </div>

        <button className="btn btn-success rounded-pill px-4">
          <PlusCircle size={18} className="me-2" />
          Quick Create
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-4 mb-5">

        {stats.map((item, index) => (
          <div
            className="col-xl-3 col-md-6"
            key={index}
          >
            <div className="card border-0 shadow-sm rounded-5 h-100">

              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <small className="text-muted">
                      {item.title}
                    </small>

                    <h3 className="fw-bold mt-2">
                      {item.value}
                    </h3>
                  </div>

                  <div
                    className={`${item.bg} text-white rounded-circle d-flex align-items-center justify-content-center`}
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  >
                    {item.icon}
                  </div>

                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-4 mb-5">

        <div className="col-xl-8">
          <ChartCard title="Monthly Donations">
            <AreaChartComponent />
          </ChartCard>
        </div>

        <div className="col-xl-4">
          <ChartCard title="Program Distribution">
            <PieChartComponent />
          </ChartCard>
        </div>

        <div className="col-xl-6">
          <ChartCard title="User Growth">
            <LineChartComponent />
          </ChartCard>
        </div>

        <div className="col-xl-6">
          <ChartCard title="Revenue Sources">
            <DonutChartComponent />
          </ChartCard>
        </div>

      </div>

      {/* Lower Section */}
      <div className="row g-4">

        {/* Activities */}
        <div className="col-lg-5">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-header bg-white border-0">
              <h5 className="fw-bold mb-0">
                Recent Activities
              </h5>
            </div>

            <div className="card-body">

              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="d-flex mb-4"
                >
                  <div
                    className="bg-success rounded-circle me-3"
                    style={{
                      width: 12,
                      height: 12,
                      marginTop: 7,
                    }}
                  />

                  <div>
                    <div className="fw-semibold">
                      {activity.text}
                    </div>

                    <small className="text-muted">
                      {activity.time}
                    </small>
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* Upcoming Events */}
        <div className="col-lg-4">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-header bg-white border-0">
              <h5 className="fw-bold mb-0">
                Upcoming Events
              </h5>
            </div>

            <div className="card-body">

              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="d-flex justify-content-between align-items-center mb-4"
                >
                  <div className="d-flex align-items-center">

                    <div className="bg-light rounded-circle p-3 me-3">
                      <CalendarDays size={20} />
                    </div>

                    <div>
                      <div className="fw-semibold">
                        {event.title}
                      </div>

                      <small className="text-muted">
                        {event.date}
                      </small>
                    </div>

                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="col-lg-3">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-header bg-white border-0">
              <h5 className="fw-bold mb-0">
                Quick Actions
              </h5>
            </div>

            <div className="card-body d-grid gap-3">

              <button className="btn btn-outline-success rounded-pill">
                <GraduationCap size={18} className="me-2" />
                Add Program
              </button>

              <button className="btn btn-outline-primary rounded-pill">
                <BookOpen size={18} className="me-2" />
                Add Course
              </button>

              <button className="btn btn-outline-warning rounded-pill">
                <HeartHandshake size={18} className="me-2" />
                Create Campaign
              </button>

              <button className="btn btn-outline-danger rounded-pill">
                <FileText size={18} className="me-2" />
                Publish Blog
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;