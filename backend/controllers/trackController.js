import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

export const trackCoursePopularity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE courses SET popularity = COALESCE(popularity, 0) + 1 WHERE id = $1 RETURNING popularity`,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ id, popularity: result.rows[0].popularity });
  } catch (error) {
    console.error("Error tracking course popularity:", error.message);
    res.status(500).json({ message: "Failed to track popularity" });
  }
});
