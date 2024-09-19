ALTER TABLE "beybladetournamentsoftware_player" DROP CONSTRAINT "beybladetournamentsoftware_player_group_id_beybladetournamentsoftware_group_id_fk";
--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_player" DROP COLUMN IF EXISTS "group_id";