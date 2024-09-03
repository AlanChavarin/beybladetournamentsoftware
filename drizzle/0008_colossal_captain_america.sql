ALTER TABLE "beybladetournamentsoftware_event" ALTER COLUMN "players" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event" ALTER COLUMN "groups" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event" ALTER COLUMN "groups" SET NOT NULL;