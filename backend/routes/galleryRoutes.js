import express from "express";
import {
  listGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", listGalleryImages);
router.post(
  "/",
  authenticate,
  authorize(["admin", "super-admin", "super_admin"]),
  createGalleryImage
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "super-admin", "super_admin"]),
  deleteGalleryImage
);

export default router;
