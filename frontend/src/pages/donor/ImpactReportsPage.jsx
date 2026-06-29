import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  Trees,
  FolderKanban,
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

function ImpactReportsPage() {
  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchImpactReport();
  }, []);

  const fetchImpactReport = async () => {
    try {
      setLoading(true);

      const response =
        await analyticsService.getDonorImpactReport?.();

      setReport(response);
    } catch (err) {
      console.error(err);
      setError("Failed to load impact reports.");
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
        title="Impact Report Error"
        message={error}
        onRetry={fetchImpactReport}
      />
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="mb-5">
        <h2 className="fw-bold mb-2">
          Impact Reports
        </h2>

        <p className="text-muted">
          See how your support is changing lives.
        </p>
      </div>

      {/* Statistics */}

      <div className="row g-4 mb-5">
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <Users
                size={42}
                className="text-primary mb-3"
              />

              <h3 className="fw-bold">
                {report?.beneficiaries || 0}
              </h3>

              <p className="text-muted mb-0">
                Beneficiaries Reached
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <FolderKanban
                size={42}
                className="text-success mb-3"
              />

              <h3 className="fw-bold">
                {report?.campaigns || 0}
              </h3>

              <p className="text-muted mb-0">
                Campaigns Funded
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <GraduationCap
                size={42}
                className="text-warning mb-3"
              />

              <h3 className="fw-bold">
                {report?.scholarships || 0}
              </h3>

              <p className="text-muted mb-0">
                Scholarships Supported
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">
              <Trees
                size={42}
                className="text-success mb-3"
              />

              <h3 className="fw-bold">
                {report?.trees || 0}
              </h3>

              <p className="text-muted mb-0">
                Trees Planted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}

      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          <ChartCard title="Impact Trend">
            <AreaChartComponent
              data={report?.impactTrend || []}
              xKey="month"
              dataKey="value"
            />
          </ChartCard>
        </div>

        <div className="col-lg-4">
          <ChartCard title="Project Completion">
            <RadialChartComponent
              data={report?.completionChart || []}
            />
          </ChartCard>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <ChartCard title="Category Impact">
            <PieChartComponent
              data={report?.categoryImpact || []}
            />
          </ChartCard>
        </div>

        <div className="col-lg-6">
          <ChartCard title="Monthly Progress">
            <LineChartComponent
              data={report?.impactTrend || []}
              xKey="month"
              dataKey="value"
            />
          </ChartCard>
        </div>
      </div>

      <div className="mb-5">
        <ChartCard title="Impact Breakdown">
          <BarChartComponent
            data={report?.categoryImpact || []}
            xKey="category"
            dataKey="value"
          />
        </ChartCard>
      </div>

      {/* Timeline */}

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body">

          <h4 className="fw-bold mb-4">
            Impact Timeline
          </h4>

          <div className="timeline">

            {(report?.timeline || []).map(
              (item, index) => (
                <div
                  key={index}
                  className="border-start border-3 ps-4 mb-4"
                >
                  <h6 className="fw-bold">
                    {item.month}
                  </h6>

                  <p className="text-muted mb-0">
                    {item.activity}
                  </p>
                </div>
              )
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default ImpactReportsPage;