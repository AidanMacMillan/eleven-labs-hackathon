<script lang="ts">
	import type { PageProps } from '../$types';
	import { usePusher } from '$lib/frontend/composables/usePusher.svelte';
	import { CheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from 'lucide-svelte';

	const { conversation }: { conversation: PageProps['data']['conversation'] } = $props();

	let warnings = $state(conversation.grammarWarnings);

	usePusher(`conversations-${conversation.id}`, 'grammar-warnings:added', (data) => {
		warnings.push(...data.newWarnings);
	});

	let orderedGroupedWarningsDesc = $derived.by(() => {
		warnings.toSorted((a, b) => {
			return a.messageIndex - b.messageIndex;
		});

		let index = -1;
		let currentMessageIndex = -1;
		const groupedWarnings: (typeof warnings)[] = [];
		for (const warning of warnings) {
			if (warning.messageIndex !== currentMessageIndex) {
				index++;
				currentMessageIndex = warning.messageIndex;
				groupedWarnings.push([]);
			}

			groupedWarnings[index].push(warning);
		}

		return groupedWarnings;
	});

	function warningLevelToColor(level: string) {
		switch (level) {
			case 'info':
				return 'bg-blue-500';
			case 'warning':
				return 'bg-yellow-500';
			case 'error':
				return 'bg-red-500';
			default:
				return 'bg-blue-500';
		}
	}
</script>

<div class="flex flex-col gap-2 text-white">
	<div class="text-sm font-bold">Warnings</div>
	{#if warnings.length === 0}
		<div class="py-4 text-center text-sm opacity-75">
			No warnings yet <CheckIcon class="inline h-4 w-4 text-green-400" />
		</div>
	{/if}
	{#each orderedGroupedWarningsDesc as group, index}
		{#if index !== 0}
			<div class="mx-2 h-[1px] bg-white/25"></div>
		{/if}
		{#each group as warning}
			<div
				class="task flex items-stretch gap-2 overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm"
			>
				<div class="p-4">
					<div class="font-bold">{warning.name}</div>
					<div class="line-clamp-2 text-sm font-light opacity-75">{warning.description}</div>
				</div>
				<div
					class="flex w-20 shrink-0 items-center justify-center transition-colors ease-in-out {warningLevelToColor(
						warning.level
					)}"
				>
					{#if warning.level === 'error'}
						<OctagonXIcon class="h-6 w-6" />
					{:else if warning.level === 'warning'}
						<TriangleAlertIcon class="h-6 w-6" />
					{:else}
						<InfoIcon class="h-6 w-6" />
					{/if}
				</div>
			</div>
		{/each}
	{/each}
</div>

<style>
	.task:before {
		pointer-events: none;
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: inherit;
		mask-image: linear-gradient(to bottom, black 0, transparent 100%);
	}
</style>
