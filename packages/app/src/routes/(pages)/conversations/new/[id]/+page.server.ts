import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { schema } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const result = await db
		.insert(schema.conversations)
		.values({
			scenarioId: Number(id)
		})
		.returning({
			insertedId: schema.conversations.id
		});

	redirect(302, `/conversations/${result[0].insertedId}`);
};
