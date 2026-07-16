import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

const normalizeGalleryImage = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  image_url: row.image_url,
  album: row.album,
  created_at: row.created_at,
});

const ensureGalleryTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        album TEXT NOT NULL DEFAULT 'General',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  } catch (error) {
    console.error("Error ensuring gallery_images table:", error.message);
  }
};

ensureGalleryTable();

export const listGalleryImages = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM gallery_images ORDER BY created_at DESC, id DESC`
  );

  res.json(result.rows.map(normalizeGalleryImage));
});

export const createGalleryImage = asyncHandler(async (req, res) => {
  const { title, description, image_url, album } = req.body;

  if (!title || !image_url) {
    return res.status(400).json({ message: "Title and image URL are required." });
  }

  const result = await pool.query(
    `INSERT INTO gallery_images (title, description, image_url, album)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description || null, image_url, album || "General"]
  );

  res.status(201).json(normalizeGalleryImage(result.rows[0]));
});

export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM gallery_images WHERE id = $1 RETURNING id`,
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Gallery image not found" });
  }

  res.json({ success: true, message: "Gallery image deleted" });
});
