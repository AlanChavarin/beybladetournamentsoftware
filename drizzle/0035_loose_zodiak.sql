ALTER TABLE "beybladetournamentsoftware_event_player" ADD COLUMN "number_of_wins" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event_player" ADD COLUMN "total_weight_of_wins_based_on_opponent_wins" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event_player" ADD COLUMN "total_weight_of_wins_based_on_score" integer DEFAULT 0;