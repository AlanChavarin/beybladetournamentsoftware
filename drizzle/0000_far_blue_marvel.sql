CREATE TABLE IF NOT EXISTS "beybladetournamentsoftware_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"date" timestamp with time zone,
	"location" varchar(256),
	"time" timestamp with time zone,
	"check_in_time" timestamp with time zone,
	"deck_list_requirement" "deck_list_requirement",
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "beybladetournamentsoftware_event" ("name");