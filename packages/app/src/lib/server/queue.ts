import { Queue } from 'bullmq';
import { Queues } from '../../../../queue/src/queues';

export const main = new Queue(Queues.MAIN, {
	connection: {
		host: 'localhost',
		port: 6379
	}
});
