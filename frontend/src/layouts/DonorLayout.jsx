import {
  FaDonate,
  FaFileInvoiceDollar,
  FaHome,
  FaChartLine
} from "react-icons/fa";

import DashboardLayoutShell from "./DashboardLayoutShell";

function DonorLayout() {

  const links = [
    {
      label: "Dashboard",
      path: "/donor",
      icon: <FaHome />
    },
    {
      label: "My Donations",
      path: "/donor/donations",
      icon: <FaDonate />
    },
    {
      label: "Receipts",
      path: "/donor/receipts",
      icon: <FaFileInvoiceDollar />
    },
    {
      label: "Impact Reports",
      path: "/donor/reports",
      icon: <FaChartLine />
    }
  ];

  return (
    <DashboardLayoutShell
      title="Donor Dashboard"
      links={links}
    />
  );
}

export default DonorLayout;