import {
  FaHome,
  FaProjectDiagram,
  FaChartBar,
  FaUser
} from "react-icons/fa";

import DashboardLayoutShell from "./DashboardLayoutShell";

function PartnerLayout() {
  const links = [
    {
      label: "Dashboard",
      path: "/partner",
      icon: <FaHome />
    },
    {
      label: "Projects",
      path: "/partner/projects",
      icon: <FaProjectDiagram />
    },
    {
      label: "Reports",
      path: "/partner/reports",
      icon: <FaChartBar />
    },
    {
      label: "Profile",
      path: "/partner/profile",
      icon: <FaUser />
    }
  ];

  return (
    <DashboardLayoutShell
      title="Partner Dashboard"
      links={links}
    />
  );
}

export default PartnerLayout;