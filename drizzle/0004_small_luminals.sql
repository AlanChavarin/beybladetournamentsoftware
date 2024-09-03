CREATE TABLE IF NOT EXISTS "beybladetournamentsoftware_match" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"player1" varchar(256),
	"player2" varchar(256),
	"player1_score" integer DEFAULT 0,
	"player2_score" integer DEFAULT 0,
	"winner" varchar(256) DEFAULT '',
	"round" integer,
	"table" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_match" ADD CONSTRAINT "beybladetournamentsoftware_match_event_id_beybladetournamentsoftware_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."beybladetournamentsoftware_event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
