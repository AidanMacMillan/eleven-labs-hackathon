import { Hono } from 'hono';
import { testRouter } from '$lib/server/api/test';

const router = new Hono().route('/test', testRouter);

export const api = new Hono().route('/api', router);

export type Router = typeof router;
