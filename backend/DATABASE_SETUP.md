# Miliki Backend - Database Setup Guide

## Overview

This document provides instructions for setting up and managing the Miliki backend database.

## Prerequisites

- PostgreSQL 12 or higher
- Node.js 18 or higher
- npm or yarn package manager

## Environment Setup

1. Copy `.env.example` to `.env` (if it exists):
```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/miliki_db
```

## Database Connection Formats

The application supports multiple connection string formats:

```env
# PostgreSQL standard format
DATABASE_URL=postgresql://user:password@host:port/database

# Supabase format
DATABASE_URL=postgresql://postgres:password@db.region.supabase.co:5432/postgres

# Alternative formats
POSTGRES_URI=postgresql://user:password@host:port/database
PG_URI=postgresql://user:password@host:port/database
```

## Automatic Schema Initialization

The schema is automatically initialized when the server starts. The `server.js` file:

1. Tests the database connection
2. Runs the schema initialization
3. Creates all tables with proper indexes

No manual SQL execution is needed!

## Manual Database Management

If you need to manage the database manually, use the provided `initialize.js` utilities:

```javascript
import {
  initializeDatabase,
  resetDatabase,
  seedDatabase,
  checkDatabase,
} from "./database/initialize.js";

// Initialize schema
await initializeDatabase();

// Reset database (WARNING: Deletes all data)
await resetDatabase();

// Seed with sample data
await seedDatabase();

// Check database status
await checkDatabase();
```

## Database Schema

### Tables Overview

#### Users & Authentication
- **users** - User accounts with roles and profiles
- **refresh_tokens** - JWT refresh token management

#### Communication
- **email_logs** - Email delivery tracking
- **notifications** - In-app user notifications
- **push_subscriptions** - Web push notification subscriptions
- **newsletter_subscriptions** - Email newsletter subscriptions

#### Learning Content
- **categories** - Course/content categories
- **programs** - Learning programs
- **courses** - Individual courses within programs
- **lessons** - Course lessons
- **assignments** - Lesson assignments
- **assignment_submissions** - Student assignment submissions

#### Certifications
- **certificates** - Course completion certificates

#### Events
- **events** - Community events
- **event_attendees** - Event registration/attendance

#### Volunteering
- **volunteer_opportunities** - Volunteer positions
- **volunteers** - Volunteer registrations

#### Content
- **blogs** - Blog posts
- **stories** - Community stories

#### Partnerships & Campaigns
- **partners** - Partner organizations
- **campaigns** - Fundraising/awareness campaigns

#### Donations & Payments
- **donations** - Donation records
- **payments** - Payment transactions

#### Moderation
- **reports** - Content reports
- **contacts** - Contact form submissions

## Key Features

### User Roles
- `admin` - Full system access
- `trainer` - Can create courses and manage students
- `student` - Can enroll in courses
- `volunteer` - Can participate in volunteering
- `donor` - Can make donations
- `partner` - Partner organization account
- `public` - Limited access user

### Timestamps
All tables include:
- `created_at` - Creation timestamp (UTC)
- `updated_at` - Last update timestamp (UTC)

### UUIDs
All primary keys use UUID v4 for distributed system compatibility.

## Indexes

Comprehensive indexes are created for:
- Foreign key references
- Search fields (email, slug)
- Status and status tracking fields
- Timestamp fields for range queries

This ensures optimal query performance for:
- User lookups by email
- Post lookups by slug
- Status filtering
- Temporal queries

## Email Logging

All emails are logged in the `email_logs` table with:
- Recipient email
- Subject and message content
- Delivery status (sent, failed, pending)
- Email type (verification, password-reset, notification, etc.)
- Error messages if delivery failed

## Backups

### Regular Backups

```bash
# Backup the entire database
pg_dump -U username -h localhost miliki_db > backup.sql

# Backup specific table
pg_dump -U username -h localhost -t users miliki_db > users_backup.sql
```

### Restore from Backup

```bash
# Restore entire database
psql -U username -h localhost miliki_db < backup.sql

# Restore specific table
psql -U username -h localhost miliki_db < users_backup.sql
```

## Troubleshooting

### Connection Issues

1. **Cannot connect to database**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env
   - Ensure database exists

2. **Authentication failed**
   - Verify username and password
   - Check if user has database creation permissions

### Schema Issues

1. **Tables not created**
   - Check server logs for initialization errors
   - Manually run `initializeDatabase()`
   - Check database user permissions

2. **Foreign key errors**
   - Ensure all referenced tables exist
   - Check constraint dependencies

## Performance Tips

1. **Regular Index Maintenance**
   ```sql
   ANALYZE;
   VACUUM ANALYZE;
   ```

2. **Monitor Query Performance**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
   ```

3. **Connection Pooling**
   - Database connection pooling is handled by pg library
   - Configure in config/db.js if needed

## Security Best Practices

1. **Credentials**
   - Never commit .env to version control
   - Use strong database passwords
   - Rotate credentials periodically

2. **Backups**
   - Store backups securely
   - Test restore procedures regularly
   - Keep backups in multiple locations

3. **Access Control**
   - Limit database user permissions
   - Use different credentials for different environments
   - Audit database access logs

## Migration Guide

When adding new tables or modifying schema:

1. Update `database/schema.sql`
2. Add migration file to `database/migrations/` (naming: YYYY-MM-DD-description.sql)
3. Restart the server to apply changes
4. Test thoroughly before production deployment

## Support

For database-related issues:
1. Check server logs: `npm run dev`
2. Review schema in `database/schema.sql`
3. Verify environment variables in `.env`
4. Check PostgreSQL logs for detailed errors
