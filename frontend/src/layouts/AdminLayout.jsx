import {
  FaHome,
  FaUsers,
  FaGraduationCap,
  FaBookOpen,
  FaNewspaper,
  FaCalendarAlt,
  FaHandsHelping,
  FaDonate,
  FaBullhorn,
  FaChartLine,
  FaCog
} from "react-icons/fa";

import DashboardLayoutShell from "./DashboardLayoutShell";

function AdminLayout() {
  const links = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <FaHome />
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: <FaUsers />
    },
    {
      label: "Programs",
      path: "/admin/programs",
      icon: <FaGraduationCap />
    },
    {
      label: "Courses",
      path: "/admin/courses",
      icon: <FaBookOpen />
    },
    {
      label: "Blogs",
      path: "/admin/blogs",
      icon: <FaNewspaper />
    },
    {
      label: "Events",
      path: "/admin/events",
      icon: <FaCalendarAlt />
    },
    {
      label: "Volunteers",
      path: "/admin/volunteers",
      icon: <FaHandsHelping />
    },
    {
      label: "Donations",
      path: "/admin/donations",
      icon: <FaDonate />
    },
    {
      label: "Campaigns",
      path: "/admin/campaigns",
      icon: <FaBullhorn />
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: <FaChartLine />
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: <FaCog />
    }
  ];

  return (
    <DashboardLayoutShell
      title="Administrator Dashboard"
      links={links}
    />
  );
}

export default AdminLayout;