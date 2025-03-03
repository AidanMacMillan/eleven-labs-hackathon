import type { Router } from '$lib/server/api';
import { hc } from 'hono/client';

let browserClient: ReturnType<typeof hc<Router>>;

export const makeApiClient = (fetch: Window['fetch']) => {
	const isBrowser = typeof window !== 'undefined';
	const origin = isBrowser ? window.location.origin : '';

	if (isBrowser && browserClient) {
		return browserClient;
	}

	const client = hc<Router>(origin + '/api', { fetch });

	if (isBrowser) {
		browserClient = client;
	}

	return client;
};
