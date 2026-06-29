import { Route } from "react-router-dom";

import StudentLayout from "../layouts/StudentLayout";

import DashboardPage from "../pages/student/DashboardPage";
import MyCoursesPage from "../pages/student/MyCoursesPage";
import LessonsPage from "../pages/student/LessonsPage";
import AssignmentsPage from "../pages/student/AssignmentsPage";
import CertificatesPage from "../pages/student/CertificatesPage";
import NotificationsPage from "../pages/student/NotificationsPage";
import ProfilePage from "../pages/student/ProfilePage";
import SettingsPage from "../pages/student/SettingsPage";

function StudentRoutes() {
  return (
    <>
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<DashboardPage />} />

        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="my-courses"
          element={<MyCoursesPage />}
        />

        <Route
          path="lessons"
          element={<LessonsPage />}
        />

        <Route
          path="assignments"
          element={<AssignmentsPage />}
        />

        <Route
          path="certificates"
          element={<CertificatesPage />}
        />

        <Route
          path="notifications"
          element={<NotificationsPage />}
        />

        <Route
          path="messages"
          element={<NotificationsPage />}
        />

        <Route
          path="profile"
          element={<ProfilePage />}
        />

        <Route
          path="settings"
          element={<SettingsPage />}
        />
      </Route>
    </>
  );
}

export default StudentRoutes;