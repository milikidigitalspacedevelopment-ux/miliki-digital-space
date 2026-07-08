import express from "express";
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseRequirement,
  updateCourseRequirement,
  deleteCourseRequirement,
  reorderCourseRequirements,
  enrollCourse,
  getCourseEnrollmentStatus,
} from "../controllers/courseController.js";
import { trackCoursePopularity } from "../controllers/trackController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

// Track popularity (views/enrollments)
router.post("/:id/track-popularity", trackCoursePopularity);

router.post("/:id/enroll", authenticate, enrollCourse);
router.get("/:id/enrollment", authenticate, getCourseEnrollmentStatus);

// Requirements routes
router.post("/:courseId/requirements", addCourseRequirement);
router.put("/:courseId/requirements/:requirementId", updateCourseRequirement);
router.delete("/:courseId/requirements/:requirementId", deleteCourseRequirement);
router.post("/:courseId/requirements/reorder", reorderCourseRequirements);

export default router;
