// src/pages/admin/UsersPage.jsx

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Users,
  Filter,
} from "lucide-react";
import api from "../../services/api";

const normalizeUsers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
};

function UsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users");
        const payload = response?.data?.data ?? response?.data?.users ?? response?.data;
        setUsers(normalizeUsers(payload));
      } catch (err) {
        console.error(err);
        setError("Unable to load users right now.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((user) => {
      const name = (user.name || user.full_name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }, [users, search]);

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            Users Management
          </h2>

          <p className="text-muted mb-0">
            Manage all users and permissions.
          </p>
        </div>

        <button className="btn btn-success rounded-pill px-4">
          <Plus size={18} className="me-2" />
          Add User
        </button>

      </div>

      {/* Statistics */}
      <div className="row g-4 mb-4">

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">

                <div
                  className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: 55,
                    height: 55,
                  }}
                >
                  <Users size={24} />
                </div>

                <div>
                  <small className="text-muted">
                    Total Users
                  </small>

                  <h3 className="fw-bold mb-0">
                    {users.length}
                  </h3>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Search + Filter */}
      <div className="card border-0 shadow-sm rounded-5 mb-4">

        <div className="card-body">

          <div className="row g-3">

            <div className="col-lg-8">
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder="Search users..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
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

      {/* Users Table */}
      <div className="card border-0 shadow-sm rounded-5">

        <div className="card-body table-responsive">

          <table className="table align-middle">

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th width="220">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan="5" className="text-center py-4">Loading users...</td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-danger">{error}</td>
                </tr>
              )}

              {!loading && !error && filteredUsers.map((user) => (
                <tr key={user.id}>

                  <td className="fw-semibold">
                    {user.name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    <span className="badge bg-primary">
                      {user.role || "User"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        (user.is_active ?? user.status === "Active")
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {(user.is_active ?? user.status === "Active") ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>

                    <div className="d-flex flex-wrap gap-2">

                      <button className="btn btn-sm btn-outline-primary rounded-pill">
                        Edit
                      </button>

                      <button className="btn btn-sm btn-outline-warning rounded-pill">
                        Disable
                      </button>

                      <button className="btn btn-sm btn-outline-danger rounded-pill">
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default UsersPage;