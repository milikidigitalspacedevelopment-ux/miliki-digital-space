import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Handshake,
  Globe,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import partnerService from "../../services/partnerService";

function PartnersPage() {
  const navigate = useNavigate();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          q: searchTerm || undefined,
          type: typeFilter || undefined,
          status: statusFilter || undefined,
          page,
          perPage,
        };

        const data = await partnerService.listPartners(params);
        // accept either array or { items, total }
        if (Array.isArray(data)) setPartners(data);
        else if (data && Array.isArray(data.items)) setPartners(data.items);
        else setPartners([]);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchTerm, typeFilter, statusFilter, page, perPage]);

  const types = useMemo(() => ["", ...Array.from(new Set(partners.map((p) => p.type).filter(Boolean)))], [partners]);
  const statuses = useMemo(() => ["", ...Array.from(new Set(partners.map((p) => p.status).filter(Boolean)))], [partners]);

  const filteredPartners = useMemo(() => partners, [partners]);

  const handleView = (id) => navigate(`/admin/partners/${id}`);
  const handleEdit = (id) => navigate(`/admin/partners/${id}/edit`);

  const handleDelete = async (id) => {
    if (!confirm("Delete partner?")) return;
    try {
      setLoading(true);
      await partnerService.deletePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete partner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Partners Management
          </h2>

          <p className="text-muted mb-0">
            Manage organizations and strategic partnerships.
          </p>
        </div>

        <button className="btn btn-success rounded-pill px-4">
          <Plus size={18} className="me-2" />
          Add Partner
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
                  <Building2 size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Total Partners
                  </small>

                  <h3 className="fw-bold mb-0">{partners.length}</h3>
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
                  <Handshake size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Active Partners
                  </small>

                  <h3 className="fw-bold mb-0">{partners.filter(p => p.status === 'Active').length}</h3>
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
                  <Globe size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    International
                  </small>

                  <h3 className="fw-bold mb-0">{partners.filter(p => (p.type || '').toLowerCase().includes('international')).length}</h3>
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
                  <Building2 size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Corporate Sponsors
                  </small>

                  <h3 className="fw-bold mb-0">{partners.filter(p => (p.type || '').toLowerCase().includes('corporate') || (p.type || '').toLowerCase().includes('sponsor')).length}</h3>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Search + Filters */}

      <div className="card border-0 shadow-sm rounded-5 mb-5">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><Search size={18} /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search partners..." value={searchTerm} onChange={(e)=>{ setSearchTerm(e.target.value); setPage(1); }} />
              </div>
            </div>

            <div className="col-md-3">
              <select className="form-select" value={typeFilter} onChange={(e)=>{ setTypeFilter(e.target.value); setPage(1); }}>
                {types.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
              </select>
            </div>

            <div className="col-md-3">
              <select className="form-select" value={statusFilter} onChange={(e)=>{ setStatusFilter(e.target.value); setPage(1); }}>
                {statuses.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>


      {/* Partners Grid */}

      <div className="row g-4">

        {(!loading ? filteredPartners : []).map((partner) => (
          <div key={partner.id} className="col-xl-3 col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm rounded-5 h-100 overflow-hidden">

              <div className="text-center py-4" style={{ background: "linear-gradient(135deg,#198754,#2e8b57)" }}>
                <img src={partner.logo_url || '/assets/placeholder-80.png'} alt={partner.name} className="rounded-circle bg-white p-2" width="90" height="90" />
              </div>

              <div className="card-body">
                <h5 className="fw-bold">{partner.name}</h5>
                <p className="text-muted small mb-3">{partner.website || "Strategic partner"}</p>

                <div className="mb-2"><strong>Contact:</strong><br />{partner.contact_email || "—"}</div>

                <div className="small text-muted mb-2"><Mail size={14} className="me-2" />{partner.contact_email || "—"}</div>

                <div className="small text-muted mb-3"><Phone size={14} className="me-2" />{partner.website || "—"}</div>

                <span className={`badge ${partner.status === "active" ? "bg-success" : partner.status === "pending" ? "bg-warning text-dark" : "bg-secondary"}`}>{partner.status || "active"}</span>
              </div>

              <div className="card-footer bg-white border-0 pb-4">
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-outline-primary rounded-pill" onClick={() => handleView(partner.id)}><Eye size={16} /></button>
                  <button className="btn btn-outline-success rounded-pill" onClick={() => handleEdit(partner.id)}><Pencil size={16} /></button>
                  <button className="btn btn-outline-danger rounded-pill" onClick={() => handleDelete(partner.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      {!loading && filteredPartners.length === 0 && (
        <div className="text-center py-5 text-muted">No partners found.</div>
      )}

    </div>
  );
}

export default PartnersPage;