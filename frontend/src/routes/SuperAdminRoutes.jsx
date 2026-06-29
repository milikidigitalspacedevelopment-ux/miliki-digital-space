import { Route } from "react-router-dom";

import SuperAdminLayout from "../layouts/SuperAdminLayout";

import DashboardPage from "../pages/admin/DashboardPage";

function SuperAdminRoutes() {
  return (
    <Route element={<SuperAdminLayout />}>

      <Route index element={<DashboardPage />} />

    </Route>
  );
}

export default SuperAdminRoutes;