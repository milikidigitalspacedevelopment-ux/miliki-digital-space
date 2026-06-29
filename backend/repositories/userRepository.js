import { pool } from "../config/db.js";

async function createUser({ name, email, password, role = "public", profile = {} }) {
  const res = await pool.query(
    `INSERT INTO users (name, email, password, role, profile) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email.toLowerCase(), password, role, profile]
  );
  return res.rows[0];
}

async function findUserByEmail(email) {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]);
  return res.rows[0];
}

async function findUserById(id) {
  const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return res.rows[0];
}

async function listUsers() {
  const res = await pool.query(`SELECT id, name, email, role, is_verified, is_active, profile, created_at, updated_at FROM users ORDER BY created_at DESC`);
  return res.rows;
}

async function updateUserById(id, data) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (data.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(data.name);
  }
  if (data.email !== undefined) {
    fields.push(`email = $${idx++}`);
    values.push(data.email.toLowerCase());
  }
  if (data.role !== undefined) {
    fields.push(`role = $${idx++}`);
    values.push(data.role);
  }
  if (data.is_verified !== undefined) {
    fields.push(`is_verified = $${idx++}`);
    values.push(data.is_verified);
  }
  if (data.is_active !== undefined) {
    fields.push(`is_active = $${idx++}`);
    values.push(data.is_active);
  }
  if (data.profile !== undefined) {
    fields.push(`profile = $${idx++}`);
    values.push(data.profile);
  }

  if (!fields.length) {
    return findUserById(id);
  }

  values.push(id);
  const res = await pool.query(
    `UPDATE users SET ${fields.join(", ")}, updated_at = now() WHERE id = $${idx} RETURNING id, name, email, role, is_verified, is_active, profile, created_at, updated_at`,
    values
  );
  return res.rows[0];
}

async function deleteUserById(id) {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
}

async function saveRefreshToken(userId, token, expiresAt) {
  const res = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *`,
    [userId, token, expiresAt]
  );
  return res.rows[0];
}

async function findRefreshToken(token) {
  const res = await pool.query(`SELECT * FROM refresh_tokens WHERE token = $1`, [token]);
  return res.rows[0];
}

async function deleteRefreshToken(token) {
  await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
}

export {
  createUser,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUserById,
  deleteUserById,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken
};
