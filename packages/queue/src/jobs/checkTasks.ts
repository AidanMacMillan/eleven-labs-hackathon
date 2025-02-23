import {Jobs} from "../main";
import {db} from "drizzle/src/db.ts";
import {schema} from "drizzle/src/schema.ts";
import {eq} from "drizzle-orm";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {MessageHistory} from "drizzle/src/schema/conversations.ts";
import {pusher} from "../pusher.ts";

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    maxOutputTokens: 2048,
    apiKey: process.env.GEMINI_API_KEY
});

export async function checkTasks(data: Jobs['check-tasks']) {
    const conversation = await db.query.conversations.findFirst({
        where: eq(schema.conversations.id, data.conversationId),
        columns: {
            messageHistory: true,
            taskScores: true,
        },
        with: {
            scenario: {
                columns: {
                    tasks: true,
                }
            }
        }
    });

    if (!conversation) {
        console.log('Conversation not found');
        return;
    }

    const scores = new Array(conversation.scenario.tasks.length).fill(0);

    const taskPromises = [];
    let index = 0;
    for (const task of conversation.scenario.tasks) {
        switch (task.metric) {
            case 'completion':
                taskPromises.push((async () => {
                     scores[index] = await checkCompletionTask(conversation.messageHistory, task.description);
                })());
                break;
            case 'progress':
                taskPromises.push((async () => {
                    scores[index] = await checkProgressTask(conversation.messageHistory, task.description, task.metricParams?.maxProgressSteps ?? 0);
                })());
                break;
            case 'percentage':
                taskPromises.push((async () => {
                    scores[index] = await checkPercentageTask(conversation.messageHistory, task.description, conversation.taskScores[index - 1] ?? 0);
                })());
                break;
            default:
                break;
        }

        index++;
    }
    await Promise.all(taskPromises);

    if (scores.length > 0 || scores.length !== conversation.taskScores.length) {
        pusher.trigger(`conversations-${data.conversationId}`, 'scores:updated', {
            scores
        });
        await db.update(schema.conversations).set({
            taskScores: scores
        }).where(eq(schema.conversations.id, data.conversationId));
    }
}

function getFriendlyMessageHistory(messageHistory: MessageHistory): string {
    let messageHistoryFriendly = '';
    messageHistory.forEach(message => {
        if (message.role !== 'user' && message.role !== 'assistant') {
            return;
        }
        messageHistoryFriendly += `${message.role}: ${message.content}\n\n`;
    });
    return messageHistoryFriendly;
}

async function checkCompletionTask(messageHistory: MessageHistory, taskDescription: string): Promise<number> {
    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You are a system which is given a conversation history, between the user and an ai assistant, and a description of a task. You will determine if the task has been successfully completed or not by the user based on the user's conversation with the ai assistant. ONLY answer with the word \"yes\" or \"no\"."],
        ["user", "<chat_history>{chat_history}</chat_history>\n\n<task_description>{task_description}</task_description>\n\nHas the task been completed successfully by the user (yes/no):"],
    ]);

    const prompt = await promptTemplate.invoke({
        chat_history: getFriendlyMessageHistory(messageHistory),
        task_description: taskDescription
    });

    const response = await model.invoke(prompt);

    return (response.content as string).toLowerCase().includes('yes') ? 1 : 0;
}

async function checkProgressTask(messageHistory: MessageHistory, taskDescription: string, maxProgressSteps: number): Promise<number> {
    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You are a system which is given a conversation history, between the user and an ai assistant, a description of a task, and the max progress steps. You will determine how many of the progress steps the user has passed based on the user's conversation with the ai assistant. ONLY answer with the NUMBER of progress steps passed to a maximum of the max progress steps."],
        ["user", "<chat_history>{chat_history}</chat_history>\n\n<task_description>{task_description}</task_description>\n\n<max_progress_steps>{max_progress_steps}</max_progress_steps>\n\nNumber of progress steps passed(0-{max_progress_steps}):"],
    ]);

    const prompt = await promptTemplate.invoke({
        chat_history: getFriendlyMessageHistory(messageHistory),
        task_description: taskDescription,
        max_progress_steps: maxProgressSteps
    });

    const response = await model.invoke(prompt);

    return Math.max(0, Math.min(Number((response.content as string).trim()), maxProgressSteps));
}

async function checkPercentageTask(messageHistory: MessageHistory, taskDescription: string, previousPercentageComplete: number): Promise<number> {
    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You are a system which is given a conversation history, between the user and an ai assistant, a description of a task, and a previous percentage complete. You will determine if the the new percentage complete based on the user's conversation with the ai assistant taking into account the latest message and the previous percentage complete. ONLY answer with the number of the percentage complete (0-100) without a percent sign and no decimal."],
        ["user", "<chat_history>{chat_history}</chat_history>\n\n<task_description>{task_description}</task_description>\n\n<previous_percentage_complete>{previous_percentage_complete}</previous_percentage_complete>>Percentage complete(0-100):"],
    ]);

    const prompt = await promptTemplate.invoke({
        chat_history: getFriendlyMessageHistory(messageHistory),
        task_description: taskDescription,
        previous_percentage_complete: previousPercentageComplete
    });

    const response = await model.invoke(prompt);

    return Math.max(0, Math.min(Number((response.content as string).trim()), 100));
}
