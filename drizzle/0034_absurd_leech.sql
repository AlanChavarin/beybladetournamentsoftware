ALTER TABLE "beybladetournamentsoftware_match" DROP CONSTRAINT "beybladetournamentsoftware_match_winner_beybladetournamentsoftware_player_id_fk";
--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_match" DROP COLUMN IF EXISTS "winner";