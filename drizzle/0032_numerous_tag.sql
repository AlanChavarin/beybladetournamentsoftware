ALTER TABLE "beybladetournamentsoftware_match" ADD COLUMN "group_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beybladetournamentsoftware_match" ADD CONSTRAINT "beybladetournamentsoftware_match_group_id_beybladetournamentsoftware_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."beybladetournamentsoftware_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
