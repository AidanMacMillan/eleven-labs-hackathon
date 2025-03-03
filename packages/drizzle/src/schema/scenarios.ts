import {jsonb, pgTable, serial, text} from "drizzle-orm/pg-core";

interface ScenarioTask {
    name: string;
    description: string;
    metric: 'completion' | 'progress' | 'percentage';
    metricParams: any;
}

export const scenarios = pgTable("scenarios", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    ambientAudioUrl: text("ambient_audio_url").notNull(),
    backgroundImageUrl: text("background_image_url").notNull(),
    avatarImageUrl: text("avatar_image_url").notNull(),
    visualEffect: text("visual_effect_id"),
    persona: text("persona").notNull(),
    voice: text("voice_id").notNull(),
    language: text("language_id").notNull(),
    tasks: jsonb("tasks").$type<ScenarioTask[]>().default([]).notNull(),
    accentColor: text("accent_color"),
});