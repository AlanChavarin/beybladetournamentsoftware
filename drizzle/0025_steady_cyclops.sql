CREATE TABLE IF NOT EXISTS "beybladetournamentsoftware_match" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"player1_id" integer,
	"player2_id" integer,
	"player1_score" integer DEFAULT 0,
	"player2_score" integer DEFAULT 0,
	"winner" integer,
	"round" integer,
	"table" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_match" ADD CONSTRAINT "beybladetournamentsoftware_match_event_id_beybladetournamentsoftware_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."beybladetournamentsoftware_event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_match" ADD CONSTRAINT "beybladetournamentsoftware_match_player1_id_beybladetournamentsoftware_player_id_fk" FOREIGN KEY ("player1_id") REFERENCES "public"."beybladetournamentsoftware_player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_match" ADD CONSTRAINT "beybladetournamentsoftware_match_player2_id_beybladetournamentsoftware_player_id_fk" FOREIGN KEY ("player2_id") REFERENCES "public"."beybladetournamentsoftware_player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_match" ADD CONSTRAINT "beybladetournamentsoftware_match_winner_beybladetournamentsoftware_player_id_fk" FOREIGN KEY ("winner") REFERENCES "public"."beybladetournamentsoftware_player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
