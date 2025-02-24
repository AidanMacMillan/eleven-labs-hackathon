import type { PageServerLoad } from './$types';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const conversationId = params.id;
	const conversation = await db.query.conversations.findFirst({
		where: eq(schema.conversations.id, Number(conversationId)),
		with: {
			scenario: {
				columns: {
					id: true,
					name: true,
					description: true,
					backgroundImageUrl: true,
					visualEffect: true,
					voice: true,
					language: true,
					tasks: true,
					avatarImageUrl: true,
					ambientAudioUrl: true,
					persona: true,
					accentColor: true
				}
			}
		},
		columns: {
			id: true,
			taskScores: true,
			messageHistory: true,
			grammarWarnings: true
		}
	});
	if (!conversation) {
		error(404);
	}

	return {
		conversation
	};
};
