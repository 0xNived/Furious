CREATE TABLE "global_ping_stats" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"total" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_ping_stats" (
	"user_id" varchar(20) PRIMARY KEY NOT NULL,
	"total" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
