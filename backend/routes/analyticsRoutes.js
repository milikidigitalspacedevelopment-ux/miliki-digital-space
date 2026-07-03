import express from "express";
import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

const router = express.Router();

const impactStories = [
  {
    id: 1,
    title: "How Sarah Started Her Digital Career",
    category: "Youth",
    excerpt: "A young woman shares how training changed her life and career path.",
    image: "/uploads/story1.jpg",
  },
  {
    id: 2,
    title: "Women Entrepreneurs Changing Communities",
    category: "Women",
    excerpt: "Women entrepreneurs are using their skills to create opportunities for others.",
    image: "/uploads/story2.jpg",
  },
];

router.get("/", asyncHandler(async (req, res) => {
  const [users, programs, courses, donations] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS count FROM users"),
    pool.query("SELECT COUNT(*)::int AS count FROM programs"),
    pool.query("SELECT COUNT(*)::int AS count FROM courses"),
    pool.query("SELECT COALESCE(SUM(amount)::numeric, 0) AS total FROM donations")
  ]);

  res.json({
    stats: [
      { title: "Total Users", value: users.rows[0].count.toLocaleString(), bg: "bg-primary" },
      { title: "Programs", value: programs.rows[0].count.toString(), bg: "bg-success" },
      { title: "Courses", value: courses.rows[0].count.toString(), bg: "bg-warning" },
      { title: "Donations", value: `KES ${Number(donations.rows[0].total || 0).toLocaleString()}`, bg: "bg-danger" }
    ],
    recentActivities: []
  });
}));

router.get("/impact", asyncHandler(async (req, res) => {
  res.json({
    stats: {
      years: 8,
      communities: 54,
      graduates: 6200,
      livesImpacted: 25000,
      jobsCreated: 1800,
    },
    stories: impactStories,
  });
}));

router.get("/impact-overview", asyncHandler(async (req, res) => {
  res.json({
    stats: {
      years: 8,
      communities: 54,
      graduates: 6200,
      livesImpacted: 25000,
      jobsCreated: 1800,
    },
    stories: impactStories,
  });
}));

router.get("/success-stories", asyncHandler(async (req, res) => {
  res.json(impactStories);
}));

export default router;
