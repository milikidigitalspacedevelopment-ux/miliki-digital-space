import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { normalizeStoryPayload } from "../utils/storyUtils.js";

export const getStories = asyncHandler(async (req, res) => {
  const { q, status, page = 1, perPage = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(perPage);

  let query = `
    SELECT s.id, s.title, s.content, s.status, s.image_url, s.created_at, s.updated_at,
           s.published_at, u.name AS author_name, c.name AS category_name
    FROM stories s
    LEFT JOIN users u ON u.id = s.author_id
    LEFT JOIN categories c ON c.id = s.category_id
  `;
  const values = [];
  const conditions = [];

  if (q) {
    conditions.push(`(s.title ILIKE $${values.length + 1} OR s.content ILIKE $${values.length + 1} OR c.name ILIKE $${values.length + 1})`);
    values.push(`%${q}%`);
  }

  if (status) {
    conditions.push(`s.status = $${values.length + 1}`);
    values.push(status);
  }

  if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;

  query += ` ORDER BY s.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(Number(perPage), offset);

  const result = await pool.query(query, values);
  res.json(result.rows);
});

export const getStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT s.*, u.name AS author_name, c.name AS category_name
     FROM stories s
     LEFT JOIN users u ON u.id = s.author_id
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE s.id = $1`,
    [id]
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Story not found" });
  res.json(result.rows[0]);
});

export const createStory = asyncHandler(async (req, res) => {
  const payload = normalizeStoryPayload(req.body);
  const result = await pool.query(
    `INSERT INTO stories (title, content, author_id, category_id, image_url, status, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [payload.title, payload.content, payload.author_id, payload.category_id, payload.image_url, payload.status, payload.published_at]
  );

  res.status(201).json(result.rows[0]);
});

export const updateStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = normalizeStoryPayload(req.body);
  const result = await pool.query(
    `UPDATE stories
     SET title = COALESCE($1, title), content = COALESCE($2, content), author_id = COALESCE($3, author_id),
         category_id = COALESCE($4, category_id), image_url = COALESCE($5, image_url), status = COALESCE($6, status),
         published_at = COALESCE($7, published_at), updated_at = NOW()
     WHERE id = $8 RETURNING *`,
    [payload.title, payload.content, payload.author_id, payload.category_id, payload.image_url, payload.status, payload.published_at, id]
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Story not found" });
  res.json(result.rows[0]);
});

export const deleteStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM stories WHERE id = $1 RETURNING id", [id]);

  if (!result.rows[0]) return res.status(404).json({ message: "Story not found" });
  res.json({ message: "Story deleted" });
});
