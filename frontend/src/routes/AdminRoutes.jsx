import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import DashboardPage from "../pages/admin/DashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import CoursesPage from "../pages/admin/CoursesPage";
import ProgramsPage from "../pages/admin/ProgramsPage";
import BlogsPage from "../pages/admin/BlogsPage";
import EventsPage from "../pages/admin/EventsPage";
import CampaignsPage from "../pages/admin/CampaignsPage";
import DonationsPage from "../pages/admin/DonationsPage";
import PartnersPage from "../pages/admin/PartnersPage";
import VolunteersPage from "../pages/admin/VolunteersPage";
import StoriesPage from "../pages/admin/StoriesPage";
import ReportsPage from "../pages/admin/ReportsPage";
import SettingsPage from "../pages/admin/SettingsPage";

function AdminRoutes() {
  return (
    <>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />

        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="users" element={<UsersPage />} />

        <Route path="courses" element={<CoursesPage />} />

        <Route path="programs" element={<ProgramsPage />} />

        <Route path="blogs" element={<BlogsPage />} />

        <Route path="events" element={<EventsPage />} />

        <Route path="campaigns" element={<CampaignsPage />} />

        <Route path="donations" element={<DonationsPage />} />

        <Route path="partners" element={<PartnersPage />} />

        <Route path="volunteers" element={<VolunteersPage />} />

        <Route path="stories" element={<StoriesPage />} />

        <Route path="reports" element={<ReportsPage />} />

        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </>
  );
}

export default AdminRoutes;