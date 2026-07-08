import { Route } from "react-router-dom";

import VolunteerLayout from "../layouts/VolunteerLayout";

import DashboardPage from "../pages/volunteer/DashboardPage";
import EventsPage from "../pages/volunteer/EventsPage";
import TasksPage from "../pages/volunteer/TasksPage";

function VolunteerRoutes() {
  return (
    <>
      <Route path="/volunteer/dashboard" element={<VolunteerLayout />}>
        <Route index element={<DashboardPage />} />

        <Route
          path="events"
          element={<EventsPage />}
        />

        <Route
          path="tasks"
          element={<TasksPage />}
        />
      </Route>
    </>
  );
}

export default VolunteerRoutes;