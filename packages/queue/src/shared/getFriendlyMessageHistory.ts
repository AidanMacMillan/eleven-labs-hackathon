import {MessageHistory} from "drizzle/src/schema/conversations.ts";

export function getFriendlyMessageHistory(messageHistory: MessageHistory): string {
    let messageHistoryFriendly = '';
    messageHistory.forEach(message => {
        if (message.role !== 'user' && message.role !== 'assistant') {
            return;
        }
        messageHistoryFriendly += `${message.role}: ${message.content}\n\n`;
    });
    return messageHistoryFriendly;
}
