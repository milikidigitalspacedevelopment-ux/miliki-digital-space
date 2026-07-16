import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { triggerContentNotifications } from "../services/communicationsService.js";

const ensureBlogTrackingColumns = async () => {
  try {
    await pool.query(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;`);
    await pool.query(`ALTER TABLE blogs ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;`);
  } catch (error) {
    console.error("Error ensuring blog tracking columns:", error.message);
  }
};

ensureBlogTrackingColumns();

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
  try {
  const result = await pool.query(
    `
    SELECT b.*, u.name AS author_name, c.name AS category_name
    FROM blogs b
    LEFT JOIN users u ON u.id = b.author_id
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.id::text = $1 OR b.slug = $1
    LIMIT 1
    `,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(normalizeBlog(result.rows[0]));
} catch (error) {
  console.error("Error fetching blog:", error.message);
  res.status(500).json({ message: "An error occurred while fetching the blog." });
}
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
    excerpt,
    seo_title,
    meta_description,
  } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const resolvedCategoryId = await resolveCategoryId(category_id, category_name);
    const blogSlug = slug ? generateSlug(slug) : generateSlug(title) || `blog-${Date.now()}`;

    const result = await pool.query(
      `
        INSERT INTO blogs
          (title, content, category_id, author_id, author_name, status, featured_image, published_at, slug, featured, excerpt, seo_title, meta_description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
        excerpt || null,
        seo_title || null,
        meta_description || null,
      ]
    );

    const createdBlog = normalizeBlog(result.rows[0]);

    try {
      await triggerContentNotifications({
        entityType: "blog",
        title: createdBlog.title,
        message: `A new blog post, ${createdBlog.title}, has been published.`,
        actionUrl: `/blogs/${createdBlog.slug || createdBlog.id}`,
        userId: author_id || null,
      });
    } catch (notificationError) {
      console.error("Blog notification dispatch failed", notificationError.message);
    }

    res.status(201).json(createdBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "An error occurred while creating the blog." });
  }
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
    excerpt,
    seo_title,
    meta_description,
  } = req.body;

  try {
    const resolvedCategoryId = await resolveCategoryId(category_id, category_name);

    const result = await pool.query(
      `
        UPDATE blogs
        SET title = COALESCE($1, title),
            content = COALESCE($2, content),
            category_id = COALESCE($3, category_id),
            author_id = COALESCE($4, author_id),
            author_name = COALESCE($5, author_name),
            status = COALESCE($6, status),
            featured_image = COALESCE($7, featured_image),
            published_at = COALESCE($8, published_at),
            slug = COALESCE($9, slug),
            featured = COALESCE($10, featured),
            excerpt = COALESCE($11, excerpt),
            seo_title = COALESCE($12, seo_title),
            meta_description = COALESCE($13, meta_description),
            updated_at = NOW()
        WHERE id = $14 OR slug = $14
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
        excerpt || null,
        seo_title || null,
        meta_description || null,
        id,
      ]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(normalizeBlog(result.rows[0]));
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "An error occurred while updating the blog." });
  }
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

export const trackBlogView = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {

  const result = await pool.query(
    `
      UPDATE blogs
      SET views = COALESCE(views, 0) + 1
      WHERE id::text = $1 OR slug = $1
      RETURNING id, views, share_count, time_spent_seconds
    `,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(result.rows[0]);
  } catch (error) {
    console.error("Error tracking blog view:", error.message);
    res.status(500).json({ message: "An error occurred while tracking the blog view." });
  }
});

export const trackBlogShare = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `
      UPDATE blogs
      SET share_count = COALESCE(share_count, 0) + 1
      WHERE id::text = $1 OR slug = $1
      RETURNING id, views, share_count, time_spent_seconds
    `,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(result.rows[0]);
});

export const trackBlogTimeSpent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const seconds = Math.max(0, Number(req.body.seconds) || 0);

  if (seconds <= 0) {
    return res.status(400).json({ message: "Invalid time spent value." });
  }

  const result = await pool.query(
    `
      UPDATE blogs
      SET time_spent_seconds = COALESCE(time_spent_seconds, 0) + $2
      WHERE id::text = $1 OR slug = $1
      RETURNING id, views, share_count, time_spent_seconds
    `,
    [id, seconds]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(result.rows[0]);
});

export const getBlogPreview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `
      SELECT b.*, u.name AS author_name, c.name AS category_name
      FROM blogs b
      LEFT JOIN users u ON u.id = b.author_id
      LEFT JOIN categories c ON c.id = b.category_id
      WHERE b.id::text = $1 OR b.slug = $1
      LIMIT 1
    `,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const blog = normalizeBlog(result.rows[0]);

  res.json({
    title: blog.title,
    description: blog.excerpt,
    image: blog.image,
    url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/blogs/${blog.slug || blog.id}`,
    author: blog.author,
    published_at: blog.published_at,
  });
});

export default {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
