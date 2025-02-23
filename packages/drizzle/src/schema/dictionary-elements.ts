import {pgTable} from "drizzle-orm/pg-core";
import {text, pgEnum, primaryKey, integer} from "drizzle-orm/pg-core";

// Character can support languages with many characters to learn
export const dictionaryElementsEnum = pgEnum('dictionary_elements_type', ['word', 'character']);

export const dictionaryElements = pgTable('dictionary_elements', {
    language: text("language").notNull(),
    element: text("element").notNull(), // The word or character
    type: dictionaryElementsEnum().default('word').notNull(),
    seenCount: integer("seen_count").default(0).notNull(),
    usedCount: integer("used_count").default(0).notNull(),
}, (table) => [
    primaryKey({ columns: [table.language, table.element, table.type] })
]);