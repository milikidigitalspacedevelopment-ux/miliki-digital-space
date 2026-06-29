import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

export const getRoles = asyncHandler(async (req, res) => {
  const result = await pool.query(`SELECT * FROM roles ORDER BY name`);
  res.json({ success: true, data: result.rows });
});

export const createRole = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *`,
    [req.body.name, req.body.description || null]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

export const updateRole = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
    [req.body.name, req.body.description || null, req.params.id]
  );
  if (!result.rows.length) {
    res.status(404);
    throw new Error("Role not found");
  }
  res.json({ success: true, data: result.rows[0] });
});

export const deleteRole = asyncHandler(async (req, res) => {
  const result = await pool.query(`DELETE FROM roles WHERE id = $1 RETURNING id`, [req.params.id]);
  if (!result.rows.length) {
    res.status(404);
    throw new Error("Role not found");
  }
  res.json({ success: true, message: "Role deleted" });
});
