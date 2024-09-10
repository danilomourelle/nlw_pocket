CREATE TABLE IF NOT EXISTS "pocket"."goal_completions" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pocket"."goal_completions" ADD CONSTRAINT "goal_completions_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "pocket"."goals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
