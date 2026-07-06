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
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

// Requirements routes
router.post("/:courseId/requirements", addCourseRequirement);
router.put("/:courseId/requirements/:requirementId", updateCourseRequirement);
router.delete("/:courseId/requirements/:requirementId", deleteCourseRequirement);
router.post("/:courseId/requirements/reorder", reorderCourseRequirements);

export default router;
