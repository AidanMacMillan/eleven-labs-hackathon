import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { schema } from '$lib/server/db';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const conversations = await db.query.conversations.findMany({
		orderBy: [desc(schema.conversations.id)],
		limit: 10,
		columns: {
			id: true,
			taskScores: true,
			grammarWarnings: true
		},
		with: {
			scenario: {
				columns: {
					name: true,
					backgroundImageUrl: true,
					tasks: true,
					avatarImageUrl: true
				}
			}
		}
	});

	const scenarios = await db.query.scenarios.findMany({
		orderBy: [desc(schema.scenarios.id)],
		limit: 10,
		columns: {
			id: true,
			name: true,
			description: true,
			backgroundImageUrl: true,
			avatarImageUrl: true
		}
	});

	return {
		conversations,
		scenarios
	};
};
