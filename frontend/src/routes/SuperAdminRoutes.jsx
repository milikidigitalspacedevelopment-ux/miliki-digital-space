import { Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import SuperAdminLayout from "../layouts/SuperAdminLayout";

import SuperAdminDashboardPage from "../pages/super-admin/DashboardPage";
import SuperAdminPlaceholderPage from "../pages/super-admin/PlaceholderPage";
import { ROLES } from "../constants/roles";

function SuperAdminRoutes() {
  return (
    <Route path="/super-admin" element={<ProtectedRoute />}>
      <Route element={<RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
        <Route element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboardPage />} />
          <Route
            path="businesses"
            element={
              <SuperAdminPlaceholderPage
                title="Businesses"
                description="Manage registered businesses, billing data, and account approvals."
              />
            }
          />
          <Route
            path="users"
            element={
              <SuperAdminPlaceholderPage
                title="Users"
                description="Manage platform users, review account statuses, and enforce access policies."
              />
            }
          />
          <Route
            path="roles"
            element={
              <SuperAdminPlaceholderPage
                title="Roles"
                description="Manage role assignments, role definitions, and access controls."
              />
            }
          />
          <Route
            path="permissions"
            element={
              <SuperAdminPlaceholderPage
                title="Permissions"
                description="Manage permission sets and map access rights to roles."
              />
            }
          />
          <Route
            path="logs"
            element={
              <SuperAdminPlaceholderPage
                title="System Logs"
                description="Review system activity logs, audit trails, and event history."
              />
            }
          />
          <Route
            path="analytics"
            element={
              <SuperAdminPlaceholderPage
                title="Analytics"
                description="Review platform analytics, metrics, and usage reports."
              />
            }
          />
          <Route
            path="backups"
            element={
              <SuperAdminPlaceholderPage
                title="Backups"
                description="Manage backup schedules and restore snapshots."
              />
            }
          />
          <Route
            path="settings"
            element={
              <SuperAdminPlaceholderPage
                title="Settings"
                description="Configure platform-wide settings for the super admin console."
              />
            }
          />
        </Route>
      </Route>
    </Route>
  );
}

export default SuperAdminRoutes;