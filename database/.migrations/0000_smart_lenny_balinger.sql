CREATE SCHEMA IF NOT EXISTS "pocket";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pocket"."goals" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"desired_weekly_frequency" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
