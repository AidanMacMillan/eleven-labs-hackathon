<script lang="ts">
	import { useFirstInteract } from '$lib/frontend/composables/useFirstInteract.svelte.js';
	import type { PageProps } from '../$types';
	import { usePusher } from '$lib/frontend/composables/usePusher.svelte.js';
	import { TypewriterEffect } from '$lib/frontend/composables/useTypewriterEffect.svelte.js';
	import ConversationTasks from './ConversationTasks.svelte';
	import ToggleButton from '$lib/frontend/components/ToggleButton.svelte';
	import { AudioLinesIcon, CaptionsIcon, ChevronLeft } from 'lucide-svelte';
	import ConversationWarnings from './ConversationWarnings.svelte';
	import ActionButton from '$lib/frontend/components/ActionButton.svelte';
	import { onMount } from 'svelte';
	import { apiClient } from '$lib/frontend/apiClient';
	import { Conversation } from '@11labs/client';
	import Button from '$lib/frontend/components/Button.svelte';

	const { conversation }: { conversation: PageProps['data']['conversation'] } = $props();

	let audioElement: HTMLAudioElement;

	useFirstInteract(() => {
		audioElement.volume = 0.25;
		audioElement.play();
	});

	const typewriterEffect = new TypewriterEffect();
	typewriterEffect.updateValue(
		conversation.messageHistory.findLast((message) => message.role === 'assistant')?.content ?? ''
	);

	usePusher(`conversations-${conversation.id}`, 'assistant-message', (data) => {
		console.log(data.content);
		typewriterEffect.updateValue(data.content);
	});

	let showSubtitles = $state(true);

	let signedUrl: string;
	onMount(async () => {
		const response = await apiClient.conversations['signed-url'].$get();
		const json = await response.json();
		signedUrl = json.signedUrl;
		await navigator.mediaDevices.getUserMedia({
			audio: true
		});
	});

	async function startConversation() {
		let session = await Conversation.startSession({
			signedUrl: signedUrl,
			customLlmExtraBody: {
				conversationId: conversation.id
			},
			overrides: {
				agent: {
					prompt: {
						prompt: conversation.scenario.description
					},
					language: conversation.scenario.language as any
				},
				tts: {
					voiceId: conversation.scenario.voice
				}
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

<div class="relative z-0 h-full overflow-hidden">
	<div
		class="background-image absolute inset-0 -z-10"
		style:background-image="url('{conversation.scenario.backgroundImageUrl}')"
	></div>
	{#if conversation.scenario.visualEffect}
		<video loop autoplay muted class="overlay-video absolute -z-10 h-full w-full object-cover">
			<source src={conversation.scenario.visualEffect} />
		</video>
	{/if}
	<div class="vignette absolute inset-0 -z-10"></div>
	<div class="absolute top-4 left-4 flex gap-2">
		<a href="/learn">
			<Button>
				<ChevronLeft class="text-white"></ChevronLeft>
			</Button>
		</a>
		<ActionButton onClick={startConversation}>
			<AudioLinesIcon class="text-white" />
		</ActionButton>
		<ToggleButton bind:toggled={showSubtitles}>
			<CaptionsIcon class="text-white" />
		</ToggleButton>
	</div>
	<div class="flex h-full gap-8">
		<div class="flex grow flex-col items-center">
			<div
				class="my-auto min-h-96 w-96 overflow-hidden rounded-full bg-white/10 p-2 backdrop-blur-sm"
			>
				<img
					src={conversation.scenario.avatarImageUrl}
					alt="Avatar"
					class="h-full w-full rounded-full object-cover select-none"
				/>
			</div>
			{#if showSubtitles}
				<div class="flex flex-col items-center px-8 py-24">
					{#if typewriterEffect.currentValue.length > 0}
						<div
							class="text-2xl font-bold"
							style:color={conversation.scenario.accentColor ?? 'white'}
						>
							{conversation.scenario.persona}
						</div>
						<p class="text-center text-xl font-light text-white">
							<span class="font-light tracking-wide">{typewriterEffect.currentValue}</span>
						</p>
					{/if}
				</div>
			{/if}
		</div>
		<div class="flex shrink-0 grow-0 basis-96 flex-col gap-4 overflow-y-auto py-20 pr-8">
			<ConversationTasks {conversation} />
			<ConversationWarnings {conversation} />
		</div>
	</div>
</div>
<audio loop bind:this={audioElement}>
	<source src="/restaurant.mp3" type="audio/mpeg" />
</audio>

<style>
	.background-image {
		background-size: cover;
		background-position: center;
		filter: blur(5px);
		margin: -10px;
	}

	.overlay-video {
		opacity: 0.25;
	}

	.vignette {
		background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 75%);
	}
</style>
