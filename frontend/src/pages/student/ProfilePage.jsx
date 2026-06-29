import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Lock,
  Shield,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

import userService from "../../services/userService";
import uploadService from "../../services/uploadService";
import authService from "../../services/authService";

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response =
        await userService.getProfile?.();

      setProfile(response);
    } catch (err) {
      setError("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const uploadedImage =
        await uploadService.uploadFile?.(file);

      setProfile((prev) => ({
        ...prev,
        avatar: uploadedImage,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      await userService.updateProfile?.(profile);

      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    try {
      if (
        passwords.newPassword !==
        passwords.confirmPassword
      ) {
        alert("Passwords do not match.");
        return;
      }

      await authService.changePassword?.({
        currentPassword:
          passwords.currentPassword,
        newPassword:
          passwords.newPassword,
      });

      alert("Password changed successfully.");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Profile Error"
        message={error}
        onRetry={fetchProfile}
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      <div className="mb-5">

        <h2 className="fw-bold mb-2">
          My Profile
        </h2>

        <p className="text-muted">
          Manage your account information and security.
        </p>

      </div>

      <div className="row g-4">

        {/* Profile Card */}

        <div className="col-lg-4">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body text-center">

              <div className="position-relative d-inline-block">

                <img
                  src={
                    profile.avatar ||
                    "https://via.placeholder.com/150"
                  }
                  alt="avatar"
                  className="rounded-circle border"
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                  }}
                />

                <label
                  className="btn btn-primary rounded-circle position-absolute"
                  style={{
                    right: 0,
                    bottom: 0,
                  }}
                >
                  <Camera size={16} />

                  <input
                    type="file"
                    hidden
                    onChange={handleAvatarUpload}
                  />
                </label>

              </div>

              <h4 className="fw-bold mt-4">

                {profile.fullName}

              </h4>

              <p className="text-muted">

                Student

              </p>

            </div>

          </div>

        </div>

        {/* Profile Details */}

        <div className="col-lg-8">

          <div className="card border-0 shadow-sm rounded-5 mb-4">

            <div className="card-body">

              <h5 className="fw-bold mb-4">
                Personal Information
              </h5>

              <div className="row g-4">

                <div className="col-md-6">

                  <label className="form-label">
                    Full Name
                  </label>

                  <div className="input-group">

                    <span className="input-group-text">
                      <User size={18} />
                    </span>

                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      value={profile.fullName}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="col-md-6">

                  <label className="form-label">
                    Email
                  </label>

                  <div className="input-group">

                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={profile.email}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="col-md-6">

                  <label className="form-label">
                    Phone
                  </label>

                  <div className="input-group">

                    <span className="input-group-text">
                      <Phone size={18} />
                    </span>

                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={profile.phone}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="col-12">

                  <label className="form-label">
                    About Me
                  </label>

                  <textarea
                    rows="5"
                    className="form-control"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <button
                className="btn btn-success rounded-pill mt-4"
                onClick={saveProfile}
                disabled={saving}
              >
                <Save size={18} className="me-2" />

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>

            </div>

          </div>

          {/* Password Card */}

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body">

              <div className="d-flex align-items-center mb-4">

                <Shield
                  size={22}
                  className="text-primary me-2"
                />

                <h5 className="fw-bold mb-0">
                  Security Settings
                </h5>

              </div>

              <div className="row g-4">

                <div className="col-md-4">

                  <label className="form-label">
                    Current Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                  />

                </div>

                <div className="col-md-4">

                  <label className="form-label">
                    New Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                  />

                </div>

                <div className="col-md-4">

                  <label className="form-label">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                  />

                </div>

              </div>

              <button
                className="btn btn-primary rounded-pill mt-4"
                onClick={changePassword}
              >
                <Lock size={18} className="me-2" />
                Change Password
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProfilePage;