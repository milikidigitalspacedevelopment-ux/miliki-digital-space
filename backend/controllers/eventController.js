import asyncHandler from "express-async-handler";
import { pool } from "../config/db.js";
import { normalizeEventPayload } from "../utils/eventUtils.js";
import { triggerContentNotifications } from "../services/communicationsService.js";

export const getEvents = asyncHandler(async (req, res) => {
  const { q, status, page = 1, perPage = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(perPage);

  let query = `
    SELECT e.id, e.title, e.description, e.status, e.start_date, e.end_date,
           e.location, e.max_attendees, e.image_url, e.created_at, e.updated_at,
           c.name AS category_name, u.name AS organizer_name
    FROM events e
    LEFT JOIN categories c ON c.id = e.category_id
    LEFT JOIN users u ON u.id = e.organizer_id
  `;
  const values = [];
  const conditions = [];

  if (q) {
    conditions.push(`(e.title ILIKE $${values.length + 1} OR e.location ILIKE $${values.length + 1} OR c.name ILIKE $${values.length + 1})`);
    values.push(`%${q}%`);
  }

  if (status) {
    conditions.push(`e.status = $${values.length + 1}`);
    values.push(status);
  }

  if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;

  query += ` ORDER BY e.start_date ASC, e.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(Number(perPage), offset);

  const result = await pool.query(query, values);
  res.json(result.rows);
});

export const getEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT e.*, c.name AS category_name, u.name AS organizer_name
     FROM events e
     LEFT JOIN categories c ON c.id = e.category_id
     LEFT JOIN users u ON u.id = e.organizer_id
     WHERE e.id = $1`,
    [id]
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Event not found" });
  res.json(result.rows[0]);
});

export const createEvent = asyncHandler(async (req, res) => {
  const payload = normalizeEventPayload(req.body);
  const result = await pool.query(
    `INSERT INTO events (title, description, category_id, organizer_id, status, start_date, end_date, location, max_attendees, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [payload.title, payload.description, payload.category_id, payload.organizer_id, payload.status, payload.start_date, payload.end_date, payload.location, payload.max_attendees, payload.image_url]
  );

  const createdEvent = result.rows[0];

  try {
    await triggerContentNotifications({
      entityType: "event",
      title: createdEvent.title,
      message: `A new event, ${createdEvent.title}, has been added.`,
      actionUrl: `/events/${createdEvent.id}`,
      userId: payload.organizer_id || null,
    });
  } catch (notificationError) {
    console.error("Event notification dispatch failed", notificationError.message);
  }

  res.status(201).json(createdEvent);
});

export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = normalizeEventPayload(req.body);
  const result = await pool.query(
    `UPDATE events
     SET title = COALESCE($1, title), description = COALESCE($2, description), category_id = COALESCE($3, category_id), organizer_id = COALESCE($4, organizer_id),
         status = COALESCE($5, status), start_date = COALESCE($6, start_date), end_date = COALESCE($7, end_date), location = COALESCE($8, location),
         max_attendees = COALESCE($9, max_attendees), image_url = COALESCE($10, image_url), updated_at = NOW()
     WHERE id = $11 RETURNING *`,
    [payload.title, payload.description, payload.category_id, payload.organizer_id, payload.status, payload.start_date, payload.end_date, payload.location, payload.max_attendees, payload.image_url, id]
  );

  if (!result.rows[0]) return res.status(404).json({ message: "Event not found" });
  res.json(result.rows[0]);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING id", [id]);

  if (!result.rows[0]) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event deleted" });
});

export const registerForEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const eventResult = await pool.query("SELECT id FROM events WHERE id = $1", [id]);

  if (!eventResult.rows[0]) return res.status(404).json({ message: "Event not found" });

  res.json({
    success: true,
    message: "Registration received",
    eventId: id,
  });
});
