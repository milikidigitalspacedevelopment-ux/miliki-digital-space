import dotenv from "dotenv";

dotenv.config();

import { pool } from "../config/db.js";

const ZOHO_AUTH_URL =
  process.env.ZOHO_ACCOUNTS_HOST +
  "/oauth/v2/token";

const ZOHO_MAIL_HOST = (
  process.env.ZOHO_MAIL_HOST ||
  "https://mail.zoho.com"
).replace(/\/api\/?$/, "").replace(/\/$/, "");

let cachedAccountId = null;
let cachedToken = null;

/* ======================================================
   SAFE JSON
====================================================== */
const safeJson = async (res) => {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

/* ======================================================
   RETRY
====================================================== */
const withRetry = async (
  fn,
  retries = 3,
  delay = 1000
) => {
  let lastErr;

  for (
    let i = 0;
    i < retries;
    i++
  ) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;

      if (i < retries - 1) {
        await new Promise((r) =>
          setTimeout(
            r,
            delay *
              Math.pow(2, i)
          )
        );
      }
    }
  }

  throw lastErr;
};

/* ======================================================
   CLEAR CACHE
====================================================== */
const clearZohoCache = () => {
  cachedToken = null;
  cachedAccountId = null;
};

/* ======================================================
   ACCESS TOKEN
====================================================== */
export const getZohoAccessToken =
  async () => {
    if (cachedToken) {
      return cachedToken;
    }

    const res = await fetch(
      ZOHO_AUTH_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body: new URLSearchParams({
          refresh_token:
            process.env
              .ZOHO_REFRESH_TOKEN,

          client_id:
            process.env
              .ZOHO_CLIENT_ID,

          client_secret:
            process.env
              .ZOHO_CLIENT_SECRET,

          grant_type:
            "refresh_token",
        }),
      }
    );

    const data =
      await safeJson(res);

    if (
      !res.ok ||
      !data.access_token
    ) {
      console.error(
        "Zoho token error:",
        data
      );

      throw new Error(
        "Failed to get Zoho token"
      );
    }

    cachedToken =
      data.access_token;

    return cachedToken;
  };

/* ======================================================
   ACCOUNT ID
====================================================== */
export const getZohoAccountId =
  async (token) => {
    if (cachedAccountId) {
      return cachedAccountId;
    }

    const res = await fetch(
      `${ZOHO_MAIL_HOST}/api/accounts`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      }
    );

    const data =
      await safeJson(res);

    if (
      !data?.data?.[0]
        ?.accountId
    ) {
      console.error(
        "Zoho account error:",
        data
      );

      throw new Error(
        "No Zoho account found"
      );
    }

    cachedAccountId =
      data.data[0].accountId;

    return cachedAccountId;
  };

/* ======================================================
   EMAIL TEMPLATE
====================================================== */
export const generateEmailHTML = (title, body) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
</head>

<body style="
  margin:0;
  padding:0;
background:#f8fff4;
  font-family:Arial,Helvetica,sans-serif;
">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:#f8fff4;
    padding:20px 12px;
  "
>
<tr>
<td align="center">

<!-- MAIN CONTAINER -->
<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    max-width:620px;
    background:#ffffff;
    border-radius:22px;
    overflow:hidden;
    border:1px solid #d9f7d8;
  "
