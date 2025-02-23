import {Queue, Worker} from 'bullmq';
import {checkTasks} from "./jobs/checkTasks";
import {Queues} from "./queues";
import {checkUserGrammar} from "./jobs/checkUserGrammar.ts";
import {collectDictionaryElementsForMessages} from "./jobs/collectDictionaryElementsForMessages.ts";

export type Jobs = {
    'check-tasks': { conversationId: number }
    'check-user-grammar': { conversationId: number, messageIndex: number }
    'collect-dictionary-elements-for-messages': { conversationId: number, userMessageIndex: number, assistantMessageIndex: number }
};

const main = new Queue(Queues.MAIN, {
    connection: {
        host: 'localhost',
        port: 6379
    }
});
// main.add('check-tasks', {conversationId: 2});
main.add('check-user-grammar', {conversationId: 2, messageIndex: 20});

new Worker(Queues.MAIN, async job => {
    if (job.name === 'check-tasks') {
        const data = job.data as Jobs['check-tasks'];
        await checkTasks(data);
        return;
    }
    if (job.name === 'check-user-grammar') {
        const data = job.data as Jobs['check-user-grammar'];
        await checkUserGrammar(data);
        return;
    }
    if (job.name === 'collect-dictionary-elements-for-messages') {
        const data = job.data as Jobs['collect-dictionary-elements-for-messages'];
        await collectDictionaryElementsForMessages(data);
        return;
    }
    console.warn('Unknown job');
}, {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});