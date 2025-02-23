CREATE TYPE "public"."dictionary_elements_type" AS ENUM('word', 'character');--> statement-breakpoint
CREATE TABLE "dictionary_elements" (
	"language" text NOT NULL,
	"element" text NOT NULL,
	"type" "dictionary_elements_type" DEFAULT 'word' NOT NULL,
	"has_heard" boolean DEFAULT false NOT NULL,
	"has_seen" boolean DEFAULT false NOT NULL,
	CONSTRAINT "dictionary_elements_language_element_type_pk" PRIMARY KEY("language","element","type")
);
