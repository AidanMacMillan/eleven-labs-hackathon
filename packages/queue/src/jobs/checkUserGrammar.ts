import {Jobs} from "../main.ts";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {db} from "drizzle/src/db.ts";
import {eq} from "drizzle-orm";
import {schema} from "drizzle/src/schema.ts";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import {getFriendlyMessageHistory} from "../shared/getFriendlyMessageHistory.ts";
import {pusher} from "../pusher.ts";

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    maxOutputTokens: 2048,
    apiKey: process.env.GEMINI_API_KEY
});

interface GrammarWarningResponse {
    name?: string;
    description?: string;
    level?: string;
}

const grammarWarningsFormat = [
    {
        name: '<short name desribing the warning>',
        description: '<detailed description of the warning, which explains how the warning applied to the specific user message>',
        level: "<'info' | 'warning' | 'error', which indicates the severity of the warning>"
    },
    '...'
]

export async function checkUserGrammar(data: Jobs['check-user-grammar']) {
    const conversation = await db.query.conversations.findFirst({
        where: eq(schema.conversations.id, data.conversationId),
        columns: {
            messageHistory: true,
            grammarWarnings: true,
        }
    });

    if (!conversation) {
        return;
    }

    const userMessage = conversation.messageHistory[data.messageIndex];

    if (!userMessage) {
        return;
    }

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You are a system which is given a conversation history, between the user and an ai assistant, and a specific user's message taken from that history. You will output a list of grammar/language warnings with the user's message in context of the conversation, if there are any. The user message is a transcript of speech and therefore ONLY include grammar/language warnings related to spoken speech, IGNORE punctuation when analyzing the user's message. Try to be as concise as possible in both number of warnings and their descriptions. You MUST only output the following VALID JSON format: {format}"],
        ["user", "<chat_history>{chat_history}</chat_history>\n\n<specific_user_message>{user_message}</specific_user_message>\n\nGrammar/language warnings JSON:"],
    ]);

    const prompt = await promptTemplate.invoke({
        chat_history: getFriendlyMessageHistory(conversation.messageHistory),
        user_message: userMessage.content,
        format: JSON.stringify(grammarWarningsFormat)
    });

    const response = await model.invoke(prompt);

    const parser = new JsonOutputParser<GrammarWarningResponse[]>();
    const parsed = await parser.parse(response.content as string);

    if (!parsed || !parsed.length) {
        return;
    }

    const currentWarnings = conversation.grammarWarnings;
    const newWarnings = [];

    parsed.forEach(warning => {
        if (!warning.description) {
            return;
        }
        let level = 'warning';
        if (warning.level === 'error') {
            level = 'error';
        }
        else if (warning.level === 'info') {
            level = 'info';
        }
        newWarnings.push({
            name: warning.name ?? 'Grammar/language warning',
            description: warning.description,
            level: level as any,
            messageIndex: data.messageIndex
        });
    })

    if (newWarnings.length) {
        const asyncPromises = [];
        asyncPromises.push(
            pusher.trigger(`conversations-${data.conversationId}`, 'grammar-warnings:added', {
                newWarnings,
            })
        );
        asyncPromises.push(
            db.update(schema.conversations).set({
                grammarWarnings: [...currentWarnings, ...newWarnings]
            }).where(eq(schema.conversations.id, data.conversationId))
        );

        await Promise.all(asyncPromises);
    }
}