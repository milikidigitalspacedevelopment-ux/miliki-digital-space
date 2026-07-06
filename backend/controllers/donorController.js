import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { normalizeDonorPayload, normalizeDonorRow } from "../utils/donorUtils.js";

const DEFAULT_DONOR_PASSWORD = process.env.DEFAULT_DONOR_PASSWORD || "Miliki@2026";

export const getDonors = asyncHandler(async (req, res) => {
  const { q } = req.query;
  let query = `
    SELECT id, name, email, phone, bio, avatar_url, role, is_verified, is_active, created_at, updated_at
    FROM users
    WHERE role = 'donor'
  `;
  const values = [];

  if (q) {
    query += `AND (name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1)`;
    values.push(`%${q}%`);
  }

  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, values);
  res.json(result.rows.map(normalizeDonorRow));
});

export const getDonor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT id, name, email, phone, bio, avatar_url, role, is_verified, is_active, created_at, updated_at
     FROM users
     WHERE id = $1 AND role = 'donor'`,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Donor not found" });
  }

  return res.json(normalizeDonorRow(result.rows[0]));
});

export const createDonor = asyncHandler(async (req, res) => {
  const payload = normalizeDonorPayload(req.body);

  if (!payload.name || !payload.email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const hashedPassword = await bcrypt.hash(payload.password || DEFAULT_DONOR_PASSWORD, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, phone, bio, avatar_url, is_active, is_verified, profile)
     VALUES ($1, $2, $3, 'donor', $4, $5, $6, $7, $8, $9)
     RETURNING id, name, email, phone, bio, avatar_url, role, is_verified, is_active, created_at, updated_at`,
    [payload.name, payload.email, hashedPassword, payload.phone, payload.bio, payload.avatar_url, payload.is_active, payload.is_verified, { source: "admin-created" }]
  );

  res.status(201).json(normalizeDonorRow(result.rows[0]));
});

export const updateDonor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = normalizeDonorPayload(req.body);

  const fields = [];
  const values = [];
  let index = 1;

  if (payload.name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(payload.name);
  }
  if (payload.email !== undefined) {
    fields.push(`email = $${index++}`);
    values.push(payload.email);
  }
  if (payload.phone !== undefined) {
    fields.push(`phone = $${index++}`);
    values.push(payload.phone);
  }
  if (payload.bio !== undefined) {
    fields.push(`bio = $${index++}`);
    values.push(payload.bio);
  }
  if (payload.avatar_url !== undefined) {
    fields.push(`avatar_url = $${index++}`);
    values.push(payload.avatar_url);
  }
  if (payload.is_active !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(payload.is_active);
  }
  if (payload.is_verified !== undefined) {
    fields.push(`is_verified = $${index++}`);
    values.push(payload.is_verified);
  }
  if (payload.password) {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    fields.push(`password = $${index++}`);
    values.push(hashedPassword);
  }

  if (!fields.length) {
    const existing = await pool.query(`SELECT id, name, email, phone, bio, avatar_url, role, is_verified, is_active, created_at, updated_at FROM users WHERE id = $1 AND role = 'donor'`, [id]);
    if (!existing.rows[0]) return res.status(404).json({ message: "Donor not found" });
    return res.json(normalizeDonorRow(existing.rows[0]));
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE users
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${index} AND role = 'donor'
     RETURNING id, name, email, phone, bio, avatar_url, role, is_verified, is_active, created_at, updated_at`,
    values
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Donor not found" });
  }

  return res.json(normalizeDonorRow(result.rows[0]));
});

export const deleteDonor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM users WHERE id = $1 AND role = 'donor' RETURNING id`, [id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Donor not found" });
  }

  return res.json({ message: "Donor deleted" });
});
