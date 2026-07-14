import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const migrationsDirectory = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "migrations"
);

export async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query("SELECT pg_advisory_lock(hashtext($1))", ["miliki_database_migrations"]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const files = (await fs.readdir(migrationsDirectory))
      .filter((file) => file.endsWith(".sql"))
      .sort();
    const appliedResult = await client.query("SELECT name FROM schema_migrations");
    const applied = new Set(appliedResult.rows.map(({ name }) => name));

    for (const file of files) {
      if (applied.has(file)) continue;

      const migration = await fs.readFile(path.join(migrationsDirectory, file), "utf8");

      await client.query("BEGIN");
      try {
        await client.query(migration);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.log(`Applied migration: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${file} failed: ${error.message}`);
      }
    }
  } finally {
    try {
      await client.query("SELECT pg_advisory_unlock(hashtext($1))", ["miliki_database_migrations"]);
    } finally {
      client.release();
    }
  }
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  runMigrations()
    .then(() => console.log("Database migrations are up to date."))
    .catch((error) => {
      console.error("Failed to run migrations:", error.message);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
