import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { COMPLETIONS_WEBHOOK_TOKEN, GEMINI_API_KEY } from '$env/static/private';
import { stream } from 'hono/streaming';
import OpenAI from 'openai';
import type { ChatCompletionCreateParamsStreaming } from 'openai/resources/chat/completions/completions';
import { HTTPException } from 'hono/http-exception';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { main } from '$lib/server/queue';
import { pusher } from '$lib/server/pusher';

const openai = new OpenAI({
	apiKey: GEMINI_API_KEY,
	baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

type ElevenLabsExtraBody = {
	elevenlabs_extra_body?: {
		conversationId?: number;
	};
};

export const completionsRouter = new Hono()
	.use(
		'*',
		bearerAuth({
			token: COMPLETIONS_WEBHOOK_TOKEN
		})
	)
	.post('/', async (c) => {
		const body = (await c.req.json()) as ChatCompletionCreateParamsStreaming & ElevenLabsExtraBody;

		const { elevenlabs_extra_body: extraBody, ...completionBody } = body;

		if (extraBody?.conversationId === undefined) {
			console.log('no conversation id');
			throw new HTTPException(400, { message: 'Bad request' });
		}

		const conversation = await db.query.conversations.findFirst({
			where: eq(schema.conversations.id, extraBody.conversationId)
		});

		if (!conversation) {
			console.log('no conversation');
			throw new HTTPException(400, { message: 'Bad request' });
		}

		const systemMessage = completionBody.messages[0];
		const latestUserMessage = completionBody.messages[completionBody.messages.length - 1];

		if (
			!latestUserMessage ||
			latestUserMessage.role !== 'user' ||
			!systemMessage ||
			systemMessage.role !== 'system'
		) {
			console.log('bad request');
			throw new HTTPException(400, { message: 'Bad request' });
		}
		completionBody.messages = [
			systemMessage,
			...conversation.messageHistory,
			latestUserMessage
		] as any;

		return stream(c, async (stream) => {
			const chatStream = await openai.chat.completions.create({
				...completionBody,
				model: 'gemini-2.0-flash',
				stream: true
			});

			let assistantMessage = {
				role: 'assistant',
				content: ''
			};

			const asyncPromises = [];

			for await (const chunk of chatStream) {
				if (chunk.choices[0].delta.role === 'assistant' && chunk.choices[0].delta.content) {
					assistantMessage.content += chunk.choices[0].delta.content;
				}

				await stream.write(`data: ${JSON.stringify(chunk)}\n\n`);

				asyncPromises.push(
					pusher.trigger(`conversations-${conversation.id}`, 'assistant-message', {
						content: assistantMessage.content
					})
				);
			}

			const currentHistory = conversation.messageHistory;
			currentHistory.push({
				role: 'user',
				content: latestUserMessage.content as string
			});
			currentHistory.push(assistantMessage);

			asyncPromises.push(
				db
					.update(schema.conversations)
					.set({
						messageHistory: currentHistory
					})
					.where(eq(schema.conversations.id, conversation.id))
			);

			asyncPromises.push(
				main.add('check-user-grammar', {
					conversationId: conversation.id,
					messageIndex: currentHistory.length - 2
				})
			);
			asyncPromises.push(main.add('check-tasks', { conversationId: conversation.id }));

			await Promise.all(asyncPromises);
		});
	});
