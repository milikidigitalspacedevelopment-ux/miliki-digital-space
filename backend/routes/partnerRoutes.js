import express from "express";
import {
  listPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
} from "../controllers/partnerController.js";

const router = express.Router();

router.get("/", listPartners);
router.get("/:id", getPartner);
router.post("/", createPartner);
router.put("/:id", updatePartner);
router.delete("/:id", deletePartner);

export default router;
