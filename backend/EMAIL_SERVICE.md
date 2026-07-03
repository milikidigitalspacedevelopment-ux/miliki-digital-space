# Email Service Documentation

## Overview

The Miliki backend uses Zoho Mail API for sending emails with comprehensive logging and notification support.

## Configuration

### Environment Variables

```env
# Zoho Mail API Configuration
ZOHO_ACCOUNTS_HOST=https://accounts.zoho.com
ZOHO_MAIL_HOST=https://mail.zoho.com
ZOHO_CLIENT_ID=your-client-id
ZOHO_CLIENT_SECRET=your-client-secret
ZOHO_REFRESH_TOKEN=your-refresh-token
ZOHO_FROM=support@yourdomain.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Admin notifications
ADMIN_EMAIL=admin@yourdomain.com
```

## Getting Zoho Credentials

### Step 1: Create Zoho Account
1. Go to https://www.zoho.com/mail/
2. Sign up for a business email account

### Step 2: Set Up OAuth
1. Visit https://api-console.zoho.com/
2. Create a new application
3. Select "Mail API"
4. Get your credentials:
   - Client ID
   - Client Secret

### Step 3: Generate Refresh Token
1. Use the authorization flow to get a refresh token
2. Add it to your `.env` file

## Usage

### Basic Email Import

```javascript
import {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendNotificationEmail,
  sendContactUsResponse,
  sendCertificateEmail,
  sendPaymentConfirmation,
} from "../services/emailService.js";
```

### Send Verification Email

```javascript
await sendVerificationEmail(
  "user@example.com",
  "jwt-token-here",
  "John Doe"
);
```

**Purpose**: Sent after user registration
**Expiry**: 24 hours
**Action**: Verify email address via link

### Send Password Reset Email

```javascript
await sendPasswordResetEmail(
  "user@example.com",
  "reset-token-here",
  "John Doe"
);
```

**Purpose**: User forgot password
**Expiry**: 1 hour
**Action**: Reset password via link

### Send Welcome Email

```javascript
await sendWelcomeEmail(
  "user@example.com",
  "John Doe"
);
```

**Purpose**: Welcome new user after verification
**Action**: Introduce platform features

### Send Notification Email

```javascript
await sendNotificationEmail(
  "user@example.com",
  "New Course Available",
  "A new course 'Web Development 101' is now available. Check it out!",
  "https://frontend.app/course/123"
);
```

**Purpose**: Generic notifications
**Action**: Optional action button with URL

### Send Certificate Email

```javascript
await sendCertificateEmail(
  "user@example.com",
  "John Doe",
  "Web Development Fundamentals",
  "https://backend.app/certificates/download/abc123"
);
```

**Purpose**: Certificate award
**Action**: Download certificate

### Send Payment Confirmation

```javascript
await sendPaymentConfirmation(
  "user@example.com",
  "John Doe",
  5000,
  "TXN-123456789",
  "Donation for Education Campaign"
);
```

**Purpose**: Payment receipt
**Details**: Amount, transaction ID, purpose

### Send Custom Email

```javascript
await sendEmail({
  to: "user@example.com",
  subject: "Custom Email Subject",
  html: "<h1>Custom HTML content</h1>",
  type: "custom", // email type for logging
  userId: "user-id-uuid", // optional, for user notifications
  sendNotification: false, // send in-app notification
  sendPush: false, // send push notification
  io: socketInstance, // optional, for real-time updates
});
```

## Email Logging

All emails are automatically logged in the `email_logs` table with:

- **to_email**: Recipient email address
- **subject**: Email subject
- **message**: Email content
- **status**: `sent` or `failed`
- **type**: Email category (verification, password-reset, etc.)
- **error**: Error message if delivery failed
- **created_at**: Timestamp

### Query Email Logs

