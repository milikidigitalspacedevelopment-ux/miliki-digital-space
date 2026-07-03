# Miliki Backend - Quick Start Guide

## Overview

Welcome to the Miliki backend! This is a Node.js/Express application for a community empowerment platform with multi-role support, course management, events, volunteering, donations, and more.

## Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **PostgreSQL** v12 or higher (local or remote)
- **Git** (for version control)

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the existing `.env` file and update it with your configuration:

```bash
# The .env file should already exist, but you can create it if needed
# cp .env.example .env  (if applicable)
```

Key environment variables to configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/miliki_db

# JWT Secrets (use strong random strings)
JWT_ACCESS_SECRET=your-strong-secret-key
JWT_REFRESH_SECRET=your-strong-secret-key
JWT_VERIFY_EMAIL_SECRET=your-strong-secret-key
JWT_PASSWORD_RESET_SECRET=your-strong-secret-key

# Zoho Mail API (for emails)
ZOHO_CLIENT_ID=your-zoho-client-id
ZOHO_CLIENT_SECRET=your-zoho-client-secret
ZOHO_REFRESH_TOKEN=your-zoho-refresh-token
ZOHO_FROM=support@yourdomain.com

# Frontend
FRONTEND_URL=http://localhost:5173

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database configuration details.

### 3. Database Setup

The database schema is **automatically initialized** on server startup. No manual setup needed!

To manually initialize or reset the database:

```bash
# In Node REPL or create a script:
import { initializeDatabase } from './database/initialize.js';
await initializeDatabase();

# To seed with sample data:
import { seedDatabase } from './database/initialize.js';
await seedDatabase();
```

## Development

### Start Development Server

```bash
npm run dev
```

The server will:
1. Connect to PostgreSQL
2. Initialize database schema
3. Start on `http://localhost:5000`

### Available Scripts

```bash
npm run start    # Production server
npm run dev      # Development with nodemon
npm run lint     # Run ESLint
npm run test     # Run tests (if configured)
```

## Project Structure

```
backend/
├── config/              # Configuration modules
│   ├── db.js           # Database connection
│   ├── email.js        # Zoho Mail API setup
│   ├── cloudinary.js   # Image upload (optional)
│   ├── mpesa.js        # M-Pesa payment (optional)
│   └── ...
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── userController.js
│   └── ...
├── services/           # Business logic
│   ├── authService.js
│   ├── emailService.js
│   └── ...
├── models/            # Data models
├── routes/            # API routes
├── middlewares/       # Express middlewares
├── database/          # Database schemas
│   ├── schema.sql
│   ├── initialize.js
│   └── migrations/
├── utils/             # Helper functions
├── validations/       # Input validation
├── .env               # Environment variables
├── app.js             # Express app setup
└── server.js          # Server entry point
```

## Key Features

### Authentication
- User registration with email verification
- Login with JWT tokens
- Password reset via email
- Google OAuth integration
- Role-based access control

### Email Service
- Verification emails
- Password reset emails
- Welcome emails
- Notification emails
- Email logging and retry logic

See [EMAIL_SERVICE.md](./EMAIL_SERVICE.md) for detailed email service documentation.

### Database
- Multi-table schema for complex features
- Automatic indexes for performance
- UUID primary keys for distributed systems
- Timestamp tracking (created_at, updated_at)

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database details.

