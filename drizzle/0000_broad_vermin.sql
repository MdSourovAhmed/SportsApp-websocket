CREATE TYPE "public"."match_status" AS ENUM('scheduled', 'live', 'finished');--> statement-breakpoint
CREATE TABLE "commentry" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" serial NOT NULL,
	"minute" integer,
	"sequence" integer,
	"sport" text NOT NULL,
	"period" text,
	"event_type" text,
	"actor" text,
	"team" text,
	"message" text NOT NULL,
	"metadata" jsonb,
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"sport" text NOT NULL,
	"home_team" text NOT NULL,
	"away_team" text NOT NULL,
	"status" "match_status" DEFAULT 'scheduled' NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp,
	"home_score" integer DEFAULT 0 NOT NULL,
	"away_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sports_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"match" varchar NOT NULL,
	"score" varchar NOT NULL,
	"event_time" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "commentry" ADD CONSTRAINT "commentry_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;