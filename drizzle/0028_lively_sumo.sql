ALTER TABLE "beybladetournamentsoftware_group_player" ADD COLUMN "event_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_group_player" ADD CONSTRAINT "beybladetournamentsoftware_group_player_event_id_beybladetournamentsoftware_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."beybladetournamentsoftware_event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
