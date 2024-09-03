ALTER TABLE "beybladetournamentsoftware_event" ALTER COLUMN "players" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event" ALTER COLUMN "groups" SET DATA TYPE varchar(2);--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_event" ALTER COLUMN "groups" DROP NOT NULL;