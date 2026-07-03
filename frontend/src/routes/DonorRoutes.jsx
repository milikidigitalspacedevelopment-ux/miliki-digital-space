import { Route } from "react-router-dom";

import DonorLayout from "../layouts/DonorLayout";

import DashboardPage from "../pages/donor/DashboardPage";
import DonationsPage from "../pages/donor/DonationsPage";
import ImpactReportsPage from "../pages/donor/ImpactReportsPage";
import ReceiptsPage from "../pages/donor/ReceiptsPage";

function DonorRoutes() {
  return (
    <>
      <Route path="/donor" element={<DonorLayout />}>
        <Route index element={<DashboardPage />} />

        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="donations"
          element={<DonationsPage />}
        />

        <Route
          path="impact-reports"
          element={<ImpactReportsPage />}
        />

        <Route
          path="reports"
          element={<ImpactReportsPage />}
        />

        <Route
          path="receipts"
          element={<ReceiptsPage />}
        />
      </Route>
    </>
  );
}

export default DonorRoutes;