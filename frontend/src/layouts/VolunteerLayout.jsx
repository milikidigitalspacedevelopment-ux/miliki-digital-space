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
      path: "/volunteer",
      icon: <FaHome />
    },
    {
      label: "Activities",
      path: "/volunteer/activities",
      icon: <FaTasks />
    },
    {
      label: "Events",
      path: "/volunteer/events",
      icon: <FaCalendarAlt />
    },
    {
      label: "Volunteer Hours",
      path: "/volunteer/hours",
      icon: <FaClock />
    },
    {
      label: "Certificates",
      path: "/volunteer/certificates",
      icon: <FaCertificate />
    },
    {
      label: "Profile",
      path: "/volunteer/profile",
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