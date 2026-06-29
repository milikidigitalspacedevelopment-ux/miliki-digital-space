import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsRead
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authenticate, getNotifications);
router.patch("/read-all", authenticate, markAllNotificationsRead);
router.patch("/:id", authenticate, markNotificationAsRead);

export default router;
