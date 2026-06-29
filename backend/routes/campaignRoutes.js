import express from "express";
import {
  getCampaigns,
  getCampaign,
  donateToCampaign,
} from "../controllers/campaignController.js";

const router = express.Router();

router.get("/", getCampaigns);
router.get("/:id", getCampaign);
router.post("/:id/donate", donateToCampaign);

export default router;
