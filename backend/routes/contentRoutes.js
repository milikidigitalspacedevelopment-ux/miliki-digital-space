import express from "express";
import { getHomeContent, getAboutContent, getDonateContent, getImpactContent } from "../controllers/contentController.js";

const router = express.Router();

router.get("/home", getHomeContent);
router.get("/about", getAboutContent);
router.get("/donate", getDonateContent);
router.get("/impact", getImpactContent);

export default router;
