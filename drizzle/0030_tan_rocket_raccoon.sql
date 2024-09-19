ALTER TABLE "beybladetournamentsoftware_group_player" ALTER COLUMN "group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_group_player" ALTER COLUMN "player_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_group_player" ALTER COLUMN "event_id" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "group_player_unique_idx" ON "beybladetournamentsoftware_group_player" ("group_id","player_id");