import express from "express";
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.get("/:id", getEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.post("/:id/register", registerForEvent);

export default router;
