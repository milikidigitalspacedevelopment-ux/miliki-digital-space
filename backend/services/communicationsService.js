import { pool } from "../config/db.js";
import { sendEmail } from "./emailService.js";

const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_DELAY_MS = 6 * 60 * 1000;

const normalizeRecipients = (recipients) => {
  if (!Array.isArray(recipients)) return [];

  return recipients
    .map((recipient) => {
      if (typeof recipient === "string") {
        return recipient.trim();
      }

      if (recipient && typeof recipient === "object") {
        const email = recipient.email || recipient.to || recipient.address;
        return typeof email === "string" ? email.trim() : "";
      }

      return "";
    })
    .filter(Boolean);
};

export const buildRecipientBatches = (recipients, batchSize = DEFAULT_BATCH_SIZE) => {
  const normalized = normalizeRecipients(recipients);
  const size = Math.max(1, Number(batchSize) || DEFAULT_BATCH_SIZE);

  const batches = [];

  for (let index = 0; index < normalized.length; index += size) {
    batches.push(normalized.slice(index, index + size));
  }

  return batches;
};

export const queueMassEmail = async ({ subject, message, recipients, type = "campaign", sendNotification = false, metadata = {} }) => {
  const normalizedRecipients = normalizeRecipients(recipients);

  if (!subject || !normalizedRecipients.length) {
    throw new Error("Subject and at least one recipient are required");
  }

  const batches = buildRecipientBatches(normalizedRecipients, DEFAULT_BATCH_SIZE);

  for (const batch of batches) {
    for (const recipient of batch) {
      await pool.query(
        `INSERT INTO email_logs (to_email, subject, message, status, type, error)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [recipient, subject, message, "queued", type, null]
      );
    }
  }

  if (sendNotification) {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, meta)
       VALUES ($1, $2, $3, $4, $5)`,
      [metadata.userId || null, "Mass email queued", `Your mass email campaign "${subject}" has been queued.`, "info", { type, subject, recipientCount: normalizedRecipients.length }]
    );
  }

  return {
    success: true,
    queuedCount: normalizedRecipients.length,
    batchCount: batches.length,
    delayMs: DEFAULT_DELAY_MS,
  };
};

export const dispatchQueuedEmails = async ({ subject, message, recipients, type = "campaign" }) => {
  const normalizedRecipients = normalizeRecipients(recipients);

  if (!subject || !normalizedRecipients.length) {
    return { success: false, message: "Subject and recipients are required" };
  }

  const batches = buildRecipientBatches(normalizedRecipients, DEFAULT_BATCH_SIZE);

  const results = [];

  for (const batch of batches) {
    for (const recipient of batch) {
      try {
        await sendEmail({
          to: recipient,
          subject,
          html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><p>${message}</p></div>`,
          type,
        });

        await pool.query(
          `UPDATE email_logs SET status = $1, updated_at = NOW() WHERE to_email = $2 AND subject = $3 AND status = 'queued' ORDER BY created_at DESC LIMIT 1`,
          ["sent", recipient, subject]
        );

        results.push({ recipient, status: "sent" });
      } catch (error) {
        await pool.query(
          `UPDATE email_logs SET status = $1, error = $2, updated_at = NOW() WHERE to_email = $3 AND subject = $4 AND status = 'queued' ORDER BY created_at DESC LIMIT 1`,
          ["failed", error.message, recipient, subject]
        );

        results.push({ recipient, status: "failed", error: error.message });
      }
    }

    if (batch.length === DEFAULT_BATCH_SIZE && batches.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, DEFAULT_DELAY_MS));
    }
  }

  return { success: true, sentCount: results.filter((item) => item.status === "sent").length, results };
};

export const triggerContentNotifications = async ({ entityType, title, message, actionUrl, userId }) => {
  try {
    const users = await pool.query(
      `SELECT id, email, name, role FROM users WHERE is_active = TRUE AND email IS NOT NULL`
    );

    for (const user of users.rows) {
      if (user.id === userId) continue;

      await sendEmail({
        to: user.email,
        subject: `${entityType === "blog" ? "New blog post" : entityType === "course" ? "New course available" : entityType === "program" ? "New program update" : "New event announcement"}`,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h3>${title}</h3><p>${message}</p>${actionUrl ? `<p><a href="${actionUrl}">View details</a></p>` : ""}</div>`,
        type: "notification",
      });

      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, action_url, meta)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.id, title, message, "info", actionUrl || null, { entityType }]
      );
    }

    return { success: true, sentTo: users.rows.length };
  } catch (error) {
    console.error("Content notification error:", error);
    return { success: false, message: error.message };
  }
};
