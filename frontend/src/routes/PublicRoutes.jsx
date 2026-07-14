import { Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import BlogPage from "../pages/public/BlogPage";
import BlogDetailsPage from "../pages/public/BlogDetailsPage";
import CampaignsPage from "../pages/public/CampaignsPage";
import CampaignDetailsPage from "../pages/public/CampaignDetailsPage";
import CoursesPage from "../pages/public/CoursesPage";
import CourseDetailsPage from "../pages/public/CourseDetailsPage";
import ProgramsPage from "../pages/public/ProgramsPage";
import ProgramDetailsPage from "../pages/public/ProgramDetailsPage";
import EventsPage from "../pages/public/EventsPage";
import EventDetailsPage from "../pages/public/EventDetailsPage";
import PartnersPage from "../pages/public/PartnersPage";
import ResourcesPage from "../pages/public/ResourcesPage";
import ImpactPage from "../pages/public/ImpactPage";
import SuccessStoriesPage from "../pages/public/SuccessStoriesPage";
import VolunteerPage from "../pages/public/VolunteerPage";
import DonatePage from "../pages/public/DonatePage";
import ContactPage from "../pages/public/ContactPage";
import NotFoundPage from "../pages/public/NotFoundPage";

function PublicRoutes() {
  //console.log('[dev] PublicRoutes invoked');
  return (
    <>
      <Route element={<PublicLayout />}>

        <Route path="/" element={<HomePage />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:id" element={<BlogDetailsPage />} />

        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />

        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />

        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:slug" element={<ProgramDetailsPage />} />

        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />

        <Route path="/partners" element={<PartnersPage />} />

        <Route path="/resources" element={<ResourcesPage />} />

        <Route path="/impact" element={<ImpactPage />} />

        <Route
          path="/success-stories"
          element={<SuccessStoriesPage />}
        />

        <Route
          path="/volunteer"
          element={<VolunteerPage />}
        />

        <Route
          path="/donate"
          element={<DonatePage />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />

      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>
  );
}

export default PublicRoutes;