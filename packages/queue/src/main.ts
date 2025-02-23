import { Worker} from 'bullmq';
import {checkTasks} from "./jobs/checkTasks";
import {Queues} from "./queues";

export type Jobs = {
    'check-tasks': { conversationId: number }
};

// Debug
//
// const main = new Queue(Queues.MAIN, {
//     connection: {
//         host: 'localhost',
//         port: 6379
//     }
// });
// main.add('check-tasks', {conversationId: 2});

new Worker(Queues.MAIN, async job => {
    if (job.name === 'check-tasks') {
        const data = job.data as Jobs['check-tasks'];
        await checkTasks(data);
        return;
    }
    console.warn('Unknown job');
}, {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});