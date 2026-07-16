import express from "express";
import asyncHandler from "express-async-handler";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { dispatchQueuedEmails, queueMassEmail, triggerContentNotifications } from "../services/communicationsService.js";

const router = express.Router();

router.post(
  "/mass-email",
  authenticate,
  authorize(["admin", "super-admin"]),
  asyncHandler(async (req, res) => {
    const { subject, message, recipients, sendNotification, metadata } = req.body;
    const result = await queueMassEmail({ subject, message, recipients, sendNotification, metadata });
    res.status(200).json({ success: true, data: result });
  })
);

router.post(
  "/send-queued",
  authenticate,
  authorize(["admin", "super-admin"]),
  asyncHandler(async (req, res) => {
    const { subject, message, recipients } = req.body;
    const result = await dispatchQueuedEmails({ subject, message, recipients });
    res.status(200).json({ success: true, data: result });
  })
);

router.post(
  "/notify-content",
  authenticate,
  authorize(["admin", "super-admin"]),
  asyncHandler(async (req, res) => {
    const { entityType, title, message, actionUrl, userId } = req.body;
    const result = await triggerContentNotifications({ entityType, title, message, actionUrl, userId });
    res.status(200).json({ success: true, data: result });
  })
);

export default router;
