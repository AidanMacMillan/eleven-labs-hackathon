ALTER TABLE "dictionary_elements" ADD COLUMN "seen_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "dictionary_elements" ADD COLUMN "used_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "dictionary_elements" DROP COLUMN "has_heard";--> statement-breakpoint
ALTER TABLE "dictionary_elements" DROP COLUMN "has_seen";