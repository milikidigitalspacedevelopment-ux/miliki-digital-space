import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaUserShield,
  FaKey,
  FaFileAlt,
  FaChartPie,
  FaDatabase,
  FaCog
} from "react-icons/fa";

import DashboardLayoutShell from "./DashboardLayoutShell";

function SuperAdminLayout() {
  const links = [
    {
      label: "Dashboard",
      path: "/super-admin",
      icon: <FaHome />
    },
    {
      label: "Businesses",
      path: "/super-admin/businesses",
      icon: <FaBuilding />
    },
    {
      label: "Users",
      path: "/super-admin/users",
      icon: <FaUsers />
    },
    {
      label: "Roles",
      path: "/super-admin/roles",
      icon: <FaUserShield />
    },
    {
      label: "Permissions",
      path: "/super-admin/permissions",
      icon: <FaKey />
    },
    {
      label: "System Logs",
      path: "/super-admin/logs",
      icon: <FaFileAlt />
    },
    {
      label: "Analytics",
      path: "/super-admin/analytics",
      icon: <FaChartPie />
    },
    {
      label: "Backups",
      path: "/super-admin/backups",
      icon: <FaDatabase />
    },
    {
      label: "Settings",
      path: "/super-admin/settings",
      icon: <FaCog />
    }
  ];

  return (
    <DashboardLayoutShell
      title="Super Administrator Dashboard"
      links={links}
    />
  );
}

export default SuperAdminLayout;