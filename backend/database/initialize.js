import fs from "fs";
import path from "path";
import { pool } from "../config/db.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Initialize database with schema
 */
async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    console.log("📦 Initializing database schema...");
    
    // Split by semicolons and filter empty statements
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      try {
        await pool.query(statement);
      } catch (error) {
        // Some errors are expected (like IF NOT EXISTS), so we continue
        if (!error.message.includes("already exists")) {
          console.warn("⚠️  Warning:", error.message);
        }
      }
    }

    console.log("✅ Database schema initialized successfully!");
    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

/**
 * Reset database (DROP all tables)
 * WARNING: This will delete all data!
 */
async function resetDatabase() {
  try {
    console.log("🔄 Resetting database...");
    
    const dropStatements = [
      "DROP TABLE IF EXISTS email_logs CASCADE;",
      "DROP TABLE IF EXISTS assignment_submissions CASCADE;",
      "DROP TABLE IF EXISTS assignments CASCADE;",
      "DROP TABLE IF EXISTS lessons CASCADE;",
      "DROP TABLE IF EXISTS certificates CASCADE;",
      "DROP TABLE IF EXISTS courses CASCADE;",
      "DROP TABLE IF EXISTS programs CASCADE;",
      "DROP TABLE IF EXISTS event_attendees CASCADE;",
      "DROP TABLE IF EXISTS events CASCADE;",
      "DROP TABLE IF EXISTS volunteers CASCADE;",
      "DROP TABLE IF EXISTS volunteer_opportunities CASCADE;",
      "DROP TABLE IF EXISTS blogs CASCADE;",
      "DROP TABLE IF EXISTS stories CASCADE;",
      "DROP TABLE IF EXISTS payments CASCADE;",
      "DROP TABLE IF EXISTS donations CASCADE;",
      "DROP TABLE IF EXISTS campaigns CASCADE;",
      "DROP TABLE IF EXISTS partners CASCADE;",
      "DROP TABLE IF EXISTS reports CASCADE;",
      "DROP TABLE IF EXISTS contacts CASCADE;",
      "DROP TABLE IF EXISTS push_subscriptions CASCADE;",
      "DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;",
      "DROP TABLE IF EXISTS notifications CASCADE;",
      "DROP TABLE IF EXISTS refresh_tokens CASCADE;",
      "DROP TABLE IF EXISTS categories CASCADE;",
      "DROP TABLE IF EXISTS users CASCADE;",
    ];

    for (const statement of dropStatements) {
      try {
        await pool.query(statement);
      } catch (error) {
        if (!error.message.includes("does not exist")) {
          console.warn("⚠️  Warning:", error.message);
        }
      }
    }

    console.log("✅ Database reset successfully!");
    
    // Re-initialize with schema
    await initializeDatabase();
    return true;
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    throw error;
  }
}

/**
 * Seed database with sample data
 */
async function seedDatabase() {
  try {
    console.log("🌱 Seeding database with sample data...");

    // Create sample categories
    const categories = [
      { name: "Technology", slug: "technology", color: "#3B82F6" },
      { name: "Business", slug: "business", color: "#10B981" },
      { name: "Health", slug: "health", color: "#EF4444" },
      { name: "Education", slug: "education", color: "#F59E0B" },
      { name: "Community", slug: "community", color: "#8B5CF6" },
    ];

    for (const category of categories) {
      await pool.query(
        `
        INSERT INTO categories (name, slug, color)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING
        `,
        [category.name, category.slug, category.color]
      );
    }

    console.log("✅ Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
}

/**
 * Check database connection and schema
 */
async function checkDatabase() {
  try {
    console.log("🔍 Checking database connection...");
    
    const result = await pool.query("SELECT 1");
    console.log("✅ Database connection successful!");

    // Check if tables exist
    const tableCheck = await pool.query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const tableCount = tableCheck.rows[0].table_count;
    console.log(`📊 Database has ${tableCount} tables`);

    if (tableCount === 0) {
      console.log("⚠️  No tables found. Running initialization...");
      await initializeDatabase();
    }

    return true;
  } catch (error) {
    console.error("❌ Database check failed:", error);
    throw error;
  }
}

export {
  initializeDatabase,
  resetDatabase,
  seedDatabase,
  checkDatabase,
};
