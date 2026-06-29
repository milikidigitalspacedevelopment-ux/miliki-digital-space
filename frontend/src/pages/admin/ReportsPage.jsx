// src/pages/admin/ReportsPage.jsx

import {
  DollarSign,
  Users,
  GraduationCap,
  Handshake,
  Download,
  Calendar,
} from "lucide-react";

import ChartCard from "../../components/charts/ChartCard";
import AreaChartComponent from "../../components/charts/AreaChartComponent";
import BarChartComponent from "../../components/charts/BarChartComponent";
import PieChartComponent from "../../components/charts/PieChartComponent";
import DonutChartComponent from "../../components/charts/DonutChartComponent";
import LineChartComponent from "../../components/charts/LineChartComponent";
import RadialChartComponent from "../../components/charts/RadialChartComponent";

function ReportsPage() {
  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-2">
            Reports & Analytics
          </h2>

          <p className="text-muted mb-0">
            Monitor donations, programs, courses, volunteers and platform
            growth.
          </p>
        </div>

        <div className="d-flex gap-3">

          <button className="btn btn-outline-secondary rounded-pill">
            <Calendar size={18} className="me-2" />
            This Year
          </button>

          <button className="btn btn-success rounded-pill">
            <Download size={18} className="me-2" />
            Export Report
          </button>

        </div>
      </div>

      {/* KPI Cards */}

      <div className="row g-4 mb-5">

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: 65,
                    height: 65,
                  }}
                >
                  <DollarSign size={30} />
                </div>

                <div>

                  <small className="text-muted">
                    Total Donations
                  </small>

                  <h3 className="fw-bold mb-0">
                    KSh 12.8M
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

                <div
                  className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: 65,
                    height: 65,
                  }}
                >
                  <Users size={30} />
                </div>

                <div>

                  <small className="text-muted">
                    Beneficiaries
                  </small>

                  <h3 className="fw-bold mb-0">
                    5,820
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

                <div
                  className="rounded-circle bg-warning text-white d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: 65,
                    height: 65,
                  }}
                >
                  <GraduationCap size={30} />
                </div>

                <div>

                  <small className="text-muted">
                    Courses Completed
                  </small>

                  <h3 className="fw-bold mb-0">
                    1,248
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

                <div
                  className="rounded-circle bg-info text-white d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: 65,
                    height: 65,
                  }}
                >
                  <Handshake size={30} />
                </div>

                <div>

                  <small className="text-muted">
                    Partners
                  </small>

                  <h3 className="fw-bold mb-0">
                    42
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Charts Row 1 */}

      <div className="row g-4 mb-4">

        <div className="col-lg-8">

          <ChartCard title="Donation Trends">
            <AreaChartComponent />
          </ChartCard>

        </div>

        <div className="col-lg-4">

          <ChartCard title="Funding Sources">
            <DonutChartComponent />
          </ChartCard>

        </div>

      </div>

      {/* Charts Row 2 */}

      <div className="row g-4 mb-4">

        <div className="col-lg-6">

          <ChartCard title="Monthly Registrations">
            <BarChartComponent />
          </ChartCard>

        </div>

        <div className="col-lg-6">

          <ChartCard title="Course Completion">
            <LineChartComponent />
          </ChartCard>

        </div>

      </div>

      {/* Charts Row 3 */}

      <div className="row g-4 mb-4">

        <div className="col-lg-6">

          <ChartCard title="Program Distribution">
            <PieChartComponent />
          </ChartCard>

        </div>

        <div className="col-lg-6">

          <ChartCard title="Annual Performance">
            <RadialChartComponent />
          </ChartCard>

        </div>

      </div>

      {/* Bottom Report Table */}

      <div className="card border-0 shadow-sm rounded-5">

        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Summary Report
          </h5>

          <div className="table-responsive">

            <table className="table align-middle">

              <thead>

                <tr>
                  <th>Category</th>
                  <th>Total</th>
                  <th>Growth</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>Donations</td>
                  <td>KSh 12.8M</td>
                  <td className="text-success">
                    +18%
                  </td>
                  <td>
                    <span className="badge bg-success">
                      Excellent
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Courses</td>
                  <td>1,248</td>
                  <td className="text-success">
                    +12%
                  </td>
                  <td>
                    <span className="badge bg-primary">
                      Good
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Volunteers</td>
                  <td>286</td>
                  <td className="text-success">
                    +9%
                  </td>
                  <td>
                    <span className="badge bg-info">
                      Stable
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Partners</td>
                  <td>42</td>
                  <td className="text-warning">
                    +3%
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      Moderate
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ReportsPage;