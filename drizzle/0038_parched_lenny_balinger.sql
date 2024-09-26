DROP TABLE "beybladetournamentsoftware_event_player";--> statement-breakpoint
DROP TABLE "beybladetournamentsoftware_group_player";--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_group" ALTER COLUMN "event_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_player" ADD COLUMN "event_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_player" ADD COLUMN "group_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_player" ADD COLUMN "number_of_wins" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "beybladetournamentsoftware_player" ADD COLUMN "total_score" integer DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_player" ADD CONSTRAINT "beybladetournamentsoftware_player_event_id_beybladetournamentsoftware_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."beybladetournamentsoftware_event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_player" ADD CONSTRAINT "beybladetournamentsoftware_player_group_id_beybladetournamentsoftware_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."beybladetournamentsoftware_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
