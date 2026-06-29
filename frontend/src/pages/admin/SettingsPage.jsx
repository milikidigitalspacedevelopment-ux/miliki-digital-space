// src/pages/admin/SettingsPage.jsx

import { useState } from "react";
import {
  Building2,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Mail,
  Lock,
  Save,
  Upload,
  Database,
  Smartphone,
} from "lucide-react";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    {
      id: "general",
      label: "General",
      icon: Building2,
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
    },
    {
      id: "backup",
      label: "Backup",
      icon: Database,
    },
  ];

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="mb-5">

        <h2 className="fw-bold mb-2">
          System Settings
        </h2>

        <p className="text-muted mb-0">
          Manage organization information, payments, security and platform
          preferences.
        </p>

      </div>

      <div className="row g-4">

        {/* Sidebar */}

        <div className="col-lg-3">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body">

              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    className={`btn w-100 text-start rounded-4 mb-3 ${
                      activeTab === tab.id
                        ? "btn-success"
                        : "btn-light"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={18} className="me-2" />
                    {tab.label}
                  </button>
                );
              })}

            </div>

          </div>

        </div>

        {/* Content */}

        <div className="col-lg-9">

          {/* GENERAL */}

          {activeTab === "general" && (

            <div className="card border-0 shadow-sm rounded-5">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Organization Information
                </h4>

                <div className="row g-4">

                  <div className="col-md-6">

                    <label className="form-label">
                      Organization Name
                    </label>

                    <input
                      className="form-control"
                      defaultValue="Miliki Foundation"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Website
                    </label>

                    <input
                      className="form-control"
                      defaultValue="www.miliki.org"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Email
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        <Mail size={16} />
                      </span>

                      <input
                        className="form-control"
                        defaultValue="info@miliki.org"
                      />

                    </div>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Phone Number
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        <Smartphone size={16} />
                      </span>

                      <input
                        className="form-control"
                        defaultValue="+254700000000"
                      />

                    </div>

                  </div>

                  <div className="col-12">

                    <label className="form-label">
                      Address
                    </label>

                    <textarea
                      rows="3"
                      className="form-control"
                      defaultValue="Nairobi, Kenya"
                    />

                  </div>

                  <div className="col-12">

                    <button className="btn btn-outline-success rounded-pill">
                      <Upload size={18} className="me-2" />
                      Upload Logo
                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* PAYMENTS */}

          {activeTab === "payments" && (

            <div className="card border-0 shadow-sm rounded-5">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Payment Configuration
                </h4>

                <div className="row g-4">

                  <div className="col-md-6">

                    <label className="form-label">
                      M-Pesa Paybill / Till
                    </label>

                    <input
                      className="form-control"
                      defaultValue="9233964"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Stripe Public Key
                    </label>

                    <input className="form-control" />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      PayPal Email
                    </label>

                    <input className="form-control" />

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* NOTIFICATIONS */}

          {activeTab === "notifications" && (

            <div className="card border-0 shadow-sm rounded-5">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Notification Preferences
                </h4>

                <div className="form-check form-switch mb-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked
                  />

                  <label className="form-check-label">
                    Email Notifications
                  </label>

                </div>

                <div className="form-check form-switch mb-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked
                  />

                  <label className="form-check-label">
                    Donation Alerts
                  </label>

                </div>

                <div className="form-check form-switch">

                  <input
                    className="form-check-input"
                    type="checkbox"
                  />

                  <label className="form-check-label">
                    Weekly Reports
                  </label>

                </div>

              </div>

            </div>

          )}

          {/* SECURITY */}

          {activeTab === "security" && (

            <div className="card border-0 shadow-sm rounded-5">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Security Settings
                </h4>

                <div className="row g-4">

                  <div className="col-md-6">

                    <label className="form-label">
                      Current Password
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        <Lock size={16} />
                      </span>

                      <input
                        type="password"
                        className="form-control"
                      />

                    </div>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      New Password
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        <Lock size={16} />
                      </span>

                      <input
                        type="password"
                        className="form-control"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* BACKUP */}

          {activeTab === "backup" && (

            <div className="card border-0 shadow-sm rounded-5">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Backup & Restore
                </h4>

                <div className="row g-4">

                  <div className="col-md-6">

                    <div className="border rounded-5 p-4 h-100">

                      <Database
                        size={40}
                        className="text-primary mb-3"
                      />

                      <h5 className="fw-bold">
                        Create Backup
                      </h5>

                      <p className="text-muted">
                        Generate a full database backup.
                      </p>

                      <button className="btn btn-primary rounded-pill">
                        Backup Now
                      </button>

                    </div>

                  </div>

                  <div className="col-md-6">

                    <div className="border rounded-5 p-4 h-100">

                      <Globe
                        size={40}
                        className="text-success mb-3"
                      />

                      <h5 className="fw-bold">
                        Restore System
                      </h5>

                      <p className="text-muted">
                        Restore from a previous backup.
                      </p>

                      <button className="btn btn-success rounded-pill">
                        Restore
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* Save Button */}

          <div className="mt-4">

            <button className="btn btn-success rounded-pill px-5">
              <Save size={18} className="me-2" />
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SettingsPage;