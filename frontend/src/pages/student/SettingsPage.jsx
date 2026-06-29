import { useState } from "react";
import { Shield, Bell, Lock, User, Save } from "lucide-react";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="mb-5">
        <h2 className="fw-bold mb-2">Settings</h2>
        <p className="text-muted">Update your student account preferences and security settings.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-5">
            <div className="card-body">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`btn w-100 text-start rounded-4 mb-3 ${
                      activeTab === tab.id ? "btn-success" : "btn-light"
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

        <div className="col-lg-9">
          <div className="card border-0 shadow-sm rounded-5">
            <div className="card-body p-4">
              {activeTab === "account" && (
                <>
                  <h4 className="fw-bold mb-4">Account Preferences</h4>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label">Display Name</label>
                      <input className="form-control" defaultValue="Student User" />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input className="form-control" defaultValue="student@example.com" />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Bio</label>
                      <textarea className="form-control" rows={3} defaultValue="Learning every day." />
                    </div>

                    <div className="col-12">
                      <button className="btn btn-success rounded-pill d-inline-flex align-items-center">
                        <Save size={16} className="me-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "security" && (
                <>
                  <h4 className="fw-bold mb-4">Security</h4>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-control" />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-control" />
                    </div>

                    <div className="col-12">
                      <button className="btn btn-success rounded-pill d-inline-flex align-items-center">
                        <Lock size={16} className="me-2" />
                        Update Password
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "notifications" && (
                <>
                  <h4 className="fw-bold mb-4">Notification Settings</h4>
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          Email updates
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="appNotifications" defaultChecked />
                        <label className="form-check-label" htmlFor="appNotifications">
                          In-app notifications
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button className="btn btn-success rounded-pill d-inline-flex align-items-center">
                        <Bell size={16} className="me-2" />
                        Save Notification Preferences
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
