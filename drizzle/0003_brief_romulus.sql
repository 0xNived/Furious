CREATE TABLE "guild_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"guild_id" varchar(20) NOT NULL,
	"action" varchar(60) NOT NULL,
	"actor_id" varchar(20),
	"target_id" varchar(20),
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guild_settings" (
	"guild_id" varchar(20) PRIMARY KEY NOT NULL,
	"invite_log_channel_id" varchar(20),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invite_joins" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"guild_id" varchar(20) NOT NULL,
	"user_id" varchar(20) NOT NULL,
	"inviter_id" varchar(20),
	"invite_code" varchar(32),
	"is_fake" boolean DEFAULT false NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"left_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "snipe_history" ADD COLUMN "attachments" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
CREATE INDEX "guild_logs_guild_action_index" ON "guild_logs" USING btree ("guild_id","action","created_at");--> statement-breakpoint
CREATE INDEX "invite_joins_inviter_index" ON "invite_joins" USING btree ("guild_id","inviter_id","joined_at");--> statement-breakpoint
CREATE INDEX "invite_joins_member_index" ON "invite_joins" USING btree ("guild_id","user_id","left_at");