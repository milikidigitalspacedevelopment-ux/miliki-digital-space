import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

function UserDropdown() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout?.();
    } catch (err) {
      // ignore
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="dropdown">

      <button
        className="btn btn-light dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        <FaUserCircle className="me-2" />
        Account
      </button>

      <ul className="dropdown-menu dropdown-menu-end">

        <li>
          <button
            className="dropdown-item"
            onClick={() => navigate("/student/profile")}
          >
            Profile
          </button>
        </li>

        <li>
          <button
            className="dropdown-item"
            onClick={() => navigate("/student/settings")}
          >
            Settings
          </button>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <button
            className="dropdown-item text-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>

      </ul>

    </div>
  );
}

export default UserDropdown;