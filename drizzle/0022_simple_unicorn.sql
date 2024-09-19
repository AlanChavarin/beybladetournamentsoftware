CREATE TABLE IF NOT EXISTS "beybladetournamentsoftware_event_player" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"player_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "beybladetournamentsoftware_group_player" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer,
	"player_id" integer
);
--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_player" DROP CONSTRAINT "beybladetournamentsoftware_player_event_id_beybladetournamentsoftware_event_id_fk";
--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" ALTER COLUMN "player1" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" ALTER COLUMN "player2" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" ALTER COLUMN "winner" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" ALTER COLUMN "winner" DROP DEFAULT;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_event_player" ADD CONSTRAINT "beybladetournamentsoftware_event_player_event_id_beybladetournamentsoftware_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."beybladetournamentsoftware_event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_event_player" ADD CONSTRAINT "beybladetournamentsoftware_event_player_player_id_beybladetournamentsoftware_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."beybladetournamentsoftware_player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_group_player" ADD CONSTRAINT "beybladetournamentsoftware_group_player_group_id_beybladetournamentsoftware_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."beybladetournamentsoftware_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_group_player" ADD CONSTRAINT "beybladetournamentsoftware_group_player_player_id_beybladetournamentsoftware_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."beybladetournamentsoftware_player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_match" ADD CONSTRAINT "beybladetournamentsoftware_match_player1_beybladetournamentsoftware_player_id_fk" FOREIGN KEY ("player1") REFERENCES "public"."beybladetournamentsoftware_player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_match" ADD CONSTRAINT "beybladetournamentsoftware_match_player2_beybladetournamentsoftware_player_id_fk" FOREIGN KEY ("player2") REFERENCES "public"."beybladetournamentsoftware_player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_match" ADD CONSTRAINT "beybladetournamentsoftware_match_winner_beybladetournamentsoftware_player_id_fk" FOREIGN KEY ("winner") REFERENCES "public"."beybladetournamentsoftware_player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event" DROP COLUMN IF EXISTS "players";--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_group" DROP COLUMN IF EXISTS "players";--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" DROP COLUMN IF EXISTS "weight_of_win_based_on_opponent_wins";--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" DROP COLUMN IF EXISTS "weight_of_win_based_on_score";--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_player" DROP COLUMN IF EXISTS "event_id";