```javascript
// Get failed emails
const failedEmails = await pool.query(
  "SELECT * FROM email_logs WHERE status = 'failed' ORDER BY created_at DESC"
);

// Get emails by type
const verificationEmails = await pool.query(
  "SELECT * FROM email_logs WHERE type = 'verification'"
);

// Get recent emails
const recent = await pool.query(
  "SELECT * FROM email_logs WHERE created_at > now() - interval '7 days'"
);
```

## Email Templates

### Verification Email
- Shows verification button
- Includes verification link
- 24-hour expiry notice

### Password Reset Email
- Shows reset button
- Includes reset link
- 1-hour expiry notice
- Reassurance about legitimate requests

### Welcome Email
- Platform introduction
- Feature highlights
- Call-to-action

### Certificate Email
- Achievement congratulations
- Certificate details
- Download link

### Payment Email
- Confirmation message
- Amount and transaction ID
- Purpose of payment
- Thank you message

## Retry Logic

The email service includes automatic retry with exponential backoff:

- **Retries**: 3 attempts
- **Initial Delay**: 1000ms
- **Backoff**: Doubles with each attempt (1s, 2s, 4s)

Failed retries after 3 attempts are logged in `email_logs` with error details.

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid token" | Zoho token expired | Automatically refreshed |
| "No account found" | Zoho account ID missing | Check Zoho setup |
| "Recipient email is required" | Missing `to` parameter | Check email address |
| "Email subject is required" | Missing `subject` | Add email subject |

### Error Recovery

```javascript
try {
  await sendEmail({
    to: email,
    subject: "Test",
    html: "<p>Test</p>",
  });
} catch (error) {
  console.error("Email failed:", error.message);
  // Log to database for manual review
  // Notify admin
  // Retry later if transient error
}
```

## Integration Examples

### Auth Controller

```javascript
import { sendVerificationEmail } from "../services/emailService.js";

async function register(req, res) {
  try {
    const { email, name, password } = req.body;
    
    // Create user
    const user = await createUser({ email, name, password });
    
    // Send verification email
    const token = generateVerificationToken(user.id);
    await sendVerificationEmail(email, token, name);
    
    res.status(201).json({ message: "Check your email to verify account" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Forgot Password Flow

```javascript
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    
    if (!user) {
      // Don't reveal user existence
      return res.json({ message: "If email exists, reset link sent" });
    }
    
    const token = generateResetToken(user.id);
    await sendPasswordResetEmail(email, token, user.name);
    
    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Monitoring

### Check Email Service Status

```javascript
// Query email statistics
const stats = await pool.query(`
  SELECT 
    type,
    status,
    COUNT(*) as total,
    COUNT(CASE WHEN created_at > now() - interval '24 hours' THEN 1 END) as last_24h
  FROM email_logs
  GROUP BY type, status
  ORDER BY type, status
`);
```

### Alert on Failures

```javascript
// Find recent failures
const failures = await pool.query(`
  SELECT *
  FROM email_logs
  WHERE status = 'failed'
  AND created_at > now() - interval '1 hour'
`);

if (failures.rows.length > 0) {
  console.error("⚠️  Email delivery failures detected:", failures.rows);
  // Send alert to admin
}
```

## Testing

### Test Email Configuration

```bash
node -e "
import { sendEmail } from './services/emailService.js';
await sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<h1>This is a test</h1>',
  type: 'test'
});
"
```

### Test Retry Logic

The retry logic is automatically tested with failed API calls. Monitor logs for retry attempts.

## Troubleshooting

### Emails Not Sending

1. **Check credentials**
   ```bash
   echo $ZOHO_CLIENT_ID  # Should show client ID
   ```

2. **Check connection**
   - Verify internet connectivity
   - Check firewall rules

3. **Check logs**
   - Review `email_logs` table
   - Check console errors

### Verify Token Expiry

Zoho tokens expire periodically. The service automatically refreshes them when needed. If issues persist:

1. Generate new refresh token
2. Update `ZOHO_REFRESH_TOKEN` in `.env`
3. Restart server

## Support

For email service issues:
- Check email_logs table for detailed error messages
- Review server console logs
- Verify Zoho Mail API account status
- Ensure all required environment variables are set
