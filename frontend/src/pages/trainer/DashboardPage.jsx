import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  ClipboardList,
  GraduationCap,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import ChartCard from "../../components/charts/ChartCard";
import AreaChartComponent from "../../components/charts/AreaChartComponent";
import BarChartComponent from "../../components/charts/BarChartComponent";
import PieChartComponent from "../../components/charts/PieChartComponent";

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

      const response =
        await analyticsService.getTrainerDashboard?.();

      setDashboard(response);
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

      {/* Header */}

      <div className="mb-5">

        <h2 className="fw-bold mb-2">
          Trainer Dashboard
        </h2>

        <p className="text-muted">
          Monitor students, assignments and course performance.
        </p>

      </div>

      {/* Stats */}

      <div className="row g-4 mb-5">

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <BookOpen
                  size={45}
                  className="text-primary me-3"
                />

                <div>

                  <small className="text-muted">
                    Courses
                  </small>

                  <h3 className="fw-bold mb-0">
                    {dashboard?.totalCourses || 0}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <Users
                  size={45}
                  className="text-success me-3"
                />

                <div>

                  <small className="text-muted">
                    Students
                  </small>

                  <h3 className="fw-bold mb-0">
                    {dashboard?.totalStudents || 0}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <ClipboardList
                  size={45}
                  className="text-warning me-3"
                />

                <div>

                  <small className="text-muted">
                    Assignments
                  </small>

                  <h3 className="fw-bold mb-0">
                    {dashboard?.totalAssignments || 0}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <GraduationCap
                  size={45}
                  className="text-info me-3"
                />

                <div>

                  <small className="text-muted">
                    Completion Rate
                  </small>

                  <h3 className="fw-bold mb-0">
                    {dashboard?.completionRate || 0}%
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

          <ChartCard title="Enrollment Trend">

            <AreaChartComponent
              data={dashboard?.enrollmentTrend || []}
              dataKey="students"
              xKey="month"
            />

          </ChartCard>

        </div>

        <div className="col-lg-4">

          <ChartCard title="Course Completion">

            <PieChartComponent
              data={dashboard?.completionChart || []}
            />

          </ChartCard>

        </div>

      </div>

      {/* Performance */}

      <div className="row g-4">

        <div className="col-lg-12">

          <ChartCard title="Assignments Performance">

            <BarChartComponent
              data={dashboard?.assignmentPerformance || []}
              dataKey="averageScore"
              xKey="course"
            />

          </ChartCard>

        </div>

      </div>

      {/* Recent Activity */}

      <div className="card border-0 shadow-sm rounded-5 mt-5">

        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Recent Activity
          </h5>

          {(dashboard?.recentActivities || []).map(
            (activity, index) => (
              <div
                key={index}
                className="border-bottom py-3"
              >
                <div className="fw-semibold">
                  {activity.title}
                </div>

                <small className="text-muted">
                  {activity.time}
                </small>
              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;