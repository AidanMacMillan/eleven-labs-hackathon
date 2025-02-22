import { Hono } from 'hono';
import { elevenLabs } from '$lib/server/elevenLabs';
import { AGENT_ID } from '$env/static/private';

export const conversationsRouter = new Hono().get('/signed-url', async (c) => {
	const response = await elevenLabs.conversationalAi.getSignedUrl({
		agent_id: AGENT_ID
	});
	return c.json({
		signedUrl: response.signed_url
	});
});
