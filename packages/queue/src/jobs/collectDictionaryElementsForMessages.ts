import {Jobs} from "../main.ts";
import {db} from "drizzle/src/db.ts";
import {and, eq} from "drizzle-orm";
import {schema} from "drizzle/src/schema.ts";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {JsonOutputParser} from "@langchain/core/output_parsers";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    maxOutputTokens: 2048,
    apiKey: process.env.GEMINI_API_KEY
});

export async function collectDictionaryElementsForMessages(data: Jobs['collect-dictionary-elements-for-messages']) {
    console.log('collecting dictionary elements for messages', data);
    const conversation = await db.query.conversations.findFirst({
        where: eq(schema.conversations.id, data.conversationId),
        with: {
            scenario: {
                columns: {
                    language: true
                }
            }
        },
        columns: {
            messageHistory: true,
            grammarWarnings: true,
        }
    });

    if (!conversation) {
        return;
    }

    const userMessage = conversation.messageHistory[data.userMessageIndex];
    const assistantMessage = conversation.messageHistory[data.assistantMessageIndex];

    if (!userMessage || !assistantMessage) {
        return;
    }

    const messagePromises = [];
    messagePromises.push(collectWordsForMessage(userMessage.content, conversation.scenario.language, true));
    messagePromises.push(collectWordsForMessage(assistantMessage.content, conversation.scenario.language, false));

    await Promise.all(messagePromises);
}

async function collectWordsForMessage(message: string, language: string, userMessage: boolean) {
    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You are a system which is given a message in any language. You must return an array of all the words that are in the message. Do not change the conjugation of the words just output them as is. Contractions and hyphenated words are considered a valid single word. Do not include punctuation like ('?', '!', ',') in the words. Output the words in a JSON array."],
        ["user", "<message>{message}</message>\n\nJSON array of words:"],
    ]);

    const prompt = await promptTemplate.invoke({
        message: message
    });

    const response = await model.invoke(prompt);
    const parser = new JsonOutputParser<string[]>();

    const parsed = await parser.parse(response.content as string);

    if (!parsed || !parsed.length) {
        return;
    }

    const valid = parsed.filter(word => word.length > 1);

    if (!valid.length) {
        return;
    }

    const wordPromises = [];
    console.log(valid);

    for (const word of valid) {
        wordPromises.push(updateForWord(word, language, userMessage));
    }

    await Promise.all(wordPromises);
}


async function updateForWord(word: string, language: string, userMessage: boolean) {
    const values = {
        language: language,
        element: word.toLowerCase(),
        type: 'word',
    };

    const existingElement = await db.query.dictionaryElements.findFirst({
        where: and(
            eq(schema.dictionaryElements.language, values.language),
            eq(schema.dictionaryElements.element, values.element),
            eq(schema.dictionaryElements.type, values.type as any)
        )
    });

    if (!existingElement) {
        const update: any = {};
        if (userMessage) {
            update.usedCount = 1;
        } else {
            update.seenCount = 0;
        }

        await db.insert(schema.dictionaryElements).values({ ...values, ...update });
    } else {
        const update: any = {};
        if (userMessage) {
            update.usedCount = existingElement.usedCount + 1;
        } else {
            update.seenCount = existingElement.seenCount + 1;
        }

        await db.update(schema.dictionaryElements).set(update).where(
            and(
                eq(schema.dictionaryElements.language, values.language),
                eq(schema.dictionaryElements.element, values.element),
                eq(schema.dictionaryElements.type, values.type as any)
            )
        );
    }
}

