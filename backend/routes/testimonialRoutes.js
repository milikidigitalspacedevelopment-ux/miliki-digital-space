import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

const router = express.Router();

router.get("/", getTestimonials);
router.post("/", createTestimonial);
router.put("/:id", authenticate, authorize(["admin", "super-admin"]), updateTestimonial);
router.delete("/:id", authenticate, authorize(["admin", "super-admin"]), deleteTestimonial);

export default router;
