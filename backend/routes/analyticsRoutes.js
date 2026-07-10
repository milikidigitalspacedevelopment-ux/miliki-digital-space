import express from "express";
import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

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

const getImpactStats = async () => {
  const [yearsResult, communitiesResult, graduatesResult, livesResult, jobsResult, growthResult] = await Promise.all([
    pool.query("SELECT EXTRACT(YEAR FROM AGE(NOW(), COALESCE(MIN(created_at), NOW())))::int AS years FROM users"),
    pool.query("SELECT COUNT(DISTINCT NULLIF(location, '')) AS communities FROM events"),
    pool.query("SELECT COUNT(*) AS graduates FROM certificates"),
    pool.query("SELECT COUNT(*) AS lives_impacted FROM users"),
    pool.query("SELECT COUNT(*) AS jobs_created FROM volunteers"),
    pool.query(
      `SELECT TO_CHAR(DATE_TRUNC('month', published_at), 'YYYY-MM') AS month,
              COUNT(*)::int AS value
       FROM certificates
       WHERE published_at IS NOT NULL
       GROUP BY month
       ORDER BY month ASC
       LIMIT 12`
    ),
  ]);

  return {
    stats: {
      years: yearsResult.rows[0]?.years || 1,
      communities: communitiesResult.rows[0]?.communities || 0,
      graduates: graduatesResult.rows[0]?.graduates || 0,
      livesImpacted: livesResult.rows[0]?.lives_impacted || 0,
      jobsCreated: jobsResult.rows[0]?.jobs_created || 0,
    },
    growthOverTime: growthResult.rows.map((row) => ({ month: row.month, value: Number(row.value) })),
  };
};

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