>

  <!-- HEADER -->
  <tr>
    <td
      align="center"
      style="
        padding:28px 20px 20px;
        background:
          linear-gradient(
            135deg,
            #166c42 0%,
            #1f8a4b 60%,
            #22c55e 100%
          );
        border-bottom:1px solid #d9f7d8;
      "
    >

      <!-- LOGO -->
      <img
        src="https://miliki-digital-space.milikidigitalspacedevelopment.workers.dev/logo.png"
        alt="Miliki"
        style="
          width:180px;
          max-width:85%;
          height:auto;
          display:block;
          margin:auto;
        "
      />

      <!-- BRAND TEXT -->
      <div
        style="
          margin-top:12px;
          font-size:13px;
          letter-spacing:1.2px;
          color:#fbbf24;
          font-weight:700;
        "
      >
        BUILDING COMMUNITY. EMPOWERING GROWTH.
      </div>

    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td
      style="
        padding:32px 24px;
        color:#ffffff;
      "
    >

      <!-- TITLE -->
      <h1
        style="
          margin:0 0 22px;
          font-size:28px;
          line-height:1.25;
          color:#111111;
          font-weight:800;
        "
      >
        ${title}
      </h1>

      <!-- CONTENT -->
      <div
        style="
          font-size:16px;
          line-height:1.75;
          color:#374151;
        "
      >
        ${body}
      </div>

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td
      style="
        padding:22px;
        background:#f8fff4;
        border-top:1px solid #d9f7d8;
        text-align:center;
      "
    >

      <div
        style="
          color:#166c42;
          font-size:14px;
          font-weight:700;
          margin-bottom:8px;
        "
      >
        Miliki Digital Space
      </div>

      <div
        style="
          color:#6b7280;
          font-size:13px;
          line-height:1.6;
        "
      >
        Driving Connections. Building Futures.
      </div>

      <div
        style="
          margin-top:14px;
          color:#4b5563;
          font-size:12px;
        "
      >
        © ${new Date().getFullYear()} Miliki. All rights reserved.
      </div>

    </td>
  </tr>

</table>
<!-- END CONTAINER -->

</td>
</tr>
</table>

</body>
</html>
`;

/* ======================================================
   SEND EMAIL
====================================================== */
export const sendEmail =
  async ({
    to,
    subject,
    html,
    text,
    from,

    userId,

    type = "normal",

    sendNotification = true,
    sendPush = false,

    io,
  }) => {
    try {
      if (!to) {
        throw new Error(
          "Recipient email is required"
        );
      }

      if (!subject) {
        throw new Error(
          "Email subject is required"
        );
      }

      if (!html && !text) {
        throw new Error(
          "Email content is required"
        );
      }

      const wrappedHtml =
        html
          ? generateEmailHTML(
              subject,
              html
            )
          : text;

      /* =====================================
         GET TOKEN
      ===================================== */
      let token =
        await getZohoAccessToken();

      /* =====================================
         GET ACCOUNT
      ===================================== */
      let accountId =
        await getZohoAccountId(
          token
        );

      /* =====================================
         SEND FUNCTION
      ===================================== */
      const sendMail =
        async () => {
          const res =
            await fetch(
              `${ZOHO_MAIL_HOST}/api/accounts/${accountId}/messages`,
              {
                method: "POST",

                headers: {
                  Authorization: `Zoho-oauthtoken ${token}`,

                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(
                  {
                    fromAddress:
                      from ||
                      process.env
                        .ZOHO_FROM,

                    toAddress: to,

                    subject,

                    content:
                      wrappedHtml,

                    mailFormat:
                      "html",
                  }
                ),
              }
            );

          const data =
            await safeJson(
              res
            );

          /* =========================
             TOKEN EXPIRED
          ========================= */
          if (
            res.status === 401
          ) {
            clearZohoCache();

            token =
              await getZohoAccessToken();

            accountId =
              await getZohoAccountId(
                token
              );

            throw new Error(
              "TOKEN_REFRESH_RETRY"
            );
          }

          if (!res.ok) {
            console.error(
              "Zoho send error:",
              data
            );

            throw new Error(
              JSON.stringify(
                data
              )
            );
          }

          return data;
        };

      /* =====================================
         SEND WITH RETRY
      ===================================== */
      await withRetry(
        sendMail
      );

      /* =====================================
         LOG SUCCESS
      ===================================== */
      await pool.query(
        `
        INSERT INTO email_logs
        (
          to_email,
          subject,
          message,
          status,
          type,
          created_at
        )
        VALUES ($1,$2,$3,$4,$5,NOW())
        `,
        [
          to,
          subject,
          wrappedHtml,
          "sent",
          type,
        ]
      );

      /* =====================================
         IN-APP NOTIFICATION
      ===================================== */
      if (
        sendNotification &&
        userId
      ) {
        try {
          await notifyUser({
            userId,

            message: `📧 ${subject}`,

            io,

            meta: {
              url:
                "/notifications",
            },
          });
        } catch (notifyErr) {
          console.error(
            "Notification error:",
            notifyErr.message
          );
        }
      }

      /* =====================================
         PUSH
      ===================================== */
      if (
        sendPush &&
        userId
      ) {
        try {
          await sendPushToUser(
            userId,
            {
              title:
                "New Email",

              message:
                subject,

              url:
                "/notifications",
            }
          );
        } catch (pushErr) {
          console.error(
            "Push error:",
            pushErr.message
          );
        }
      }

      return {
        success: true,
      };
    } catch (err) {
      console.error(
        "EMAIL ERROR:",
        err
      );

      try {
        await pool.query(
          `
          INSERT INTO email_logs
          (
            to_email,
            subject,
            message,
            status,
            error,
            type,
            created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,NOW())
          `,
          [
            to || null,
            subject || null,
            html || text || null,
            "failed",
            err.message,
            type,
          ]
        );
      } catch (logErr) {
        console.error(
          "Email log error:",
          logErr.message
        );
      }

      throw err;
    }
  };

/* ======================================================
   VERIFICATION EMAIL
====================================================== */
const ensureEmailConfig = () => {
  const required = ["ZOHO_REFRESH_TOKEN", "ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_FROM"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Email delivery is not configured. Missing: ${missing.join(", ")}`);
  }
};

