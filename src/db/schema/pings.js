import { bigint, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

/** One shared row containing the number of times Onion has been pinged. */
export const globalPingStats = pgTable("global_ping_stats", {
  id: varchar("id", { length: 20 }).primaryKey(),
  total: bigint("total", { mode: "number" }).notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** One row per Discord user who has used the ping command. */
export const userPingStats = pgTable("user_ping_stats", {
  userId: varchar("user_id", { length: 20 }).primaryKey(),
  total: bigint("total", { mode: "number" }).notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
