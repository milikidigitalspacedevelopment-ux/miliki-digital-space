import express from "express";
import { generateCourseTimetable, getCourseTimetable } from "../controllers/timetableController.js";

const router = express.Router();

router.get("/:courseId", getCourseTimetable);
router.post("/:courseId/generate", generateCourseTimetable);

export default router;
