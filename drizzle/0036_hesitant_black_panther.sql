ALTER TABLE "beybladetournamentsoftware_player" ADD COLUMN "total_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_player" DROP COLUMN IF EXISTS "total_weight_of_wins_based_on_opponent_wins";--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_player" DROP COLUMN IF EXISTS "total_weight_of_wins_based_on_score";