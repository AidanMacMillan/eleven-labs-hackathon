import { makeApiClient } from '$lib/makeApiClient';

export const apiClient = makeApiClient(fetch);
