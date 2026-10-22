CREATE TABLE "member_xp" (
	"guild_id" varchar(20) NOT NULL,
	"user_id" varchar(20) NOT NULL,
	"total_xp" bigint DEFAULT 0 NOT NULL,
	"last_activity_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "member_xp_guild_id_user_id_pk" PRIMARY KEY("guild_id","user_id")
);
--> statement-breakpoint
CREATE INDEX "member_xp_rank_index" ON "member_xp" USING btree ("guild_id","total_xp","user_id");