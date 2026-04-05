ALTER TABLE "sports_updates" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "sports_updates" CASCADE;--> statement-breakpoint
ALTER TABLE "commentry" ALTER COLUMN "match_id" SET DATA TYPE integer;