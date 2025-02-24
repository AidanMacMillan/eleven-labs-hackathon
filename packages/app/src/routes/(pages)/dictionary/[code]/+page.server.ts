import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { schema } from '$lib/server/db';
import { and, desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { code } = params;

	const language = code.toLowerCase();

	const topUsedWords = await db.query.dictionaryElements.findMany({
		where: and(
			eq(schema.dictionaryElements.type, 'word'),
			eq(schema.dictionaryElements.language, language)
		),
		limit: 10,
		orderBy: [desc(schema.dictionaryElements.usedCount), desc(schema.dictionaryElements.seenCount)]
	});

	const wordsToPractice = await db.query.dictionaryElements.findMany({
		where: and(
			eq(schema.dictionaryElements.type, 'word'),
			eq(schema.dictionaryElements.language, language)
		),
		limit: 10,
		orderBy: [schema.dictionaryElements.usedCount, schema.dictionaryElements.seenCount]
	});

	return {
		topUsedWords,
		wordsToPractice
	};
};
