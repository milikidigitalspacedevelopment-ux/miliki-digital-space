import { useEffect, useState } from "react";
import {
  FolderKanban,
  Users,
  DollarSign,
  TrendingUp,
  CalendarDays,
  Bell,
  FileText,
  PlusCircle,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import ChartCard from "../../components/charts/ChartCard";
import AreaChartComponent from "../../components/charts/AreaChartComponent";
import PieChartComponent from "../../components/charts/PieChartComponent";

import partnerService from "../../services/partnerService";
import analyticsService from "../../services/analyticsService";

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const stats =
        await partnerService.getDashboardStats?.();

      const analytics =
        await analyticsService.getPartnerAnalytics?.();

      setDashboard({
        ...stats,
        ...analytics,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
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

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-5">

        <div>
          <h2 className="fw-bold mb-1">
            Partner Dashboard
          </h2>

          <p className="text-muted mb-0">
            Monitor projects, funding and impact.
          </p>
        </div>

        <button className="btn btn-primary rounded-pill">
          <PlusCircle size={18} className="me-2" />
          New Project
        </button>

      </div>

      {/* KPI CARDS */}

      <div className="row g-4 mb-5">

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">

              <FolderKanban
                size={45}
                className="text-primary mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.activeProjects || 0}
              </h3>

              <p className="text-muted mb-0">
                Active Projects
              </p>

            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">

              <Users
                size={45}
                className="text-success mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.beneficiaries || 0}
              </h3>

              <p className="text-muted mb-0">
                Beneficiaries
              </p>

            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">

              <DollarSign
                size={45}
                className="text-warning mb-3"
              />

              <h3 className="fw-bold">
                KES {dashboard?.funding || 0}
              </h3>

              <p className="text-muted mb-0">
                Funding
              </p>

            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">

              <TrendingUp
                size={45}
                className="text-info mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.successRate || 0}%
              </h3>

              <p className="text-muted mb-0">
                Success Rate
              </p>

            </div>
          </div>
        </div>

      </div>

      {/* CHARTS */}

      <div className="row g-4 mb-5">

        <div className="col-lg-8">

          <ChartCard title="Monthly Impact">

            <AreaChartComponent
              data={dashboard?.monthlyImpact || []}
              xKey="month"
              dataKey="beneficiaries"
            />

          </ChartCard>

        </div>

        <div className="col-lg-4">

          <ChartCard title="Project Status">

            <PieChartComponent
              data={dashboard?.projectStatus || []}
            />

          </ChartCard>

        </div>

      </div>

      {/* RECENT PROJECTS */}

      <div className="card border-0 shadow-sm rounded-5 mb-5">

        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Recent Projects
          </h5>

          <div className="table-responsive">

            <table className="table align-middle">

              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {(dashboard?.recentProjects || []).map(
                  (project) => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>
                        <span className="badge bg-success">
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ACTIVITIES + NOTIFICATIONS */}

      <div className="row g-4">

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <h5 className="fw-bold mb-4">
                <CalendarDays
                  size={20}
                  className="me-2"
                />
                Upcoming Activities
              </h5>

              {(dashboard?.activities || []).map(
                (activity) => (
                  <div
                    key={activity.id}
                    className="border-bottom pb-3 mb-3"
                  >
                    <h6 className="mb-1">
                      {activity.title}
                    </h6>

                    <small className="text-muted">
                      {activity.date}
                    </small>
                  </div>
                )
              )}

            </div>

          </div>

        </div>

        <div className="col-lg-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <h5 className="fw-bold mb-4">
                <Bell
                  size={20}
                  className="me-2"
                />
                Notifications
              </h5>

              {(dashboard?.notifications || []).map(
                (notification) => (
                  <div
                    key={notification.id}
                    className="border-bottom pb-3 mb-3"
                  >
                    <FileText
                      size={18}
                      className="text-primary me-2"
                    />

                    {notification.message}
                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;