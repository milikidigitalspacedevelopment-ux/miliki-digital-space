import { useEffect, useMemo, useState } from "react";
import {
  HeartHandshake,
  DollarSign,
  Target,
  Users,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react";
import campaignService from "../../services/campaignService";

function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal_amount: "",
    raised_amount: "",
    status: "active",
    start_date: "",
    end_date: "",
    image_url: "",
  });
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    loadCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return campaigns.filter((campaign) => (campaign.title || "").toLowerCase().includes(term));
  }, [campaigns, searchTerm]);

  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormData({
      title: "",
      description: "",
      goal_amount: "",
      raised_amount: "",
      status: "active",
      start_date: "",
      end_date: "",
      image_url: "",
    });
    setShowModal(true);
  };

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title || "",
      description: campaign.description || "",
      goal_amount: campaign.goal_amount ?? "",
      raised_amount: campaign.raised_amount ?? "",
      status: campaign.status || "active",
      start_date: campaign.start_date ? String(campaign.start_date).slice(0, 10) : "",
      end_date: campaign.end_date ? String(campaign.end_date).slice(0, 10) : "",
      image_url: campaign.image_url || campaign.image || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCampaign(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formData,
        goal_amount: Number(formData.goal_amount || 0),
        raised_amount: Number(formData.raised_amount || 0),
      };

      if (editingCampaign) {
        await campaignService.updateCampaign(editingCampaign.id, payload);
      } else {
        await campaignService.createCampaign(payload);
      }

      await loadCampaigns();
      closeModal();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (campaign) => {
    if (!window.confirm(`Delete ${campaign.title}?`)) return;

    try {
      await campaignService.deleteCampaign(campaign.id);
      await loadCampaigns();
    } catch (err) {
      console.error(err);
      setError("Unable to delete campaign.");
    }
  };

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

        <button className="btn btn-success rounded-pill px-4" onClick={openCreateModal}>
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

                        <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => openEditModal(campaign)}>
                          <Pencil size={15} />
                        </button>

                        <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(campaign)}>
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

      {showModal ? (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">{editingCampaign ? "Edit campaign" : "Create campaign"}</h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Title</label>
                      <input className="form-control" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows="4" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Goal amount</label>
                      <input type="number" className="form-control" value={formData.goal_amount} onChange={(event) => setFormData({ ...formData, goal_amount: event.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Raised amount</label>
                      <input type="number" className="form-control" value={formData.raised_amount} onChange={(event) => setFormData({ ...formData, raised_amount: event.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Image URL</label>
                      <input className="form-control" value={formData.image_url} onChange={(event) => setFormData({ ...formData, image_url: event.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Start date</label>
                      <input type="date" className="form-control" value={formData.start_date} onChange={(event) => setFormData({ ...formData, start_date: event.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End date</label>
                      <input type="date" className="form-control" value={formData.end_date} onChange={(event) => setFormData({ ...formData, end_date: event.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-success rounded-pill" disabled={saving}>
                    {saving ? "Saving..." : editingCampaign ? "Save changes" : "Create campaign"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}

export default CampaignsPage;