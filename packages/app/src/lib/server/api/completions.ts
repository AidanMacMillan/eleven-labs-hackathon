import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { COMPLETIONS_WEBHOOK_TOKEN, GEMINI_API_KEY } from '$env/static/private';
import { stream } from 'hono/streaming';
import OpenAI from 'openai';
import type { ChatCompletionCreateParamsStreaming } from 'openai/resources/chat/completions/completions';

const openai = new OpenAI({
	apiKey: GEMINI_API_KEY,
	baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

export const completionsRouter = new Hono()
	.use(
		'*',
		bearerAuth({
			token: COMPLETIONS_WEBHOOK_TOKEN
		})
	)
	.post('/', async (c) => {
		const body = (await c.req.json()) as ChatCompletionCreateParamsStreaming;

		return stream(c, async (stream) => {
			const chatStream = await openai.chat.completions.create({
				...body,
				model: 'gemini-2.0-flash',
				stream: true
			});

			for await (const chunk of chatStream) {
				await stream.write(`data: ${JSON.stringify(chunk)}\n\n`);
			}
		});
	});
