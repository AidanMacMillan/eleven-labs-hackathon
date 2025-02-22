import { Hono } from 'hono';
import { testRouter } from '$lib/server/api/test';
import { completionsRouter } from '$lib/server/api/completions';
import { conversationsRouter } from '$lib/server/api/conversations';

const router = new Hono()
	.route('/test', testRouter)
	.route('/chat/completions', completionsRouter)
	.route('/conversations', conversationsRouter);

export const api = new Hono().route('/api', router);

export type Router = typeof router;
