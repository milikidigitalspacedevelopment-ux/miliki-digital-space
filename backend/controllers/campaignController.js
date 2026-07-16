import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";

const normalizeCampaign = (row) => ({
  ...row,
  goal_amount: Number(row.goal_amount || 0),
  raised_amount: Number(row.raised_amount || 0),
  image: row.image_url || row.image || null,
});

export const getCampaigns = asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT id, title, description, goal_amount, raised_amount, status, start_date, end_date, image_url, created_at, updated_at
    FROM campaigns
    ORDER BY created_at DESC
  `);

  res.json(result.rows.map(normalizeCampaign));
});

export const getCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`
    SELECT id, title, description, goal_amount, raised_amount, status, start_date, end_date, image_url, created_at, updated_at
    FROM campaigns
    WHERE id::text = $1
    LIMIT 1
  `, [id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  return res.json(normalizeCampaign(result.rows[0]));
});

export const createCampaign = asyncHandler(async (req, res) => {
  const { title, description, goal_amount, raised_amount, status, start_date, end_date, image_url } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Campaign title is required" });
  }

  const result = await pool.query(`
    INSERT INTO campaigns (title, description, goal_amount, raised_amount, status, start_date, end_date, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, title, description, goal_amount, raised_amount, status, start_date, end_date, image_url, created_at, updated_at
  `, [title.trim(), description || null, Number(goal_amount || 0), Number(raised_amount || 0), status || "draft", start_date || null, end_date || null, image_url || null]);

  res.status(201).json(normalizeCampaign(result.rows[0]));
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, goal_amount, raised_amount, status, start_date, end_date, image_url } = req.body;

  const result = await pool.query(`
    UPDATE campaigns
    SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        goal_amount = COALESCE($3, goal_amount),
        raised_amount = COALESCE($4, raised_amount),
        status = COALESCE($5, status),
        start_date = COALESCE($6, start_date),
        end_date = COALESCE($7, end_date),
        image_url = COALESCE($8, image_url),
        updated_at = NOW()
    WHERE id::text = $9
    RETURNING id, title, description, goal_amount, raised_amount, status, start_date, end_date, image_url, created_at, updated_at
  `, [title?.trim() || null, description || null, goal_amount === undefined ? null : Number(goal_amount || 0), raised_amount === undefined ? null : Number(raised_amount || 0), status || null, start_date || null, end_date || null, image_url || null, id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  res.json(normalizeCampaign(result.rows[0]));
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM campaigns WHERE id::text = $1 RETURNING id`, [id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  res.json({ success: true, message: "Campaign deleted" });
});

export const donateToCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount = 0, donor_id } = req.body;

  const result = await pool.query(`
    UPDATE campaigns
    SET raised_amount = COALESCE(raised_amount, 0) + $1,
        updated_at = NOW()
    WHERE id::text = $2
    RETURNING id, raised_amount
  `, [Number(amount || 0), id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  await pool.query(`
    INSERT INTO donations (campaign_id, donor_id, amount, currency, status, payment_method)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [id, donor_id || null, Number(amount || 0), "KES", "pending", "Mpesa"]);

  return res.json({
    success: true,
    message: "Donation recorded",
    campaignId: id,
    raised_amount: Number(result.rows[0].raised_amount || 0),
  });
});
