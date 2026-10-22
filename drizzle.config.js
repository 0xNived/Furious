import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to create or run database migrations.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*.js",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL },
});
