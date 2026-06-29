import express from "express";
import {
  getPrograms,
  getProgram,
} from "../controllers/programController.js";

const router = express.Router();

router.get("/", getPrograms);
router.get("/:id", getProgram);

export default router;
