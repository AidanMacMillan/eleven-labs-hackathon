import { pgTable, serial, jsonb, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const conversations = pgTable("conversations", {
	id: serial().primaryKey().notNull(),
	scenarioId: serial("scenario_id").notNull(),
	messageHistory: jsonb("message_history").default([]).notNull(),
});

export const scenarios = pgTable("scenarios", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	backgroundImageUrl: text("background_image_url").notNull(),
	visualEffectId: text("visual_effect_id"),
	voiceId: text("voice_id").notNull(),
	languageId: text("language_id").notNull(),
});
