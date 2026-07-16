import express from "express";
import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { buildImpactStats } from "../utils/analyticsUtils.js";

const router = express.Router();

const normalizeStoryRow = (row) => ({
  id: row.id,
  name: row.title || "",
  excerpt: row.content ? row.content.substring(0, 130) : "",
  category: row.category_name || row.category || "",
  image: row.image_url || row.image || "/impact.png",
  slug: row.slug || row.id,
});

const getPublishedStories = async () => {
  const result = await pool.query(
    `SELECT s.id, s.title, s.content, s.image_url, s.published_at, c.name AS category_name, u.name AS author_name
     FROM stories s
     LEFT JOIN categories c ON c.id = s.category_id
     LEFT JOIN users u ON u.id = s.author_id
     WHERE s.status = 'published'
     ORDER BY COALESCE(s.published_at, s.created_at) DESC
     LIMIT 6`
  );

  return result.rows.map(normalizeStoryRow);
};

const getImpactStats = async () => buildImpactStats((query) => pool.query(query));

router.get("/", asyncHandler(async (req, res) => {
  const [users, programs, courses, donations] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS count FROM users"),
    pool.query("SELECT COUNT(*)::int AS count FROM programs"),
    pool.query("SELECT COUNT(*)::int AS count FROM courses"),
    pool.query("SELECT COALESCE(SUM(amount)::numeric, 0) AS total FROM donations"),
  ]);

  res.json({
    stats: [
      { title: "Total Users", value: users.rows[0].count.toLocaleString(), bg: "bg-primary" },
      { title: "Programs", value: programs.rows[0].count.toString(), bg: "bg-success" },
      { title: "Courses", value: courses.rows[0].count.toString(), bg: "bg-warning" },
      { title: "Donations", value: `KES ${Number(donations.rows[0].total || 0).toLocaleString()}`, bg: "bg-danger" },
    ],
    recentActivities: [],
  });
}));

router.get("/impact", asyncHandler(async (req, res) => {
  const data = await getImpactStats();
  const stories = await getPublishedStories();
  res.json({ ...data, stories });
}));

router.get("/impact-overview", asyncHandler(async (req, res) => {
  const data = await getImpactStats();
  const stories = await getPublishedStories();
  res.json({ ...data, stories });
}));

router.get("/success-stories", asyncHandler(async (req, res) => {
  const stories = await getPublishedStories();
  res.json(stories);
}));

export default router;
