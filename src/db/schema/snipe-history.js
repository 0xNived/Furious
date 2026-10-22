import {
  bigserial,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const snipeHistory = pgTable(
  "snipe_history",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    messageId: varchar("message_id", { length: 20 }).notNull(),
    guildId: varchar("guild_id", { length: 20 }).notNull(),
    channelId: varchar("channel_id", { length: 20 }).notNull(),
    requesterId: varchar("requester_id", { length: 20 }).notNull(),
    authorId: varchar("author_id", { length: 20 }).notNull(),
    authorName: varchar("author_name", { length: 100 }).notNull(),
    content: text("content").notNull(),
    attachments: jsonb("attachments").notNull().default([]),
    deletedAt: timestamp("deleted_at", { withTimezone: true }).notNull(),
    snipedAt: timestamp("sniped_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("snipe_history_message_index").on(table.messageId),
    index("snipe_history_channel_index").on(table.guildId, table.channelId, table.snipedAt),
  ],
);
