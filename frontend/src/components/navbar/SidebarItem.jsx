import { NavLink } from "react-router-dom";

function SidebarItem({ path, icon, label }) {
  return (
    <li className="nav-item mb-2">
      <NavLink
        to={path}
        className={({ isActive }) =>
          `nav-link rounded px-3 py-2 ${
            isActive
              ? "bg-success text-white"
              : "text-light"
          }`
        }
      >
        {icon}
        <span className="ms-2">
          {label}
        </span>
      </NavLink>
    </li>
  );
}

export default SidebarItem;