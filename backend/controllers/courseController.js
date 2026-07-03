import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

export const listCourses = asyncHandler(async (req, res) => {
  const { q, status, category, page = 1, perPage = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(perPage);

  let query = `
    SELECT c.id, c.title, c.description, c.status, c.level, c.duration_hours,
           c.created_at, u.name AS instructor_name, cat.name AS category_name
    FROM courses c
    LEFT JOIN users u ON u.id = c.instructor_id
    LEFT JOIN categories cat ON cat.id = c.category_id
  `;
  const values = [];
  const conditions = [];

  if (q) {
    conditions.push(`(c.title ILIKE $${values.length + 1} OR u.name ILIKE $${values.length + 1} OR cat.name ILIKE $${values.length + 1})`);
    values.push(`%${q}%`);
  }

  if (status) {
    conditions.push(`c.status = $${values.length + 1}`);
    values.push(status);
  }

  if (category) {
    conditions.push(`LOWER(cat.name) = LOWER($${values.length + 1})`);
    values.push(category);
  }

  if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;

  query += ` ORDER BY c.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(Number(perPage), offset);

  const result = await pool.query(query, values);
  res.json(result.rows);
});

export const getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT c.*, u.name AS instructor_name, cat.name AS category_name
     FROM courses c
     LEFT JOIN users u ON u.id = c.instructor_id
     LEFT JOIN categories cat ON cat.id = c.category_id
     WHERE c.id = $1`,
    [id]
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Course not found" });
  res.json(result.rows[0]);
});

export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, instructor_id, category_id, level, status, duration_hours } = req.body;
  const result = await pool.query(
    `INSERT INTO courses (title, description, instructor_id, category_id, level, status, duration_hours)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [title, description, instructor_id || null, category_id || null, level || "beginner", status || "draft", duration_hours || null]
  );
  res.status(201).json(result.rows[0]);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, instructor_id, category_id, level, status, duration_hours } = req.body;
  const result = await pool.query(
    `UPDATE courses
     SET title = COALESCE($1, title), description = COALESCE($2, description), instructor_id = COALESCE($3, instructor_id),
         category_id = COALESCE($4, category_id), level = COALESCE($5, level), status = COALESCE($6, status), duration_hours = COALESCE($7, duration_hours), updated_at = NOW()
     WHERE id = $8 RETURNING *`,
    [title, description, instructor_id, category_id, level, status, duration_hours, id]
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Course not found" });
  res.json(result.rows[0]);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING id", [id]);
  if (!result.rows[0]) return res.status(404).json({ message: "Course not found" });
  res.json({ message: "Course deleted" });
});
