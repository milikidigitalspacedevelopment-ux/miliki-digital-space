import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  DollarSign,
  CreditCard,
  Smartphone,
  Search,
  Download,
  Eye,
} from "lucide-react";
import donationService from "../../services/donationService";

function DonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          q: searchTerm || undefined,
          method: methodFilter || undefined,
          status: statusFilter || undefined,
          page,
          perPage,
        };

        const data = await donationService.listDonations(params);
        // Expecting { items: [], total }
        if (data && Array.isArray(data.items)) {
          setDonations(data.items);
        } else if (Array.isArray(data)) {
          setDonations(data);
        } else {
          setDonations([]);
        }
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchTerm, methodFilter, statusFilter, page, perPage]);

  const methods = useMemo(() => {
    return ["", ...Array.from(new Set(donations.map((d) => d.method).filter(Boolean)))];
  }, [donations]);

  const statuses = useMemo(() => {
    return ["", ...Array.from(new Set(donations.map((d) => d.status).filter(Boolean)))];
  }, [donations]);

  const handleView = async (id) => {
    try {
      setLoading(true);
      const receipt = await donationService.getReceipt(id);
      // If backend returns a URL, open it. If blob, create object URL.
      if (receipt && typeof receipt === "string") {
        window.open(receipt, "_blank");
      } else if (receipt instanceof Blob) {
        const url = URL.createObjectURL(receipt);
        window.open(url, "_blank");
      } else if (receipt && receipt.data) {
        // maybe axios response wrapper
        const blob = new Blob([receipt.data]);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        alert("Receipt not available");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch receipt");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const params = { method: methodFilter || undefined, status: statusFilter || undefined, q: searchTerm || undefined };
      const blob = await donationService.exportDonations(params);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donations_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export donations");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations;

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Donations Management
          </h2>

          <p className="text-muted mb-0">
            Track donations and financial transactions.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-pill" onClick={handleExport} disabled={loading}>
            <Download size={18} className="me-2" />
            Export Report
          </button>

          <button className="btn btn-success rounded-pill px-4" onClick={() => window.location.href = '/admin/donations/create'}>
            <Download size={18} className="me-2" />
            New Donation
          </button>
        </div>

      </div>

      {/* Statistics */}

      <div className="row g-4 mb-4">

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <DollarSign size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Total Donations
                  </small>

                  <h3 className="fw-bold mb-0">KSh { (donations.reduce((s,d)=>s+(d.amount||0),0)).toLocaleString() }</h3>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <Wallet size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Monthly Revenue
                  </small>

                  <h3 className="fw-bold mb-0">KSh { (donations.filter(d=>{ const dt=new Date(d.date); const now=new Date(); return (now - dt) <= 1000*60*60*24*30; }).reduce((s,d)=>s+(d.amount||0),0)).toLocaleString() }</h3>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <Smartphone size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    M-Pesa Payments
                  </small>

                  <h3 className="fw-bold mb-0">{(() => { const total=donations.reduce((s,d)=>s+(d.amount||0),0); if(!total) return '0%'; const mpesa=donations.filter(d=>d.method==='M-Pesa').reduce((s,d)=>s+(d.amount||0),0); return Math.round((mpesa/total)*100)+'%'; })()}</h3>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <CreditCard size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Card Payments
                  </small>

                  <h3 className="fw-bold mb-0">{(() => { const total=donations.reduce((s,d)=>s+(d.amount||0),0); if(!total) return '0%'; const card=donations.filter(d=>d.method==='Card').reduce((s,d)=>s+(d.amount||0),0); return Math.round((card/total)*100)+'%'; })()}</h3>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Search */}

      <div className="card border-0 shadow rounded-5 mb-4">

        <div className="card-body">

          <div className="row g-2">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><Search size={18} /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search donor or transaction..." value={searchTerm} onChange={(e)=>{ setSearchTerm(e.target.value); setPage(1); }} />
              </div>
            </div>

            <div className="col-md-3">
              <select className="form-select" value={methodFilter} onChange={(e)=>{ setMethodFilter(e.target.value); setPage(1); }}>
                {methods.map(m => <option key={m} value={m}>{m || 'All Methods'}</option>)}
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

      {/* Table */}

      <div className="card border-0 shadow rounded-5">

        <div className="card-body table-responsive">

          <table className="table align-middle">

            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Donor</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {(!loading ? filteredDonations : []).map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.id}</td>
                  <td className="fw-semibold">{donation.donor}</td>
                  <td>KSh {Number(donation.amount || 0).toLocaleString()}</td>
                  <td>{donation.method}</td>
                  <td>{donation.date}</td>
                  <td>
                    <span
                      className={`badge ${
                        donation.status === "Completed"
                          ? "bg-success"
                          : donation.status === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => handleView(donation.id)}>
                      <Eye size={15} className="me-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {!loading && filteredDonations.length === 0 && (
            <div className="text-center py-5 text-muted">No transactions found.</div>
          )}

        </div>

        <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">Showing {Math.min((page - 1) * perPage + 1, filteredDonations.length)} - {Math.min(page * perPage, filteredDonations.length)} of {filteredDonations.length}</small>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <select className="form-select form-select-sm" style={{ width: 80 }} value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <div className="btn-group">
              <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
              <button className="btn btn-sm btn-outline-secondary" disabled={(page * perPage) >= filteredDonations.length} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default DonationsPage;