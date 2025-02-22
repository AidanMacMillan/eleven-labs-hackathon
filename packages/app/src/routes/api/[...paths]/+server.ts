import { api } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';

export const fallback: RequestHandler = ({ request, locals }) => api.fetch(request, locals);
