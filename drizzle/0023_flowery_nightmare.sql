ALTER TABLE "beybladetournamentsoftware_match" RENAME COLUMN "player1" TO "player1_id";--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" RENAME COLUMN "player2" TO "player2_id";--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" DROP CONSTRAINT "beybladetournamentsoftware_match_player1_beybladetournamentsoftware_player_id_fk";
--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" DROP CONSTRAINT "beybladetournamentsoftware_match_player2_beybladetournamentsoftware_player_id_fk";
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
