import {
  bigserial,
  boolean,
  index,
  jsonb,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const guildSettings = pgTable("guild_settings", {
  guildId: varchar("guild_id", { length: 20 }).primaryKey(),
  inviteLogChannelId: varchar("invite_log_channel_id", { length: 20 }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const guildLogs = pgTable(
  "guild_logs",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    guildId: varchar("guild_id", { length: 20 }).notNull(),
    action: varchar("action", { length: 60 }).notNull(),
    actorId: varchar("actor_id", { length: 20 }),
    targetId: varchar("target_id", { length: 20 }),
    details: jsonb("details").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("guild_logs_guild_action_index").on(table.guildId, table.action, table.createdAt)],
);

export const inviteJoins = pgTable(
  "invite_joins",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    guildId: varchar("guild_id", { length: 20 }).notNull(),
    userId: varchar("user_id", { length: 20 }).notNull(),
    inviterId: varchar("inviter_id", { length: 20 }),
    inviteCode: varchar("invite_code", { length: 32 }),
    isFake: boolean("is_fake").notNull().default(false),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    leftAt: timestamp("left_at", { withTimezone: true }),
  },
  (table) => [
    index("invite_joins_inviter_index").on(table.guildId, table.inviterId, table.joinedAt),
    index("invite_joins_member_index").on(table.guildId, table.userId, table.leftAt),
  ],
);
