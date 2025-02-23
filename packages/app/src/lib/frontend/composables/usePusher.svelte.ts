import Pusher from 'pusher-js';
import { browser } from '$app/environment';

export function usePusher(channel: string, message: string, callback: (data: any) => void) {
	if (!browser) {
		return;
	}

	const pusher = new Pusher('soketi', {
		wsHost: 'localhost',
		wsPort: 6001,
		cluster: '',
		forceTLS: false,
		disableStats: true,
		enabledTransports: ['ws', 'wss']
	});

	$effect(() => {
		pusher.subscribe(channel).bind(message, callback);

		return () => {
			pusher.unsubscribe(channel);
		};
	});
}
