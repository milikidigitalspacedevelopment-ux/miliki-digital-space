import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

export const listPartners = asyncHandler(async (req, res) => {
  const { q, status, type, page = 1, perPage = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(perPage);

  let query = `SELECT id, name, description, website, contact_email, status, logo_url, created_at, updated_at FROM partners`;
  const values = [];
  const conditions = [];

  if (q) {
    conditions.push(`(name ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})`);
    values.push(`%${q}%`);
  }

  if (status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(status);
  }

  if (type) {
    conditions.push(`name ILIKE $${values.length + 1}`);
    values.push(`%${type}%`);
  }

  if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;

  query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(Number(perPage), offset);

  const result = await pool.query(query, values);
  res.json(result.rows);
});

export const getPartner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM partners WHERE id = $1", [id]);
  if (!result.rows[0]) return res.status(404).json({ message: "Partner not found" });
  res.json(result.rows[0]);
});

export const createPartner = asyncHandler(async (req, res) => {
  const { name, description, website, contact_email, status, logo_url } = req.body;
  const result = await pool.query(
    `INSERT INTO partners (name, description, website, contact_email, status, logo_url)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, description, website, contact_email, status || "active", logo_url || null]
  );
  res.status(201).json(result.rows[0]);
});

export const updatePartner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, website, contact_email, status, logo_url } = req.body;
  const result = await pool.query(
    `UPDATE partners
     SET name = COALESCE($1, name), description = COALESCE($2, description), website = COALESCE($3, website),
         contact_email = COALESCE($4, contact_email), status = COALESCE($5, status), logo_url = COALESCE($6, logo_url), updated_at = NOW()
     WHERE id = $7 RETURNING *`,
    [name, description, website, contact_email, status, logo_url, id]
  );
  if (!result.rows[0]) return res.status(404).json({ message: "Partner not found" });
  res.json(result.rows[0]);
});

export const deletePartner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM partners WHERE id = $1 RETURNING id", [id]);
  if (!result.rows[0]) return res.status(404).json({ message: "Partner not found" });
  res.json({ message: "Partner deleted" });
});
