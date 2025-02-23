<script lang="ts">
	import type { PageProps } from '../$types';
	import { usePusher } from '$lib/frontend/composables/usePusher.svelte.js';
	import { BadgeCheckIcon, BadgeXIcon } from 'lucide-svelte';

	const { conversation }: { conversation: PageProps['data']['conversation'] } = $props();

	let scores = $state(conversation.taskScores);

	usePusher(`conversations-${conversation.id}`, 'scores:updated', (data) => {
		scores = data.scores;
	});

	function isTaskComplete(
		task: (typeof conversation.scenario.tasks)[number],
		index: number
	): boolean {
		switch (task.metric) {
			case 'completion':
				return scores[index] === 1;
			case 'progress':
				return scores[index] === task.metricParams?.maxProgressSteps;
			case 'percentage':
				return scores[index] >= 100;
			default:
				return false;
		}
	}
</script>

<div class="flex flex-col gap-2 text-white">
	<div class="text-sm font-bold">Tasks</div>
	<div class="flex flex-col gap-2">
		{#each conversation.scenario.tasks as task, index}
			{@const isComplete = isTaskComplete(task, index)}
			<div
				class="task flex items-stretch gap-2 overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm"
			>
				<div class="grow-1 p-4">
					<div class="font-semibold">
						{task.name}
					</div>
					<div class="text-sm font-light opacity-75">
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
				</div>
				<div
					class="flex w-20 shrink-0 items-center justify-center transition-colors ease-in-out {isComplete
						? 'bg-green-500'
						: 'bg-red-500'}"
				>
					{#if isComplete}
						<BadgeCheckIcon class="h-6 w-6" />
					{:else}
						<BadgeXIcon class="h-6 w-6" />
					{/if}
				</div>
			</div>
		{/each}
	</div>
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
