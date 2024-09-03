CREATE TABLE IF NOT EXISTS "beybladetournamentsoftware_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"group_letter" varchar(256),
	"players" text[] DEFAULT '{}'::text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "beybladetournamentsoftware_player" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"event_id" integer,
	"group_id" integer,
	"number_of_wins" integer DEFAULT 0,
	"total_weight_of_wins_based_on_opponent_wins" integer DEFAULT 0,
	"total_weight_of_wins_based_on_score" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event" RENAME COLUMN "groups" TO "num_of_groups";--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event" ADD COLUMN "how_many_from_each_group_advance" integer DEFAULT 2;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" ADD COLUMN "weight_of_win_based_on_opponent_wins" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" ADD COLUMN "weight_of_win_based_on_score" integer DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_group" ADD CONSTRAINT "beybladetournamentsoftware_group_event_id_beybladetournamentsoftware_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."beybladetournamentsoftware_event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_player" ADD CONSTRAINT "beybladetournamentsoftware_player_event_id_beybladetournamentsoftware_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."beybladetournamentsoftware_event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_player" ADD CONSTRAINT "beybladetournamentsoftware_player_group_id_beybladetournamentsoftware_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."beybladetournamentsoftware_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
