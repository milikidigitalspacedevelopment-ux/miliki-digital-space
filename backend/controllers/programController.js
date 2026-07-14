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
  console.log("[programController] getPrograms request", { q, status, category, page, perPage });

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
  console.log("[programController] getPrograms response", { count: result.rows.length });
  res.json(result.rows);
});

export const getProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("[programController] getProgram request", { id });

  const result = await pool.query(
    `SELECT p.id, p.title, p.description, p.status, p.start_date, p.end_date,
            p.image_url, p.created_by, p.category_id, p.created_at, p.updated_at,
            c.name AS category_name, c.slug AS category_slug
     FROM programs p
     LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.created_at DESC`
  );

  const match = result.rows.find((row) => {
    const rowId = String(row.id || "");
    const requestedId = String(id || "").trim();
    return rowId === requestedId || slugify(row.title) === slugify(requestedId);
  });

  if (!match) {
    console.log("[programController] getProgram not found", { id });
    return res.status(404).json({ message: "Program not found" });
  }

  console.log("[programController] getProgram response", { id, found: true });
  res.json(match);
});

export const recordProgramView = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      event_type TEXT NOT NULL DEFAULT 'view',
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);

  await pool.query(
    `INSERT INTO analytics_events (entity_type, entity_id, event_type, metadata)
     VALUES ($1, $2, $3, $4)`,
    ["program", id, "view", { source: "program-details-page" }]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS views
     FROM analytics_events
     WHERE entity_type = $1 AND entity_id = $2 AND event_type = $3`,
    ["program", id, "view"]
  );

  res.json({ id, views: countResult.rows[0].views });
});

export const getProgramViews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS views
     FROM analytics_events
     WHERE entity_type = $1 AND entity_id = $2 AND event_type = $3`,
    ["program", id, "view"]
  );

  res.json({ id, views: countResult.rows[0].views });
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
