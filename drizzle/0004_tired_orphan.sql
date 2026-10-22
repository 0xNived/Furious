CREATE TABLE "warnings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"guild_id" varchar(20) NOT NULL,
	"user_id" varchar(20) NOT NULL,
	"moderator_id" varchar(20) NOT NULL,
	"reason" varchar(500) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "warnings_guild_member_index" ON "warnings" USING btree ("guild_id","user_id","created_at");