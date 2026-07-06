import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

export const getCategories = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT id, name, slug, description, created_at FROM categories ORDER BY name ASC`
  );

  res.json({ success: true, data: result.rows });
});
