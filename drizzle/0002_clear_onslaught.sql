CREATE TABLE "snipe_history" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"message_id" varchar(20) NOT NULL,
	"guild_id" varchar(20) NOT NULL,
	"channel_id" varchar(20) NOT NULL,
	"requester_id" varchar(20) NOT NULL,
	"author_id" varchar(20) NOT NULL,
	"author_name" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"deleted_at" timestamp with time zone NOT NULL,
	"sniped_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "snipe_history_message_index" ON "snipe_history" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "snipe_history_channel_index" ON "snipe_history" USING btree ("guild_id","channel_id","sniped_at");