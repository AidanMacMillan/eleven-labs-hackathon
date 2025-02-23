import {jsonb, pgTable, serial} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {scenarios} from "./scenarios";

export type MessageHistory = {
    role: string;
    content: string;
}[];

type GrammarWarnings = {
    name: string;
    description: string;
    level: 'info' | 'warning' | 'error';
    messageIndex: number;
};

export const conversations = pgTable("conversations", {
    id: serial("id").primaryKey(),
    scenarioId: serial("scenario_id"),
    messageHistory: jsonb("message_history").$type<MessageHistory>().default([]).notNull(),
    taskScores: jsonb("task_scores").$type<number[]>().default([]).notNull(),
    grammarWarnings: jsonb("grammar_warnings").$type<GrammarWarnings[]>().default([]).notNull(),
});

export const conversationsRelations = relations(conversations, ({one}) => ({
    scenario: one(scenarios, {
        fields: [conversations.scenarioId],
        references: [scenarios.id]
    })
}));