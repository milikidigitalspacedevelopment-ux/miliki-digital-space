import express from "express";
import {
  getPrograms,
  getProgram,
  getProgramViews,
  recordProgramView,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/programController.js";

const router = express.Router();

router.get("/", getPrograms);
router.get("/:id", getProgram);
router.get("/:id/views", getProgramViews);
router.post("/:id/view", recordProgramView);
router.post("/", createProgram);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;
