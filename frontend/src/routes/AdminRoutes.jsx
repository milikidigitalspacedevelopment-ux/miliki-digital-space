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
import StoriesPage from "../pages/admin/StoriesPage";
import DonorsPage from "../pages/admin/DonorsPage";
import VolunteerAdminPage from "../pages/admin/VolunteerAdminPage";
import BlogEditorPage from "../pages/admin/BlogEditorPage";
import ReportsPage from "../pages/admin/ReportsPage";
import SettingsPage from "../pages/admin/SettingsPage";
import GalleryAdminPage from "../pages/admin/GalleryAdminPage";
import CommunicationsPage from "../pages/admin/CommunicationsPage";
import TestimonialsPage from "../pages/admin/TestimonialsPage";

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
        <Route path="blogs/new" element={<BlogEditorPage />} />
        <Route path="blogs/:id/edit" element={<BlogEditorPage />} />

        <Route path="events" element={<EventsPage />} />

        <Route path="donors" element={<DonorsPage />} />

        <Route path="campaigns" element={<CampaignsPage />} />

        <Route path="donations" element={<DonationsPage />} />

        <Route path="partners" element={<PartnersPage />} />

        <Route path="volunteers" element={<VolunteerAdminPage />} />

        <Route path="stories" element={<StoriesPage />} />
        <Route path="gallery" element={<GalleryAdminPage />} />
        <Route path="communications" element={<CommunicationsPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />

        <Route path="reports" element={<ReportsPage />} />

        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </>
  );
}

export default AdminRoutes;