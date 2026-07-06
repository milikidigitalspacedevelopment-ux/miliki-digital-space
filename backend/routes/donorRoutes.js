import express from "express";
import { createDonor, deleteDonor, getDonor, getDonors, updateDonor } from "../controllers/donorController.js";

const router = express.Router();

router.get("/", getDonors);
router.post("/", createDonor);
router.get("/:id", getDonor);
router.put("/:id", updateDonor);
router.delete("/:id", deleteDonor);

export default router;
