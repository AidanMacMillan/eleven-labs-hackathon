<script lang="ts">
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/frontend/apiClient';
	import { Conversation } from '@11labs/client';
	import type { PageProps } from './$types';
	import { usePusher } from '$lib/frontend/composables/usePusher.svelte';

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

	let scores = $state(data.conversation.taskScores);

	usePusher(`conversations-${data.conversation.id}`, 'scores:updated', (data) => {
		scores = data.scores;
	});
</script>

<button onclick={startConversation}>Start Conversation</button>

<div class="flex flex-col gap-2">
	{#each data.conversation.scenario.tasks as task, index}
		<div>
			{task.name}
			{task.description}
			{#if task.metric === 'completion'}
				{#if (scores[index] ?? 0) === 1}
					<div class="text-green-500">Completed</div>
				{:else}
					<div class="text-red-500">Not Completed</div>
				{/if}
			{:else if task.metric === 'progress'}
				<div>
					Progress: {scores[index] ?? 0}/{task.metricParams?.maxProgressSteps ?? 0}
				</div>
			{:else if task.metric === 'percentage'}
				<div>Percentage Complete: {scores[index] ?? 0}%</div>
			{/if}
		</div>
	{/each}
</div>
