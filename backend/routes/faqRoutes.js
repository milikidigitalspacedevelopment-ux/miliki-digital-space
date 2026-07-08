import express from "express";
import { pool } from "../config/db.js";
import { sendEmail } from "../services/emailService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faq_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        answer TEXT,
        name TEXT,
        email TEXT,
        status TEXT DEFAULT 'published',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    const countResult = await pool.query(
      "SELECT COUNT(*)::int AS count FROM faq_questions"
    );

    if (countResult.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO faq_questions (question, answer, status) VALUES
        ('How do I register?', 'Create an account and choose your preferred program.', 'published'),
        ('Can I volunteer?', 'Yes. Volunteers are always welcome.', 'published'),
        ('Do you offer scholarships?', 'We offer various support opportunities depending on the program and availability.', 'published')
      `);
    }

    const result = await pool.query(
      `SELECT id, question, answer, name, email, status, created_at
       FROM faq_questions
       WHERE status IN ('published', 'pending')
       ORDER BY created_at DESC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("FAQ fetch error:", error);
    return res.status(500).json({ message: "Unable to load FAQs right now" });
  }
});

router.post("/", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faq_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        answer TEXT,
        name TEXT,
        email TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    const { question, name, email } = req.body || {};

    if (!question) {
      return res.status(400).json({ message: "Please enter your question" });
    }

    const result = await pool.query(
      `INSERT INTO faq_questions (question, name, email, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id, question, answer, name, email, status, created_at`,
      [question, name || null, email || null]
    );

    const adminEmail = process.env.ADMIN_EMAIL || "netsafehub@gmail.com";
    const faqEmailBody = `
      <h2>New FAQ Question Submitted</h2>
      <p><strong>Name:</strong> ${name || "Anonymous"}</p>
      <p><strong>Email:</strong> ${email || "Not provided"}</p>
      <p><strong>Question:</strong> ${question}</p>
    `;

    await sendEmail({
      to: adminEmail,
      subject: "New FAQ question submitted",
      html: faqEmailBody,
      type: "faq-question",
    });

    if (email) {
      await sendEmail({
        to: email,
        subject: "We received your question",
        html: `<h2>Thanks for reaching out</h2><p>We received your question and will review it shortly.</p><p><strong>Your question:</strong> ${question}</p>`,
        type: "faq-response",
      });
    }

    return res.status(201).json({
      message: "Your question has been submitted successfully",
      faq: result.rows[0],
    });
  } catch (error) {
    console.error("FAQ submission error:", error);
    return res.status(500).json({ message: "Unable to submit your question right now" });
  }
});

export default router;
