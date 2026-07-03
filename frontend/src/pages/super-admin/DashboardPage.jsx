import { useEffect, useState } from "react";
import { ShieldCheck, Users, BookOpen, HandCoins, ServerCog } from "lucide-react";
import analyticsService from "../../services/analyticsService";

function SuperAdminDashboardPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const payload = await analyticsService.getDashboardStats();
        setStats(Array.isArray(payload?.stats) ? payload.stats : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load system metrics.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summaryCards = [
    {
      title: "System Access",
      value: "Super Admin",
      icon: <ShieldCheck size={24} />,
      bg: "bg-primary",
    },
    {
      title: "Managed Users",
      value: stats.find((item) => item.title?.toLowerCase().includes("user"))?.value || "0",
      icon: <Users size={24} />,
      bg: "bg-success",
    },
    {
      title: "Learning Content",
      value: stats.find((item) => item.title?.toLowerCase().includes("course"))?.value || "0",
      icon: <BookOpen size={24} />,
      bg: "bg-warning",
    },
    {
      title: "Collections",
      value: stats.find((item) => item.title?.toLowerCase().includes("donat"))?.value || "KES 0",
      icon: <HandCoins size={24} />,
      bg: "bg-danger",
    },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Super Admin Dashboard</h2>
          <p className="text-muted mb-0">Manage the platform, users, and system operations from one place.</p>
        </div>
        <div className="badge bg-dark px-3 py-2">
          <ServerCog size={16} className="me-2" />
          System Control
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        {summaryCards.map((card, index) => (
          <div className="col-xl-3 col-md-6" key={index}>
            <div className="card border-0 shadow-sm rounded-5 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">{card.title}</small>
                    <h3 className="fw-bold mt-2">{loading ? "—" : card.value}</h3>
                  </div>
                  <div className={`${card.bg} text-white rounded-circle d-flex align-items-center justify-content-center`} style={{ width: 56, height: 56 }}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Platform Overview</h5>
          <p className="text-muted mb-0">
            This dashboard is now connected to the backend analytics endpoint so your system metrics come from live data instead of static placeholders.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboardPage;
