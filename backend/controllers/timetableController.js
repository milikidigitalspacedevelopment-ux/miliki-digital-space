import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { generateTimetableSessions } from "../utils/timetableGenerator.js";

const normalizeDayList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).trim());
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export const getCourseTimetable = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const result = await pool.query(
    "SELECT * FROM course_timetables WHERE course_id = $1 ORDER BY created_at DESC LIMIT 1",
    [courseId]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Timetable not found" });
  }

  res.json(result.rows[0]);
});

export const generateCourseTimetable = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const {
    title,
    duration_weeks,
    sessions_per_week,
    start_date,
    days_of_week,
    start_time,
    end_time,
    status = "draft",
  } = req.body;

  const normalizedDays = normalizeDayList(days_of_week);
  const durationWeeks = Number(duration_weeks || 0);
  const sessionsPerWeek = Number(sessions_per_week || normalizedDays.length || 1);
  const startDate = start_date || new Date().toISOString().slice(0, 10);

  const sessions = generateTimetableSessions({
    durationWeeks,
    sessionsPerWeek,
    startDate,
    daysOfWeek: normalizedDays,
    startTime: start_time || "09:00",
    endTime: end_time || "10:00",
  });

  const result = await pool.query(
    `INSERT INTO course_timetables (course_id, title, duration_weeks, sessions_per_week, start_date, days_of_week, start_time, end_time, sessions, status)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9::jsonb, $10)
     ON CONFLICT (course_id) DO UPDATE SET
       title = EXCLUDED.title,
       duration_weeks = EXCLUDED.duration_weeks,
       sessions_per_week = EXCLUDED.sessions_per_week,
       start_date = EXCLUDED.start_date,
       days_of_week = EXCLUDED.days_of_week,
       start_time = EXCLUDED.start_time,
       end_time = EXCLUDED.end_time,
       sessions = EXCLUDED.sessions,
       status = EXCLUDED.status,
       updated_at = NOW()
     RETURNING *`,
    [
      courseId,
      title || "Course timetable",
      durationWeeks,
      sessionsPerWeek,
      startDate,
      JSON.stringify(normalizedDays),
      start_time || "09:00",
      end_time || "10:00",
      JSON.stringify(sessions),
      status,
    ]
  );

  res.status(201).json(result.rows[0]);
});
