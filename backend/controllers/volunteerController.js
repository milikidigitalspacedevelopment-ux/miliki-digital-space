import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { normalizeVolunteerPayload, normalizeVolunteerRow } from "../utils/volunteerUtils.js";

export const getVolunteers = asyncHandler(async (req, res) => {
  const { q, status, skills } = req.query;
  let query = `
    SELECT id, name, email, phone, bio, avatar_url, skills, availability, status, is_active, created_at, updated_at
    FROM volunteers
  `;
  const values = [];
  const conditions = [];

  if (q) {
    conditions.push(`(name ILIKE $${values.length + 1} OR email ILIKE $${values.length + 1} OR phone ILIKE $${values.length + 1})`);
    values.push(`%${q}%`);
  }

  if (status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(status);
  }

  if (skills) {
    conditions.push(`skills ILIKE $${values.length + 1}`);
    values.push(`%${skills}%`);
  }

  if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;
  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, values);
  res.json(result.rows.map(normalizeVolunteerRow));
});

export const getVolunteer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT id, name, email, phone, bio, avatar_url, skills, availability, status, is_active, created_at, updated_at
     FROM volunteers
     WHERE id = $1`,
    [id]
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Volunteer not found" });
  res.json(normalizeVolunteerRow(result.rows[0]));
});

export const createVolunteer = asyncHandler(async (req, res) => {
  const payload = normalizeVolunteerPayload(req.body);

  if (!payload.name || !payload.email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const result = await pool.query(
    `INSERT INTO volunteers (name, email, phone, bio, avatar_url, skills, availability, status, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, name, email, phone, bio, avatar_url, skills, availability, status, is_active, created_at, updated_at`,
    [payload.name, payload.email, payload.phone, payload.bio, payload.avatar_url, payload.skills, payload.availability, payload.status, payload.is_active]
  );

  res.status(201).json(normalizeVolunteerRow(result.rows[0]));
});

export const updateVolunteer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = normalizeVolunteerPayload(req.body);

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
  if (payload.skills !== undefined) {
    fields.push(`skills = $${index++}`);
    values.push(payload.skills);
  }
  if (payload.availability !== undefined) {
    fields.push(`availability = $${index++}`);
    values.push(payload.availability);
  }
  if (payload.status !== undefined) {
    fields.push(`status = $${index++}`);
    values.push(payload.status);
  }
  if (payload.is_active !== undefined) {
    fields.push(`is_active = $${index++}`);
    values.push(payload.is_active);
  }

  if (!fields.length) {
    const existing = await pool.query(`SELECT id, name, email, phone, bio, avatar_url, skills, availability, status, is_active, created_at, updated_at FROM volunteers WHERE id = $1`, [id]);
    if (!existing.rows[0]) return res.status(404).json({ message: "Volunteer not found" });
    return res.json(normalizeVolunteerRow(existing.rows[0]));
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE volunteers
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${index}
     RETURNING id, name, email, phone, bio, avatar_url, skills, availability, status, is_active, created_at, updated_at`,
    values
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Volunteer not found" });
  res.json(normalizeVolunteerRow(result.rows[0]));
});

export const deleteVolunteer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM volunteers WHERE id = $1 RETURNING id", [id]);

  if (!result.rows[0]) return res.status(404).json({ message: "Volunteer not found" });
  res.json({ message: "Volunteer deleted" });
});
