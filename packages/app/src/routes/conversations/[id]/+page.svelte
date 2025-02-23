<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/frontend/apiClient';
	import { Conversation } from '@11labs/client';
	import type { PageProps } from './$types';
	import ConversationView from './_components/ConversationView.svelte';

	let { data }: PageProps = $props();

	let signedUrl: string;
	onMount(async () => {
		const response = await apiClient.conversations['signed-url'].$get();
		const json = await response.json();
		signedUrl = json.signedUrl;
		await navigator.mediaDevices.getUserMedia({
			audio: true
		});
	});

	let conversation;

	async function startConversation() {
		conversation = await Conversation.startSession({
			signedUrl: signedUrl,
			customLlmExtraBody: {
				conversationId: data.conversation.id
			},
			overrides: {
				agent: {
					prompt: {
						prompt: data.conversation.scenario.description
					},
					language: data.conversation.scenario.language as any
				},
				tts: {
					voiceId: data.conversation.scenario.voice
				}
			},
			onMessage: (message) => {
				console.log(message);
			},
			onDebug: (message) => {
				console.log(message);
			},
			onError: (error) => {
				console.log(error);
			}
		});
	}
</script>

<button onclick={startConversation}>Start Conversation</button>
<ConversationView conversation={data.conversation} />
