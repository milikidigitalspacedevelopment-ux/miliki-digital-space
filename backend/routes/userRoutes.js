import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateProfile);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

export default router;
