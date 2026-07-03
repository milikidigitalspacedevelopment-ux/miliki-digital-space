import express from "express";
import {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/programController.js";

const router = express.Router();

router.get("/", getPrograms);
router.get("/:id", getProgram);
router.post("/", createProgram);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;
