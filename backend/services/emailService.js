import {
  sendEmail as sendZohoEmail,
  sendVerificationEmail as sendZohoVerificationEmail,
  sendPasswordResetEmail as sendZohoPasswordResetEmail,
  generateEmailHTML,
} from "../config/email.js";

/* ======================================================
   SEND EMAIL
====================================================== */
export const sendEmail = async (options) => {
  try {
    return await sendZohoEmail(options);
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
};

/* ======================================================
   SEND VERIFICATION EMAIL
====================================================== */
export const sendVerificationEmail = async (email, token, userName) => {
  try {
    return await sendZohoVerificationEmail(email, token, userName);
  } catch (error) {
    console.error("Verification email error:", error);
    throw error;
  }
};

/* ======================================================
   SEND PASSWORD RESET EMAIL
====================================================== */
export const sendPasswordResetEmail = async (email, token, userName) => {
  try {
    return await sendZohoPasswordResetEmail(email, token, userName);
  } catch (error) {
    console.error("Password reset email error:", error);
    throw error;
  }
};

/* ======================================================
   SEND WELCOME EMAIL
====================================================== */
export const sendWelcomeEmail = async (email, userName) => {
  const html = `
    <h2 style="color: #11c5ff; margin-bottom: 20px;">Welcome to Miliki!</h2>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hi ${userName || "there"},
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Welcome to our community empowerment platform! We're excited to have you on board.
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Here's what you can do:
    </p>
    <ul style="font-size: 16px; margin-bottom: 20px; color: #d6e2ee;">
      <li>Join courses and training programs</li>
      <li>Connect with mentors and volunteers</li>
      <li>Track your progress and achievements</li>
      <li>Participate in community events</li>
    </ul>
    <p style="font-size: 16px; margin-bottom: 20px;">
      If you have any questions, feel free to reach out to our support team.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to Miliki Community!",
    html,
    type: "welcome",
  });
};

/* ======================================================
   SEND NOTIFICATION EMAIL
====================================================== */
export const sendNotificationEmail = async (
  email,
  subject,
  message,
  actionUrl = null
) => {
  const html = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      ${message}
    </p>
    ${
      actionUrl
        ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${actionUrl}" style="display: inline-block; padding: 12px 24px; background: #11c5ff; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
        View Details
      </a>
    </div>
    `
        : ""
    }
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    type: "notification",
  });
};

/* ======================================================
   SEND CONTACT US RESPONSE
====================================================== */
export const sendContactUsResponse = async (email, name, subject) => {
  const html = `
    <h2 style="color: #11c5ff; margin-bottom: 20px;">Thank You for Reaching Out!</h2>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hi ${name || "there"},
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      We've received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible.
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      <strong>Your Message Subject:</strong> ${subject}
    </p>
    <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">
      Thank you for being part of our community!
    </p>
  `;

  return sendEmail({
    to: email,
    subject: "We've Received Your Message",
    html,
    type: "contact-response",
  });
};

/* ======================================================
   SEND CERTIFICATE EMAIL
====================================================== */
export const sendCertificateEmail = async (
  email,
  userName,
  certificateName,
  certificateUrl
) => {
  const html = `
    <h2 style="color: #11c5ff; margin-bottom: 20px;">Congratulations!</h2>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hi ${userName || "there"},
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      🎉 We're thrilled to inform you that you've successfully completed the <strong>${certificateName}</strong> course!
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Your certificate is now ready. You can download it using the link below:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${certificateUrl}" style="display: inline-block; padding: 12px 24px; background: #11c5ff; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Download Certificate
      </a>
    </div>
    <p style="font-size: 14px; color: #94a3b8;">
      Share your achievement with your network and continue learning with us!
    </p>
  `;

  return sendEmail({
    to: email,
    subject: `Certificate: ${certificateName}`,
    html,
    type: "certificate",
  });
};

/* ======================================================
   SEND PAYMENT CONFIRMATION
====================================================== */
export const sendPaymentConfirmation = async (
  email,
  userName,
  amount,
  transactionId,
  purpose
) => {
  const html = `
    <h2 style="color: #11c5ff; margin-bottom: 20px;">Payment Confirmed!</h2>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hi ${userName || "there"},
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Your payment has been successfully processed.
    </p>
    <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 8px 0;"><strong>Amount:</strong> KES ${amount}</p>
      <p style="margin: 8px 0;"><strong>Transaction ID:</strong> ${transactionId}</p>
      <p style="margin: 8px 0;"><strong>Purpose:</strong> ${purpose}</p>
    </div>
    <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">
      Thank you for your contribution to our community!
    </p>
  `;

  return sendEmail({
    to: email,
    subject: "Payment Confirmation",
    html,
    type: "payment",
  });
};
