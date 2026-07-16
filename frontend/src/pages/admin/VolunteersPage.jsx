// src/pages/admin/VolunteersPage.jsx

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  CalendarDays,
  Award,
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import volunteerService from "../../services/volunteerService";

function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
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
          skills: skillsFilter || undefined,
          status: statusFilter || undefined,
          page,
          perPage,
        };

        const data = await volunteerService.listVolunteers(params);
        if (Array.isArray(data)) setVolunteers(data);
        else if (data && Array.isArray(data.items)) setVolunteers(data.items);
        else setVolunteers([]);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchTerm, skillsFilter, statusFilter, page, perPage]);

  const skills = useMemo(() => ["", ...Array.from(new Set(volunteers.map((v) => v.skills).filter(Boolean)))], [volunteers]);
  const statuses = useMemo(() => ["", ...Array.from(new Set(volunteers.map((v) => v.status).filter(Boolean)))], [volunteers]);

  const filteredVolunteers = useMemo(() => volunteers, [volunteers]);

  const handleView = (id) => window.open(`/admin/volunteers/${id}`, "_blank");
  const handleEdit = (id) => window.location.href = `/admin/volunteers/${id}/edit`;
  const handleDelete = async (id) => {
    if (!confirm("Delete volunteer?")) return;
    try {
      setLoading(true);
      await volunteerService.deleteVolunteer(id);
      setVolunteers((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete volunteer");
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
            Volunteers Management
          </h2>

          <p className="text-muted mb-0">
            Manage volunteers and community engagement activities.
          </p>
        </div>

        <button className="btn btn-success rounded-pill px-4">
          <Plus size={18} className="me-2" />
          Add Volunteer
        </button>

      </div>

      {/* Statistics */}

      <div className="row g-4 mb-5">

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 60, height: 60 }}>
                  <Users size={28} />
                </div>

                <div>
                  <small className="text-muted">Total Volunteers</small>

                  <h3 className="fw-bold mb-0">{volunteers.length}</h3>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 60, height: 60 }}>
                  <UserCheck size={28} />
                </div>

                <div>
                  <small className="text-muted">Active Volunteers</small>

                  <h3 className="fw-bold mb-0">{volunteers.filter(v => v.status === 'Active').length}</h3>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 60, height: 60 }}>
                  <CalendarDays size={28} />
                </div>

                <div>
                  <small className="text-muted">Events Supported</small>

                  <h3 className="fw-bold mb-0">{volunteers.reduce((s,v)=>s+(v.events||0),0)}</h3>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 60, height: 60 }}>
                  <Award size={28} />
                </div>

                <div>
                  <small className="text-muted">Top Volunteers</small>

                  <h3 className="fw-bold mb-0">{Math.min(10, volunteers.length)}</h3>
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

            <div className="col-lg-6">

              <div className="input-group">

                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search volunteers..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                />

              </div>

            </div>

            <div className="col-lg-3">
              <select className="form-select" value={skillsFilter} onChange={(e)=>{ setSkillsFilter(e.target.value); setPage(1); }}>
                {skills.map(s => <option key={s} value={s}>{s || 'All Skills'}</option>)}
              </select>
            </div>

            <div className="col-lg-3">
              <select className="form-select" value={statusFilter} onChange={(e)=>{ setStatusFilter(e.target.value); setPage(1); }}>
                {statuses.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
              </select>
            </div>

          </div>

        </div>

      </div>

      {/* Volunteers Grid */}

      <div className="row g-4">
        {(!loading ? filteredVolunteers : []).map((volunteer) => (
          <div key={volunteer.id} className="col-xl-3 col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm rounded-5 h-100 overflow-hidden">
              <div className="text-center py-4" style={{ background: "linear-gradient(135deg,#198754,#2e8b57)" }}>
                <div className="rounded-circle bg-white mx-auto d-flex align-items-center justify-content-center" style={{ width: 90, height: 90 }}>
                  <Users size={40} className="text-primary" />
                </div>
              </div>

              <div className="card-body">
                <h5 className="fw-bold">{volunteer.name}</h5>
                <p className="text-success fw-semibold">{volunteer.skills}</p>

                <div className="small text-muted mb-2"><Mail size={14} className="me-2" />{volunteer.email}</div>
                <div className="small text-muted mb-3"><Phone size={14} className="me-2" />{volunteer.phone}</div>

                <div className="mb-3">
                  <small className="text-muted">Events Participated</small>
                  <h6 className="fw-bold mb-0">{volunteer.events}</h6>
                </div>

                <span className={`badge ${volunteer.status === "Active" ? "bg-success" : volunteer.status === "Pending" ? "bg-warning text-dark" : "bg-secondary"}`}>{volunteer.status}</span>
              </div>

              <div className="card-footer border-0 bg-white pb-4">
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-outline-primary rounded-pill" onClick={() => handleView(volunteer.id)}><Eye size={16} /></button>
                  <button className="btn btn-outline-success rounded-pill" onClick={() => handleEdit(volunteer.id)}><Pencil size={16} /></button>
                  <button className="btn btn-outline-danger rounded-pill" onClick={() => handleDelete(volunteer.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredVolunteers.length === 0 && (
        <div className="text-center py-5 text-muted">No volunteers found.</div>
      )}

    </div>
  );
}

export default VolunteersPage;