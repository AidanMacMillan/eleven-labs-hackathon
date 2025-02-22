import { Hono } from 'hono';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { GEMINI_API_KEY } from '$env/static/private';

export const testRouter = new Hono().get('/', async (c) => {
	const model = new ChatGoogleGenerativeAI({
		model: 'gemini-2.0-flash',
		maxOutputTokens: 2048,
		apiKey: GEMINI_API_KEY
	});

	const response = await model.invoke([new HumanMessage('Hello world!')]);

	return c.text(response.content as string);
});
