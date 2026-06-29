import { useEffect, useState } from "react";
import {
  Heart,
  DollarSign,
  FolderKanban,
  TrendingUp,
} from "lucide-react";

import donationService from "../../services/donationService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import ChartCard from "../../components/charts/ChartCard";
import AreaChartComponent from "../../components/charts/AreaChartComponent";
import PieChartComponent from "../../components/charts/PieChartComponent";

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
        await donationService.getDashboard?.();

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
          Donor Dashboard
        </h2>

        <p className="text-muted">
          Track your giving and impact.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="row g-4 mb-5">
        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">

              <Heart
                size={42}
                className="text-danger mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.totalDonations || 0}
              </h3>

              <p className="text-muted mb-0">
                Total Donations
              </p>

            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">

              <DollarSign
                size={42}
                className="text-success mb-3"
              />

              <h3 className="fw-bold">
                KES{" "}
                {(dashboard?.totalAmount || 0).toLocaleString()}
              </h3>

              <p className="text-muted mb-0">
                Lifetime Giving
              </p>

            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">

              <FolderKanban
                size={42}
                className="text-primary mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.supportedProjects || 0}
              </h3>

              <p className="text-muted mb-0">
                Projects Supported
              </p>

            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body text-center">

              <TrendingUp
                size={42}
                className="text-warning mb-3"
              />

              <h3 className="fw-bold">
                {dashboard?.impactScore || 0}%
              </h3>

              <p className="text-muted mb-0">
                Impact Score
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Charts */}

      <div className="row g-4 mb-5">

        <div className="col-lg-8">
          <ChartCard title="Monthly Donations">

            <AreaChartComponent
              data={dashboard?.monthlyDonations || []}
              xKey="month"
              dataKey="amount"
            />

          </ChartCard>
        </div>

        <div className="col-lg-4">
          <ChartCard title="Donation Categories">

            <PieChartComponent
              data={dashboard?.donationCategories || []}
            />

          </ChartCard>
        </div>

      </div>

      {/* Recent Donations */}

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Recent Donations
          </h5>

          <div className="table-responsive">
            <table className="table align-middle">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {(dashboard?.recentDonations || []).map(
                  (donation) => (
                    <tr key={donation.id}>
                      <td>{donation.date}</td>

                      <td>{donation.campaign}</td>

                      <td>
                        KES{" "}
                        {donation.amount.toLocaleString()}
                      </td>

                      <td>
                        <span className="badge bg-success">
                          {donation.status}
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