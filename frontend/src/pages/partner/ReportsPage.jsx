import { useEffect, useState } from "react";
import {
  Download,
  FolderKanban,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";

import analyticsService from "../../services/analyticsService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import ChartCard from "../../components/charts/ChartCard";
import AreaChartComponent from "../../components/charts/AreaChartComponent";
import BarChartComponent from "../../components/charts/BarChartComponent";
import LineChartComponent from "../../components/charts/LineChartComponent";
import PieChartComponent from "../../components/charts/PieChartComponent";
import RadialChartComponent from "../../components/charts/RadialChartComponent";

function ReportsPage() {
  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response =
        await analyticsService.getPartnerReports?.();

      setReport(response);
    } catch (err) {
      console.error(err);
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await analyticsService.exportReport?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Reports Error"
        message={error}
        onRetry={fetchReports}
      />
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-2">
            Partner Reports
          </h2>

          <p className="text-muted mb-0">
            Measure project performance and impact.
          </p>
        </div>

        <button
          className="btn btn-primary rounded-pill"
          onClick={handleExport}
        >
          <Download size={18} className="me-2" />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}

      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <FolderKanban
                size={45}
                className="text-primary mb-3"
              />

              <h3 className="fw-bold">
                {report?.totalProjects || 0}
              </h3>

              <p className="text-muted mb-0">
                Projects
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
                {report?.beneficiaries || 0}
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
                KES {report?.funding || 0}
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
                {report?.completionRate || 0}%
              </h3>

              <p className="text-muted mb-0">
                Completion Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <ChartCard title="Impact Trend">
            <AreaChartComponent
              data={report?.impactTrend || []}
              xKey="month"
              dataKey="beneficiaries"
            />
          </ChartCard>
        </div>

        <div className="col-lg-4">
          <ChartCard title="Funding Distribution">
            <PieChartComponent
              data={report?.fundingDistribution || []}
            />
          </ChartCard>
        </div>
      </div>

      {/* Charts Row 2 */}

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <ChartCard title="Monthly Growth">
            <LineChartComponent
              data={report?.growthTrend || []}
              xKey="month"
              dataKey="growth"
            />
          </ChartCard>
        </div>

        <div className="col-lg-6">
          <ChartCard title="Program Performance">
            <BarChartComponent
              data={report?.programPerformance || []}
              xKey="program"
              dataKey="impactScore"
            />
          </ChartCard>
        </div>
      </div>

      {/* Completion Chart */}

      <div className="row g-4 mb-5">
        <div className="col-lg-4">
          <ChartCard title="Completion Rate">
            <RadialChartComponent
              data={report?.completionChart || []}
            />
          </ChartCard>
        </div>
      </div>

      {/* Top Projects */}

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Top Projects
          </h5>

          <div className="table-responsive">
            <table className="table align-middle">

              <thead>
                <tr>
                  <th>Project</th>
                  <th>Budget</th>
                  <th>Beneficiaries</th>
                  <th>Completion %</th>
                  <th>Impact Score</th>
                </tr>
              </thead>

              <tbody>

                {(report?.topProjects || []).map(
                  (project) => (
                    <tr key={project.id}>
                      <td>{project.title}</td>

                      <td>
                        KES {project.budget?.toLocaleString()}
                      </td>

                      <td>{project.beneficiaries}</td>

                      <td>
                        {project.completionRate}%
                      </td>

                      <td>{project.impactScore}</td>
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

export default ReportsPage;