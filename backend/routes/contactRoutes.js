import express from "express";
import { pool } from "../config/db.js";
import { sendEmail, sendContactUsResponse } from "../services/emailService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO contacts (name, email, subject, message, status)
       VALUES ($1, $2, $3, $4, 'new')
       RETURNING id, name, email, subject, message, status, created_at`,
      [name, email, subject, message]
    );

    const adminEmail = process.env.ADMIN_EMAIL || "netsafehub@gmail.com";
    const contactEmailBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `New contact form submission: ${subject}`,
      html: contactEmailBody,
      type: "contact-form",
    });

    await sendContactUsResponse(email, name, subject);

    return res.status(201).json({
      message: "Message received successfully",
      contact: result.rows[0],
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    return res.status(500).json({ message: "Unable to submit your message right now" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, subject, message, status, created_at
       FROM contacts
       ORDER BY created_at DESC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Fetch contacts error:", error);
    return res.status(500).json({ message: "Unable to load contact messages" });
  }
});

export default router;
