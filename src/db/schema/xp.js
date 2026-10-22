import { bigint, index, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

export const memberXp = pgTable(
  "member_xp",
  {
    guildId: varchar("guild_id", { length: 20 }).notNull(),
    userId: varchar("user_id", { length: 20 }).notNull(),
    totalXp: bigint("total_xp", { mode: "number" }).notNull().default(0),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.guildId, table.userId] }),
    index("member_xp_rank_index").on(table.guildId, table.totalXp, table.userId),
  ],
);
