-- Postgres schema for Miliki - Community Empowerment Platform

-- Enable UUID generation (requires pgcrypto or uuid-ossp)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS & AUTHENTICATION
-- ==========================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	role TEXT NOT NULL DEFAULT 'student',
	is_verified BOOLEAN DEFAULT FALSE,
	is_active BOOLEAN DEFAULT TRUE,
	profile JSONB,
	avatar_url TEXT,
	phone TEXT,
	bio TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	token TEXT NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- COMMUNICATION & NOTIFICATIONS
-- ==========================================

-- Email logs
CREATE TABLE IF NOT EXISTS email_logs (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	to_email TEXT NOT NULL,
	subject TEXT NOT NULL,
	message TEXT,
	status TEXT NOT NULL DEFAULT 'pending',
	type TEXT DEFAULT 'normal',
	error TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	message TEXT NOT NULL,
	type TEXT DEFAULT 'info',
	is_read BOOLEAN DEFAULT FALSE,
	action_url TEXT,
	meta JSONB,
	created_at TIMESTAMPTZ DEFAULT now()
);

-- Push subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	endpoint TEXT NOT NULL UNIQUE,
	auth TEXT NOT NULL,
	p256dh TEXT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	email TEXT NOT NULL UNIQUE,
	name TEXT,
	is_subscribed BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- LEARNING CONTENT
-- ==========================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL UNIQUE,
	description TEXT,
	slug TEXT NOT NULL UNIQUE,
	icon TEXT,
	color TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Programs
CREATE TABLE IF NOT EXISTS programs (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL,
	description TEXT,
	category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
	created_by UUID REFERENCES users(id) ON DELETE SET NULL,
	status TEXT DEFAULT 'draft',
	start_date DATE,
	end_date DATE,
	image_url TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);


-- Courses
CREATE TABLE IF NOT EXISTS courses (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	description TEXT,
	instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
	category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
	level TEXT DEFAULT 'beginner',
	status TEXT DEFAULT 'draft',
	duration_hours INTEGER,
	image_url TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	description TEXT,
	content TEXT,
	order_position INTEGER,
	video_url TEXT,
	resources JSONB,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	description TEXT,
	due_date DATE,
	max_score INTEGER DEFAULT 100,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assignment submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	submission_text TEXT,
	submission_url TEXT,
	score INTEGER,
	feedback TEXT,
	submitted_at TIMESTAMPTZ,
	graded_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now(),
	UNIQUE(assignment_id, user_id)
);

-- ==========================================
-- CERTIFICATIONS
-- ==========================================

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	certificate_number TEXT NOT NULL UNIQUE,
	issue_date DATE NOT NULL,
	expiry_date DATE,
	file_url TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	UNIQUE(course_id, user_id)
);

-- ==========================================
-- EVENTS & ACTIVITIES
-- ==========================================

-- Events
CREATE TABLE IF NOT EXISTS events (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL,
	description TEXT,
	category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
	organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
	status TEXT DEFAULT 'draft',
	start_date TIMESTAMPTZ NOT NULL,
	end_date TIMESTAMPTZ,
	location TEXT,
	max_attendees INTEGER,
	image_url TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event attendees
CREATE TABLE IF NOT EXISTS event_attendees (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	event_id UUID REFERENCES events(id) ON DELETE CASCADE,
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	status TEXT DEFAULT 'registered',
	created_at TIMESTAMPTZ DEFAULT now(),
	UNIQUE(event_id, user_id)
);

-- ==========================================
-- VOLUNTEERING
-- ==========================================

-- Volunteer opportunities
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL,
	description TEXT,
	organization TEXT,
	location TEXT,
	category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
	status TEXT DEFAULT 'active',
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Volunteers
CREATE TABLE IF NOT EXISTS volunteers (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID REFERENCES users(id) ON DELETE CASCADE,
	opportunity_id UUID REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
	hours_contributed DECIMAL(10,2) DEFAULT 0,
	status TEXT DEFAULT 'active',
	started_at DATE,
	ended_at DATE,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now(),
	UNIQUE(user_id, opportunity_id)
);

-- ==========================================
-- CONTENT & BLOGGING
-- ==========================================

-- Blog posts
CREATE TABLE IF NOT EXISTS blogs (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	content TEXT NOT NULL,
	author_id UUID REFERENCES users(id) ON DELETE SET NULL,
	author_name TEXT,
	category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
	status TEXT DEFAULT 'draft',
	featured_image TEXT,
	likes INTEGER DEFAULT 0,
	views INTEGER DEFAULT 0,
	featured BOOLEAN DEFAULT FALSE,
	published_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE IF NOT EXISTS blogs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Stories
CREATE TABLE IF NOT EXISTS stories (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL,
	content TEXT NOT NULL,
	author_id UUID REFERENCES users(id) ON DELETE SET NULL,
	category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
	image_url TEXT,
	status TEXT DEFAULT 'draft',
	published_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- PARTNERSHIPS & CAMPAIGNS
-- ==========================================

-- Partners
CREATE TABLE IF NOT EXISTS partners (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL UNIQUE,
	description TEXT,
	website TEXT,
	contact_email TEXT,
	status TEXT DEFAULT 'active',
	logo_url TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL,
	description TEXT,
	goal_amount DECIMAL(10,2),
	raised_amount DECIMAL(10,2) DEFAULT 0,
	status TEXT DEFAULT 'draft',
	start_date DATE,
	end_date DATE,
	image_url TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- DONATIONS & PAYMENTS
-- ==========================================

-- Donations
CREATE TABLE IF NOT EXISTS donations (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	donor_id UUID REFERENCES users(id) ON DELETE SET NULL,
	campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
	amount DECIMAL(10,2) NOT NULL,
	currency TEXT DEFAULT 'KES',
	message TEXT,
	payment_method TEXT DEFAULT 'Mpesa',
	is_anonymous BOOLEAN DEFAULT FALSE,
	status TEXT DEFAULT 'pending',
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID REFERENCES users(id) ON DELETE SET NULL,
	donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
	amount DECIMAL(10,2) NOT NULL,
	currency TEXT DEFAULT 'KES',
	payment_method TEXT NOT NULL,
	transaction_id TEXT UNIQUE,
	status TEXT DEFAULT 'pending',
	reference TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- CONTENT MODERATION
-- ==========================================

-- Reports
CREATE TABLE IF NOT EXISTS reports (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
	subject_type TEXT NOT NULL,
	subject_id UUID NOT NULL,
	reason TEXT NOT NULL,
	description TEXT,
	status TEXT DEFAULT 'open',
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contacts/Messages
CREATE TABLE IF NOT EXISTS contacts (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	subject TEXT NOT NULL,
	message TEXT NOT NULL,
	status TEXT DEFAULT 'new',
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Refresh tokens
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Push subscriptions
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- Categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Courses
CREATE INDEX IF NOT EXISTS idx_courses_program_id ON courses(program_id);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);

-- Lessons
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);

-- Assignments
CREATE INDEX IF NOT EXISTS idx_assignments_lesson_id ON assignments(lesson_id);

-- Assignment submissions
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_user_id ON assignment_submissions(user_id);

-- Certificates
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(category_id);

-- Event attendees
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);

-- Volunteers
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON volunteers(user_id);

-- Blogs
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- Stories
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);

-- Donations
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_donation_id ON payments(donation_id);

-- Reports
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
