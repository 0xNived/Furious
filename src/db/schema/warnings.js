import { bigserial, index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const warnings = pgTable(
  "warnings",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    guildId: varchar("guild_id", { length: 20 }).notNull(),
    userId: varchar("user_id", { length: 20 }).notNull(),
    moderatorId: varchar("moderator_id", { length: 20 }).notNull(),
    reason: varchar("reason", { length: 500 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("warnings_guild_member_index").on(table.guildId, table.userId, table.createdAt)],
);
