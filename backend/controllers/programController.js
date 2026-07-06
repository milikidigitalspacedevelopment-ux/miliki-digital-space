import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const resolveCategoryId = async (value) => {
  if (!value) return null;

  const normalized = String(value).trim();
  if (!normalized) return null;

  const existing = await pool.query(
    "SELECT id FROM categories WHERE LOWER(name) = LOWER($1)",
    [normalized]
  );

  if (existing.rows[0]) {
    return existing.rows[0].id;
  }

  const slug = slugify(normalized) || `category-${Date.now()}`;
  const inserted = await pool.query(
    "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id",
    [normalized, slug, `Auto-created category for ${normalized}`]
  );

  return inserted.rows[0].id;
};

export const getPrograms = asyncHandler(async (req, res) => {
  const { q, status, category, page = 1, perPage = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(perPage);

  const conditions = [];
  const values = [];

  if (q) {
    conditions.push(`(p.title ILIKE $${values.length + 1} OR p.description ILIKE $${values.length + 1})`);
    values.push(`%${q}%`);
  }

  if (status) {
    conditions.push(`p.status = $${values.length + 1}`);
    values.push(status);
  }

  if (category) {
    conditions.push(`LOWER(c.name) = LOWER($${values.length + 1})`);
    values.push(category);
  }

  let query = `
    SELECT p.id, p.title, p.description, p.status, p.start_date, p.end_date,
           p.image_url, p.created_by, p.category_id, p.created_at, p.updated_at,
           c.name AS category_name, c.slug AS category_slug
    FROM programs p
    LEFT JOIN categories c ON c.id = p.category_id
  `;

  if (conditions.length) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` ORDER BY p.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(Number(perPage), offset);

  const result = await pool.query(query, values);
  res.json(result.rows);
});

export const getProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT p.id, p.title, p.description, p.status, p.start_date, p.end_date,
            p.image_url, p.created_by, p.category_id, p.created_at, p.updated_at,
            c.name AS category_name, c.slug AS category_slug
     FROM programs p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1 OR p.slug = $1`,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Program not found" });
  }

  res.json(result.rows[0]);
});

export const createProgram = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category_id,
    category,
    category_name,
    created_by,
    status,
    start_date,
    end_date,
    image_url,
  } = req.body;

  const resolvedCategoryId = category_id || category || category_name
    ? await resolveCategoryId(category_id || category || category_name)
    : null;

  const result = await pool.query(
    `INSERT INTO programs
      (title, description, category_id, created_by, status, start_date, end_date, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      title,
      description,
      resolvedCategoryId || null,
      created_by || null,
      status || "draft",
      start_date || null,
      end_date || null,
      image_url || null,
    ]
  );

  res.status(201).json(result.rows[0]);
});

export const updateProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    category_id,
    category,
    category_name,
    created_by,
    status,
    start_date,
    end_date,
    image_url,
  } = req.body;

  const hasCategoryValue = Object.prototype.hasOwnProperty.call(req.body, "category_id") || Object.prototype.hasOwnProperty.call(req.body, "category") || Object.prototype.hasOwnProperty.call(req.body, "category_name");
  const resolvedCategoryId = hasCategoryValue
    ? await resolveCategoryId(category_id || category || category_name)
    : null;

  const result = await pool.query(
    `UPDATE programs
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         category_id = COALESCE($3, category_id),
         created_by = COALESCE($4, created_by),
         status = COALESCE($5, status),
         start_date = COALESCE($6, start_date),
         end_date = COALESCE($7, end_date),
         image_url = COALESCE($8, image_url),
         updated_at = NOW()
     WHERE id = $9
     RETURNING *`,
    [
      title,
      description,
      resolvedCategoryId,
      created_by,
      status,
      start_date,
      end_date,
      image_url,
      id,
    ]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Program not found" });
  }

  res.json(result.rows[0]);
});

export const deleteProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM programs WHERE id = $1 RETURNING id`,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Program not found" });
  }

  res.json({ message: "Program deleted" });
});
