import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

let database;
let pool;

export function getDatabase() {
  if (database) return database;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is missing. Add it to your .env file before starting Onion.",
    );
  }

  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  database = drizzle({ client: pool, schema });
  return database;
}

export async function closeDatabase() {
  if (!pool) return;

  await pool.end();
  pool = undefined;
  database = undefined;
}