### Security Features
- Password hashing with bcryptjs
- JWT-based authentication
- Rate limiting middleware
- CORS protection
- Helmet.js security headers
- Input validation with Joi

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/google` - Google OAuth authorization
- `GET /api/auth/google/callback` - Google OAuth callback

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin)

### Roles
- `GET /api/roles` - List available roles
- `POST /api/roles` - Create role (admin)
- `PUT /api/roles/:id` - Update role (admin)
- `DELETE /api/roles/:id` - Delete role (admin)

More endpoints available for courses, events, donations, etc.

## Database Tables

### Users & Authentication
- **users** - User accounts
- **refresh_tokens** - JWT tokens

### Learning
- **categories** - Content categories
- **programs** - Learning programs
- **courses** - Individual courses
- **lessons** - Course lessons
- **assignments** - Student assignments
- **certificates** - Completion certificates

### Community
- **events** - Community events
- **volunteer_opportunities** - Volunteer positions
- **blogs** - Blog posts
- **stories** - Community stories

### Transactions
- **donations** - Donation records
- **payments** - Payment transactions
- **campaigns** - Fundraising campaigns

### Communication
- **email_logs** - Email delivery logs
- **notifications** - In-app notifications
- **newsletter_subscriptions** - Newsletter signups

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete schema documentation.

## Configuration Details

### Email Configuration

The backend uses **Zoho Mail API** for sending emails:

1. Configure Zoho credentials in `.env`
2. Emails are automatically logged in `email_logs` table
3. Retry logic handles transient failures
4. HTML templates are automatically generated

See [EMAIL_SERVICE.md](./EMAIL_SERVICE.md) for detailed email setup.

### Database Configuration

Supports multiple connection formats:

```env
# Standard PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/db

# Supabase
DATABASE_URL=postgresql://postgres:password@db.region.supabase.co:5432/postgres

# Alternative names
POSTGRES_URI=postgresql://user:password@localhost:5432/db
PG_URI=postgresql://user:password@localhost:5432/db
```

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database setup details.

## Troubleshooting

### Server Won't Start

1. **Check Node version**
   ```bash
   node --version  # Should be v18+
   ```

2. **Check dependencies**
   ```bash
   npm install
   ```

3. **Check .env file**
   - Verify all required variables are set
   - Check PostgreSQL connection string

4. **Check database connection**
   ```bash
   psql postgresql://user:password@localhost:5432/miliki_db
   ```

### Database Connection Issues

See [DATABASE_SETUP.md](./DATABASE_SETUP.md#troubleshooting) for detailed troubleshooting.

### Email Not Sending

See [EMAIL_SERVICE.md](./EMAIL_SERVICE.md#troubleshooting) for detailed troubleshooting.

## Development Tips

### Debugging

1. **Enable verbose logging**
   ```env
   NODE_ENV=development
   LOG_LEVEL=debug
   ```

2. **Check console output**
   - Server startup logs
   - Database initialization status
   - Email sending status

3. **Monitor database**
   ```sql
   SELECT * FROM email_logs WHERE status = 'failed';
   SELECT * FROM notifications WHERE is_read = false;
   ```

### Testing Endpoints

Use a REST client (Postman, Insomnia, VS Code REST Client):

```bash
### Register new user
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "student"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

## Production Deployment

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Database backed up
- [ ] JWT secrets are strong and random
- [ ] SSL/TLS certificates ready
- [ ] Email service credentials verified
- [ ] Database indexes verified
- [ ] Rate limiting configured
- [ ] CORS origins set correctly

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://prod-user:strong-password@prod-db:5432/miliki_prod
JWT_ACCESS_SECRET=very-strong-random-string
JWT_REFRESH_SECRET=very-strong-random-string
ZOHO_CLIENT_ID=production-zoho-id
ZOHO_CLIENT_SECRET=production-zoho-secret
FRONTEND_URL=https://miliki.app
```

### Deployment Commands

```bash
# Install dependencies
npm ci

# Start production server
npm start

# Monitor logs
pm2 logs
```

## Support & Documentation

- **Database**: See [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **Email Service**: See [EMAIL_SERVICE.md](./EMAIL_SERVICE.md)
- **API Documentation**: Check `docs/openapi.yaml`

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` file with your credentials
3. ✅ Start development server: `npm run dev`
4. ✅ Database schema auto-initializes on startup
5. ✅ Test API endpoints with Postman/Insomnia
6. ✅ Check email logs: `SELECT * FROM email_logs;`

## Architecture Notes

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with node-pg
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email**: Zoho Mail API
- **Validation**: Joi
- **HTTP Headers**: Helmet.js
- **CORS**: cors package

### Design Patterns
- MVC (Model-View-Controller) pattern
- Service layer for business logic
- Middleware chain for request processing
- Repository pattern for data access
- Error handling with middleware

### Performance Optimizations
- Database connection pooling
- Query result caching (optional Redis)
- Email retry with exponential backoff
- Indexed database columns
- Compressed HTTP responses

---

**Happy coding! 🚀**
