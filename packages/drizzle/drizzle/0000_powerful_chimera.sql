CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"scenario_id" serial NOT NULL,
	"message_history" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scenarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"background_image_url" text NOT NULL,
	"visual_effect_id" text,
	"voice_id" text NOT NULL,
	"language_id" text NOT NULL
);
