import express from "express";
import {
  getVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
} from "../controllers/volunteerController.js";

const router = express.Router();

router.get("/", getVolunteers);
router.post("/", createVolunteer);
router.get("/:id", getVolunteer);
router.put("/:id", updateVolunteer);
router.delete("/:id", deleteVolunteer);

export default router;