export const sendVerificationEmail = async (
  toOrPayload,
  token,
  userName
) => {
  const recipient =
    typeof toOrPayload === "string"
      ? toOrPayload
      : toOrPayload?.to || toOrPayload?.email;
  const verificationToken =
    token ?? toOrPayload?.token;
  const displayName =
    userName ?? toOrPayload?.name ?? toOrPayload?.userName;

  if (!recipient) {
    throw new Error("Recipient email is required");
  }

  if (!verificationToken) {
    throw new Error("Verification token is required");
  }

  ensureEmailConfig();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verifyUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(verificationToken)}`;

  const html = `
    <h2 style="color: #11c5ff; margin-bottom: 20px;">Verify Your Email Address</h2>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hi ${displayName || "there"},
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Thank you for signing up! Please verify your email address by clicking the button below:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #11c5ff; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Verify Email
      </a>
    </div>
    <p style="font-size: 14px; color: #94a3b8;">
      If the button doesn't work, paste this link in your browser:<br/>
      <a href="${verifyUrl}" style="color: #11c5ff;">${verifyUrl}</a>
    </p>
    <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">
      This link will expire in 24 hours.
    </p>
  `;

  return sendEmail({
    to: recipient,
    subject: "Verify Your Email Address",
    html,
    type: "verification",
  });
};

/* ======================================================
   PASSWORD RESET EMAIL
====================================================== */
export const sendPasswordResetEmail = async (
  toOrPayload,
  token,
  userName
) => {
  const recipient =
    typeof toOrPayload === "string"
      ? toOrPayload
      : toOrPayload?.to || toOrPayload?.email;
  const resetToken = token ?? toOrPayload?.token;
  const displayName =
    userName ?? toOrPayload?.name ?? toOrPayload?.userName;

  if (!recipient) {
    throw new Error("Recipient email is required");
  }

  if (!resetToken) {
    throw new Error("Reset token is required");
  }

  ensureEmailConfig();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const html = `
    <h2 style="color: #11c5ff; margin-bottom: 20px;">Reset Your Password</h2>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hi ${displayName || "there"},
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #11c5ff; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 14px; color: #94a3b8;">
      If the button doesn't work, paste this link in your browser:<br/>
      <a href="${resetUrl}" style="color: #11c5ff;">${resetUrl}</a>
    </p>
    <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">
      This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
    </p>
  `;

  return sendEmail({
    to: recipient,
    subject: "Reset Your Password",
    html,
    type: "password-reset",
  });
};
