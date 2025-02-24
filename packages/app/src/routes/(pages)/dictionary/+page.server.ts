import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { schema } from '$lib/server/db';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const topUsedWords = await db.query.dictionaryElements.findMany({
		where: eq(schema.dictionaryElements.type, 'word'),
		limit: 10,
		orderBy: [desc(schema.dictionaryElements.usedCount), desc(schema.dictionaryElements.seenCount)]
	});

	const wordsToPractice = await db.query.dictionaryElements.findMany({
		where: eq(schema.dictionaryElements.type, 'word'),
		limit: 10,
		orderBy: [schema.dictionaryElements.usedCount, schema.dictionaryElements.seenCount]
	});

	return {
		topUsedWords,
		wordsToPractice
	};
};
