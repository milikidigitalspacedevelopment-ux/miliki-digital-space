import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URI || process.env.PG_URI;

const pool = new Pool({ connectionString });

async function testConnection() {
	const client = await pool.connect();
	try {
		await client.query("SELECT 1");
		console.log("Connected to Postgres");
	} finally {
		client.release();
	}
}

export { pool, testConnection };

export default pool;
