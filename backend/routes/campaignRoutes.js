import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  donateToCampaign,
} from "../controllers/campaignController.js";

const router = express.Router();

router.get("/", getCampaigns);
router.post("/", authenticate, authorize(["admin", "super-admin"]), createCampaign);
router.get("/:id", getCampaign);
router.put("/:id", authenticate, authorize(["admin", "super-admin"]), updateCampaign);
router.delete("/:id", authenticate, authorize(["admin", "super-admin"]), deleteCampaign);
router.post("/:id/donate", donateToCampaign);

export default router;
