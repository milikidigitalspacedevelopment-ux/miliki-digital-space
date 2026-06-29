import {
  FaBook,
  FaCertificate,
  FaHome,
  FaUser
} from "react-icons/fa";

import DashboardLayoutShell from "./DashboardLayoutShell";

function StudentLayout() {

  const links = [
    {
      label: "Dashboard",
      path: "/student",
      icon: <FaHome />
    },
    {
      label: "My Courses",
      path: "/student/my-courses",
      icon: <FaBook />
    },
    {
      label: "Certificates",
      path: "/student/certificates",
      icon: <FaCertificate />
    },
    {
      label: "Profile",
      path: "/student/profile",
      icon: <FaUser />
    }
  ];

  return (
    <DashboardLayoutShell
      title="Student Dashboard"
      links={links}
    />
  );
}

export default StudentLayout;