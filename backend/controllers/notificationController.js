import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

function getUserId(req) {
  return req.user?.userId || req.user?.id;
}

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await pool.query(
    `SELECT id, user_id, title, message, type, is_read, action_url, meta, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  res.json(result.rows);
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, title, message, type, is_read, action_url, meta, created_at`,
    [req.params.id, userId]
  );

  if (!result.rows.length) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.json(result.rows[0]);
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE user_id = $1`,
    [userId]
  );

  res.json({ success: true, message: "All notifications marked as read" });
});
