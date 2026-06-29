import express from "express";
import {
  getEvents,
  getEvent,
  registerForEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/:id/register", registerForEvent);

export default router;
