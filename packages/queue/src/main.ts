import { Worker } from 'bullmq';
import {checkTasks} from "./jobs/checkTasks";
import {Queues} from "./queues";

export type Jobs = {
    'check-tasks': { conversationId: number }
};

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