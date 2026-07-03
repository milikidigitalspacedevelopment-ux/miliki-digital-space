import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getMyDonations, listDonations, getDonationReceipt, exportDonations, createDonation } from "../controllers/donationController.js";

const router = express.Router();

router.get("/my", authenticate, getMyDonations);
router.get("/", listDonations);
router.post("/", createDonation);
router.get("/:id/receipt", getDonationReceipt);
router.get("/export", exportDonations);

export default router;
