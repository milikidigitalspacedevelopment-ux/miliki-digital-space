import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { normalizeTestimonialPayload } from "../services/testimonialService.js";

const normalizeTestimonial = (row) => ({
  ...row,
  id: row.id,
  name: row.name || "Anonymous",
  role: row.role || "",
  quote: row.quote || row.testimonial || "",
  organization: row.organization || "",
  email: row.email || "",
  image_url: row.image_url || null,
  status: row.status || "pending",
  created_at: row.created_at,
});

const hasColumn = async (columnName) => {
  const result = await pool.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'testimonials' AND column_name = $1
      ) AS present
    `,
    [columnName]
  );

  return result.rows[0]?.present === true;
};

export const getTestimonials = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const values = [];
  const conditions = [];

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const includeImageColumn = await hasColumn("image_url");
  const selectFields = includeImageColumn
    ? "id, name, role, organization, email, quote, image_url, status, created_at"
    : "id, name, role, organization, email, quote, status, created_at";

  let query = `SELECT ${selectFields} FROM testimonials`;

  if (conditions.length) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, values);
  res.json(result.rows.map(normalizeTestimonial));
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const payload = normalizeTestimonialPayload(req.body);
  const { name, role, organization, email, quote, image_url, status } = payload;

  if (!quote) {
    return res.status(400).json({ message: "A testimonial message is required" });
  }

  const includeImageColumn = await hasColumn("image_url");

  if (includeImageColumn) {
    const result = await pool.query(
      `
        INSERT INTO testimonials (name, role, organization, email, quote, image_url, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, role, organization, email, quote, image_url, status, created_at
      `,
      [name || "Anonymous", role || null, organization || null, email || null, quote, image_url || null, status]
    );

    return res.status(201).json(normalizeTestimonial(result.rows[0]));
  }

  const result = await pool.query(
    `
      INSERT INTO testimonials (name, role, organization, email, quote, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, role, organization, email, quote, status, created_at
    `,
    [name || "Anonymous", role || null, organization || null, email || null, quote, status]
  );

  res.status(201).json(normalizeTestimonial(result.rows[0]));
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = normalizeTestimonialPayload(req.body);
  const { name, role, organization, email, quote, image_url, status } = payload;

  const includeImageColumn = await hasColumn("image_url");

  if (includeImageColumn) {
    const result = await pool.query(
      `
        UPDATE testimonials
        SET name = COALESCE($1, name),
            role = COALESCE($2, role),
            organization = COALESCE($3, organization),
            email = COALESCE($4, email),
            quote = COALESCE($5, quote),
            image_url = COALESCE($6, image_url),
            status = COALESCE($7, status),
            updated_at = NOW()
        WHERE id::text = $8
        RETURNING id, name, role, organization, email, quote, image_url, status, created_at
      `,
      [name || null, role || null, organization || null, email || null, quote || null, image_url || null, status || null, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    return res.json(normalizeTestimonial(result.rows[0]));
  }

  const result = await pool.query(
    `
      UPDATE testimonials
      SET name = COALESCE($1, name),
          role = COALESCE($2, role),
          organization = COALESCE($3, organization),
          email = COALESCE($4, email),
          quote = COALESCE($5, quote),
          status = COALESCE($6, status),
          updated_at = NOW()
      WHERE id::text = $7
      RETURNING id, name, role, organization, email, quote, status, created_at
    `,
    [name || null, role || null, organization || null, email || null, quote || null, status || null, id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Testimonial not found" });
  }

  res.json(normalizeTestimonial(result.rows[0]));
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM testimonials WHERE id::text = $1 RETURNING id`, [id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Testimonial not found" });
  }

  res.json({ success: true, message: "Testimonial deleted" });
});
