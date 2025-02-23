<script lang="ts">
	import { useFirstInteract } from '$lib/frontend/composables/useFirstInteract.svelte';
	import type { PageProps } from '../$types';
	import { usePusher } from '$lib/frontend/composables/usePusher.svelte';
	import { TypewriterEffect } from '$lib/frontend/composables/useTypewriterEffect.svelte';
	import ConversationTasks from './ConversationTasks.svelte';
	import ToggleButton from '$lib/frontend/components/ToggleButton.svelte';
	import { CaptionsIcon } from 'lucide-svelte';

	const { conversation }: { conversation: PageProps['data']['conversation'] } = $props();

	let audioElement: HTMLAudioElement;

	useFirstInteract(() => {
		audioElement.play();
	});

	const typewriterEffect = new TypewriterEffect();
	typewriterEffect.updateValue(
		conversation.messageHistory.findLast((message) => message.role === 'assistant')?.content ?? ''
	);

	usePusher(`conversations-${conversation.id}`, 'assistant-message', (data) => {
		typewriterEffect.updateValue(data.content);
	});

	let showSubtitles = $state(true);
</script>

<div class="relative z-0 h-full overflow-hidden">
	<div
		class="background-image absolute inset-0 -z-10"
		style:background-image="url('{conversation.scenario.backgroundImageUrl}')"
	></div>
	<video loop autoplay muted class="overlay-video absolute -z-10 h-full w-full object-cover">
		<source
			src="https://cdn.alchemyrpg.com/universe/6260df75b0b47dc841b01d56/assets/lrv15j1b.webm"
		/>
	</video>
	<div class="vignette absolute inset-0 -z-10"></div>
	<div class="absolute top-4 left-4 flex gap-4">
		<ToggleButton bind:toggled={showSubtitles}>
			<CaptionsIcon class="text-white" />
		</ToggleButton>
	</div>
	<div class="flex gap-8 p-8">
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
						<div class="text-2xl font-bold text-orange-400">{conversation.scenario.persona}</div>
						<p class="text-center text-xl font-light text-white">
							<span class="font-light tracking-wide">{typewriterEffect.currentValue}</span>
						</p>
					{/if}
				</div>
			{/if}
		</div>
		<div class="shrink-0 grow-0 basis-96">
			<ConversationTasks {conversation} />
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
