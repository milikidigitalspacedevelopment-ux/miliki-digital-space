import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

const generateSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeBlog = (row) => ({
  ...row,
  author: row.author_name || "Miliki Team",
  category: row.category_name || "General",
  image: row.featured_image || row.image || "/images/blog.jpg",
  excerpt:
    row.excerpt ||
    (row.content
      ? `${String(row.content).slice(0, 160).trim()}${String(row.content).length > 160 ? "..." : ""}`
      : ""),
  date:
    row.published_at
      ? new Date(row.published_at).toISOString().slice(0, 10)
      : row.created_at
      ? new Date(row.created_at).toISOString().slice(0, 10)
      : null,
  featured: Boolean(row.featured),
});

const resolveCategoryId = async (categoryId, categoryName) => {
  if (categoryId) return categoryId;
  if (!categoryName) return null;

  const name = String(categoryName).trim();
  if (!name) return null;

  const slug = generateSlug(name);

  const result = await pool.query(
    `INSERT INTO categories (name, slug)
     VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name, slug]
  );

  return result.rows[0]?.id || null;
};

export const getBlogs = asyncHandler(async (req, res) => {
  const { q, status, category, page = 1, perPage = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(perPage);
  const conditions = [];
  const values = [];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(
      `(b.title ILIKE $${values.length} OR b.content ILIKE $${values.length} OR u.name ILIKE $${values.length})`
    );
  }

  if (status) {
    values.push(status);
    conditions.push(`b.status = $${values.length}`);
  }

  if (category) {
    values.push(category);
    conditions.push(`LOWER(c.name) = LOWER($${values.length})`);
  }

  let query = `
    SELECT b.*, u.name AS author_name, c.name AS category_name
    FROM blogs b
    LEFT JOIN users u ON u.id = b.author_id
    LEFT JOIN categories c ON c.id = b.category_id
  `;

  if (conditions.length) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` ORDER BY b.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(Number(perPage), offset);

  const result = await pool.query(query, values);
  res.json(result.rows.map(normalizeBlog));
});

export const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `
    SELECT b.*, u.name AS author_name, c.name AS category_name
    FROM blogs b
    LEFT JOIN users u ON u.id = b.author_id
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.id = $1 OR b.slug = $1
    LIMIT 1
    `,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(normalizeBlog(result.rows[0]));
});

export const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    category_id,
    category_name,
    author_id,
    author_name,
    status,
    featured_image,
    published_at,
    slug,
    featured,
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  const resolvedCategoryId = await resolveCategoryId(category_id, category_name);
  const blogSlug = slug ? generateSlug(slug) : generateSlug(title) || `blog-${Date.now()}`;

  const result = await pool.query(
    `
      INSERT INTO blogs
        (title, content, category_id, author_id, author_name, status, featured_image, published_at, slug, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
    [
      title,
      content,
      resolvedCategoryId,
      author_id || null,
      author_name || null,
      status || "draft",
      featured_image || null,
      published_at || (status === "published" ? new Date().toISOString() : null),
      blogSlug,
      featured || false,
    ]
  );

  res.status(201).json(normalizeBlog(result.rows[0]));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    content,
    category_id,
    category_name,
    author_id,
    author_name,
    status,
    featured_image,
    published_at,
    slug,
    featured,
  } = req.body;

  const resolvedCategoryId = await resolveCategoryId(category_id, category_name);

  const result = await pool.query(
    `
      UPDATE blogs
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          category_id = COALESCE($3, category_id),
          author_id = COALESCE($4, author_id),
          author_name = COALESCE($5, author_name, author_name),
          status = COALESCE($6, status),
          featured_image = COALESCE($7, featured_image),
          published_at = COALESCE($8, published_at, published_at),
          slug = COALESCE($9, slug, slug),
          featured = COALESCE($10, featured, featured),
          updated_at = NOW()
      WHERE id = $11 OR slug = $11
      RETURNING *
    `,
    [
      title,
      content,
      resolvedCategoryId,
      author_id || null,
      author_name || null,
      status,
      featured_image || null,
      published_at || null,
      slug ? generateSlug(slug) : null,
      featured,
      id,
    ]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(normalizeBlog(result.rows[0]));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM blogs WHERE id = $1 OR slug = $1 RETURNING id`,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json({ success: true, message: "Blog deleted" });
});

export default {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
