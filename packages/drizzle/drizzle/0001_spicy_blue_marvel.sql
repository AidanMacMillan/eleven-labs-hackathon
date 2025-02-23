ALTER TABLE "conversations" ADD COLUMN "task_scores" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios" ADD COLUMN "tasks" jsonb DEFAULT '[]'::jsonb NOT NULL;