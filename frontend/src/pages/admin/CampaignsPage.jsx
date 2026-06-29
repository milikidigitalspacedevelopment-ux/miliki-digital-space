import { useState } from "react";
import {
  HeartHandshake,
  DollarSign,
  Target,
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const campaigns = [
    {
      id: 1,
      title: "Empower 1,000 Women",
      goal: 500000,
      raised: 365000,
      donors: 248,
      status: "Active",
    },
    {
      id: 2,
      title: "Youth Digital Skills Initiative",
      goal: 300000,
      raised: 300000,
      donors: 192,
      status: "Completed",
    },
    {
      id: 3,
      title: "Community Innovation Hub",
      goal: 800000,
      raised: 220000,
      donors: 94,
      status: "Active",
    },
    {
      id: 4,
      title: "Scholarship Program",
      goal: 450000,
      raised: 0,
      donors: 0,
      status: "Draft",
    },
  ];

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Campaign Management
          </h2>

          <p className="text-muted mb-0">
            Manage fundraising campaigns and monitor donations.
          </p>
        </div>

        <button className="btn btn-success rounded-pill px-4">
          <Plus size={18} className="me-2" />
          Create Campaign
        </button>

      </div>

      {/* Statistics */}

      <div className="row g-4 mb-4">

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <HeartHandshake size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Total Campaigns
                  </small>

                  <h3 className="fw-bold mb-0">
                    24
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <DollarSign size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Funds Raised
                  </small>

                  <h3 className="fw-bold mb-0">
                    KSh 4.8M
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <Target size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Active Campaigns
                  </small>

                  <h3 className="fw-bold mb-0">
                    8
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="bg-info text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <Users size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Total Donors
                  </small>

                  <h3 className="fw-bold mb-0">
                    1,284
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">

          <div className="row g-3">

            <div className="col-lg-8">

              <div className="input-group">

                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="col-lg-4">

              <button className="btn btn-outline-secondary rounded-pill w-100">
                <Filter size={18} className="me-2" />
                Filters
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* Campaign Table */}

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body table-responsive">

          <table className="table align-middle">

            <thead>
              <tr>
                <th>Campaign</th>
                <th>Goal</th>
                <th>Raised</th>
                <th>Progress</th>
                <th>Donors</th>
                <th>Status</th>
                <th width="180">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredCampaigns.map((campaign) => {
                const percentage =
                  (campaign.raised / campaign.goal) * 100;

                return (
                  <tr key={campaign.id}>

                    <td className="fw-semibold">
                      {campaign.title}
                    </td>

                    <td>
                      KSh {campaign.goal.toLocaleString()}
                    </td>

                    <td>
                      KSh {campaign.raised.toLocaleString()}
                    </td>

                    <td style={{ minWidth: "170px" }}>

                      <div className="progress mb-1">

                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <small className="text-muted">
                        {percentage.toFixed(0)}%
                      </small>

                    </td>

                    <td>
                      {campaign.donors}
                    </td>

                    <td>

                      <span
                        className={`badge ${
                          campaign.status === "Active"
                            ? "bg-success"
                            : campaign.status === "Completed"
                            ? "bg-primary"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {campaign.status}
                      </span>

                    </td>

                    <td>

                      <div className="d-flex gap-2 flex-wrap">

                        <button className="btn btn-sm btn-outline-primary rounded-pill">
                          <Eye size={15} />
                        </button>

                        <button className="btn btn-sm btn-outline-success rounded-pill">
                          <Pencil size={15} />
                        </button>

                        <button className="btn btn-sm btn-outline-danger rounded-pill">
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-5 text-muted">
              No campaigns found.
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default CampaignsPage;