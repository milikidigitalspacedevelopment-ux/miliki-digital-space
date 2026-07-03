import { useEffect, useMemo, useState } from "react";
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
import campaignService from "../../services/campaignService";

function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const data = await campaignService.getCampaigns();
        setCampaigns(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load campaigns.");
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return campaigns.filter((campaign) => (campaign.title || "").toLowerCase().includes(term));
  }, [campaigns, searchTerm]);

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
                    {campaigns.length}
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
                    KSh {campaigns.reduce((sum, campaign) => sum + Number(campaign.raised_amount || campaign.raisedAmount || 0), 0).toLocaleString()}
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
                    {campaigns.filter((campaign) => (campaign.status || "").toLowerCase() === "active").length}
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
                    {campaigns.reduce((sum, campaign) => sum + Number(campaign.donorsCount || campaign.donors || 0), 0).toLocaleString()}
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

              {loading && (
                <tr>
                  <td colSpan="7" className="text-center py-4">Loading campaigns...</td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-danger">{error}</td>
                </tr>
              )}

              {!loading && !error && filteredCampaigns.map((campaign) => {
                const raised = Number(campaign.raised_amount || campaign.raisedAmount || 0);
                const goal = Number(campaign.goal_amount || campaign.goalAmount || 1);
                const percentage = (raised / goal) * 100;

                return (
                  <tr key={campaign.id}>

                    <td className="fw-semibold">
                      {campaign.title}
                    </td>

                    <td>
                      KSh {goal.toLocaleString()}
                    </td>

                    <td>
                      KSh {raised.toLocaleString()}
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
                      {campaign.donorsCount || campaign.donors || 0}
                    </td>

                    <td>

                      <span
                        className={`badge ${
                          (campaign.status || "").toLowerCase() === "active"
                            ? "bg-success"
                            : campaign.status === "Completed"
                            ? "bg-primary"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {campaign.status || "Draft"}
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