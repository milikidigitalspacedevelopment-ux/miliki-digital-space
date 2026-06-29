import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Clock3,
  Award,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import ChartCard from "../../components/charts/ChartCard";
import BarChartComponent from "../../components/charts/BarChartComponent";
import LineChartComponent from "../../components/charts/LineChartComponent";

import volunteerService from "../../services/volunteerService";

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
        await volunteerService.getDashboard?.();

      setDashboard(response);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
          Volunteer Dashboard
        </h2>

        <p className="text-muted">
          Monitor your activities, assignments and
          impact.
        </p>
      </div>

      {/* Stats */}

      <div className="row g-4 mb-5">
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <CalendarDays
                size={40}
                className="text-primary mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.upcomingEvents || 0}
              </h3>

              <p className="text-muted mb-0">
                Upcoming Events
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <ClipboardList
                size={40}
                className="text-success mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.tasksAssigned || 0}
              </h3>

              <p className="text-muted mb-0">
                Assigned Tasks
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <Clock3
                size={40}
                className="text-warning mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.hoursServed || 0}
              </h3>

              <p className="text-muted mb-0">
                Hours Served
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <Award
                size={40}
                className="text-danger mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.achievements || 0}
              </h3>

              <p className="text-muted mb-0">
                Achievements
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}

      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <ChartCard title="Volunteer Hours">
            <LineChartComponent
              data={dashboard?.hoursChart || []}
              xKey="month"
              dataKey="hours"
            />
          </ChartCard>
        </div>

        <div className="col-lg-6">
          <ChartCard title="Tasks Completed">
            <BarChartComponent
              data={dashboard?.tasksChart || []}
              xKey="month"
              dataKey="completed"
            />
          </ChartCard>
        </div>
      </div>

      {/* Upcoming Events */}

      <div className="card border-0 shadow-sm rounded-5 mb-5">
        <div className="card-body">
          <h4 className="fw-bold mb-4">
            Upcoming Events
          </h4>

          <div className="table-responsive">
            <table className="table align-middle">

              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Location</th>
                </tr>
              </thead>

              <tbody>
                {(dashboard?.events || []).map(
                  (event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.location}</td>
                    </tr>
                  )
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body">
          <h4 className="fw-bold mb-4">
            Recent Tasks
          </h4>

          <div className="table-responsive">
            <table className="table align-middle">

              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {(dashboard?.recentTasks || []).map(
                  (task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>

                      <td>
                        <span className="badge bg-warning">
                          {task.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge bg-${
                            task.status === "Completed"
                              ? "success"
                              : task.status === "In Progress"
                              ? "primary"
                              : "secondary"
                          }`}
                        >
                          {task.status}
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
    </div>
  );
}

export default DashboardPage;