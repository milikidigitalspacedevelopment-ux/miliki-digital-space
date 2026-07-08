import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaClock,
  FaCertificate,
  FaUser
} from "react-icons/fa";

import DashboardLayoutShell from "./DashboardLayoutShell";

function VolunteerLayout() {
  const links = [
    {
      label: "Dashboard",
      path: "/volunteer/dashboard",
      icon: <FaHome />
    },
    {
      label: "Tasks",
      path: "/volunteer/dashboard/tasks",
      icon: <FaTasks />
    },
    {
      label: "Events",
      path: "/volunteer/dashboard/events",
      icon: <FaCalendarAlt />
    },
    {
      label: "Volunteer Hours",
      path: "/volunteer/dashboard",
      icon: <FaClock />
    },
    {
      label: "Certificates",
      path: "/volunteer/dashboard",
      icon: <FaCertificate />
    },
    {
      label: "Profile",
      path: "/volunteer/dashboard",
      icon: <FaUser />
    }
  ];

  return (
    <DashboardLayoutShell
      title="Volunteer Dashboard"
      links={links}
    />
  );
}

export default VolunteerLayout;