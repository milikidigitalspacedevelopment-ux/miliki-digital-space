import dotenv from "dotenv";
import app from "./app.js";
import { testConnection as testPg } from "./config/db.js";
import { initializeDatabase } from "./database/initialize.js";
import { runMigrations } from "./database/migrate.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("🚀 Starting Miliki backend server...\n");

    // Test database connection
    console.log("📡 Testing database connection...");
    await testPg();
    console.log("✅ Database connected successfully!\n");

    // Initialize database schema
    console.log("📦 Initializing database schema...");
    await initializeDatabase();
    await runMigrations();
    console.log("✅ Database schema ready!\n");

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🌐 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`💡 Environment: ${process.env.NODE_ENV || "development"}\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
