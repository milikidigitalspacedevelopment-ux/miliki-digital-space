import { Route } from "react-router-dom";

import PartnerLayout from "../layouts/PartnerLayout";

import DashboardPage from "../pages/partner/DashboardPage";
import ProjectsPage from "../pages/partner/ProjectsPage";
import ReportsPage from "../pages/partner/ReportsPage";

function PartnerRoutes() {
  return (
    <>
      <Route path="/partner" element={<PartnerLayout />}>
        <Route index element={<DashboardPage />} />

        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="projects"
          element={<ProjectsPage />}
        />

        <Route
          path="reports"
          element={<ReportsPage />}
        />
      </Route>
    </>
  );
}

export default PartnerRoutes;