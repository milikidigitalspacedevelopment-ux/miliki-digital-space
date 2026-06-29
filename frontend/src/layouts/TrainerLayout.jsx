import {
  FaBook,
  FaClipboardList,
  FaHome,
  FaUsers
} from "react-icons/fa";

import DashboardLayoutShell from "./DashboardLayoutShell";

function TrainerLayout() {

  const links = [
    {
      label: "Dashboard",
      path: "/trainer",
      icon: <FaHome />
    },
    {
      label: "Courses",
      path: "/trainer/courses",
      icon: <FaBook />
    },
    {
      label: "Students",
      path: "/trainer/students",
      icon: <FaUsers />
    },
    {
      label: "Assignments",
      path: "/trainer/assignments",
      icon: <FaClipboardList />
    }
  ];

  return (
    <DashboardLayoutShell
      title="Trainer Dashboard"
      links={links}
    />
  );
}

export default TrainerLayout;