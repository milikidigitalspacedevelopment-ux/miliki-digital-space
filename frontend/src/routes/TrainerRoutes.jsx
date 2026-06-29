import { Route } from "react-router-dom";

import TrainerLayout from "../layouts/TrainerLayout";

import DashboardPage from "../pages/trainer/DashboardPage";
import CoursesPage from "../pages/trainer/CoursesPage";
import StudentsPage from "../pages/trainer/StudentsPage";
import AssignmentsPage from "../pages/trainer/AssignmentsPage";
import ReportsPage from "../pages/trainer/ReportsPage";

function TrainerRoutes() {
  return (
    <>
      <Route path="/trainer" element={<TrainerLayout />}>
        <Route index element={<DashboardPage />} />

        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="courses"
          element={<CoursesPage />}
        />

        <Route
          path="students"
          element={<StudentsPage />}
        />

        <Route
          path="assignments"
          element={<AssignmentsPage />}
        />

        <Route
          path="reports"
          element={<ReportsPage />}
        />
      </Route>
    </>
  );
}

export default TrainerRoutes;