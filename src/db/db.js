import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
