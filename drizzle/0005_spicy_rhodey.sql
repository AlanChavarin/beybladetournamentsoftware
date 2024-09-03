ALTER TABLE "beybladetournamentsoftware_event" ALTER COLUMN "players" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event" ALTER COLUMN "players" SET DEFAULT '{}'::text[];--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event" ALTER COLUMN "players" SET NOT NULL;