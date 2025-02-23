<script lang="ts">
	import Card from '$lib/frontend/components/Card.svelte';
	import type { PageProps } from './$types';
	import { ClipboardListIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from 'lucide-svelte';
	import Flag from '$lib/frontend/components/Flag.svelte';

	const { data }: { data: PageProps } = $props();

	function countCompletedTasks(conversation: PageProps['data']['conversations'][number]) {
		let completed = 0;
		const scores = conversation.taskScores;
		let index = 0;
		for (const task of conversation.scenario.tasks) {
			switch (task.metric) {
				case 'completion':
					if (scores[index] === 1) {
						completed++;
					}
					break;
				case 'progress':
					if (scores[index] === task.metricParams?.maxProgressSteps) {
						completed++;
					}
					break;
				case 'percentage':
					if (scores[index] >= 100) {
						completed++;
					}
					break;
				default:
					break;
			}
			index++;
		}

		return completed;
	}

	function getGrammarWarningsByType(conversation: PageProps['data']['conversations'][number]) {
		const warnings = conversation.grammarWarnings;

		const byType = {
			info: 0,
			warning: 0,
			error: 0
		};

		for (const warning of warnings) {
			byType[warning.level]++;
		}

		return byType;
	}

	function laguageToCountryCode(language: string) {
		switch (language) {
			case 'en':
				return 'US';
			default:
				return language;
		}
	}
</script>

<h1 class="mb-4 text-2xl font-bold">Learn</h1>

<Card class="mb-8 flex h-28 items-center justify-center p-4">
	<img
		class="blur-in absolute inset-0 -z-10 h-full w-full scale-105 object-cover"
		src="https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=3584&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		alt=""
	/>
	<video loop autoplay muted class="overlay-video absolute -z-10 h-full w-full object-cover">
		<source
			src="https://cdn.alchemyrpg.com/universe/6260df75b0b47dc841b01d56/assets/lrv15j1b.webm"
		/>
	</video>
	<div class="bottom-gradient absolute inset-0 -z-10"></div>
	<div class="fade-in relative text-center text-lg font-bold tracking-wider">
		Master New Languages Faster and Smarter
	</div>
</Card>

<h2 class="mb-4 text-lg font-semibold">Recent Conversations</h2>
<div class="mb-8 grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
	{#each data.conversations as conversation}
		{@const warningCounts = getGrammarWarningsByType(conversation)}
		<a href="/conversations/{conversation.id}" class="group">
			<Card class="flex h-40 items-center justify-center gap-4 p-2">
				<div
					class="background-image absolute inset-0 -z-10 bg-cover bg-center opacity-75 blur-xs transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-90"
					style:background-image="url('{conversation.scenario.backgroundImageUrl}')"
				></div>
				<div
					class="my-auto min-h-20 w-20 overflow-hidden rounded-full bg-white/10 p-1 backdrop-blur-xs"
				>
					<img
						src={conversation.scenario.avatarImageUrl}
						alt="Avatar"
						class="h-full w-full rounded-full object-cover select-none"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<div class="text-center font-bold">
						{conversation.scenario.name}
					</div>
					<div class="flex items-center gap-1.5 text-sm text-white/75">
						{countCompletedTasks(conversation)}/{conversation.scenario.tasks.length}
						<ClipboardListIcon class="h-4 w-4" />
						<div class="mx-1 h-4 w-[1px] bg-white/75"></div>
						{warningCounts.info}
						<InfoIcon class="h-4 w-4 text-blue-400" />
						{warningCounts.warning}
						<TriangleAlertIcon class="h-4 w-4 text-yellow-400" />
						{warningCounts.error}
						<OctagonXIcon class="h-4 w-4 text-red-400" />
					</div>
				</div>
			</Card>
		</a>
	{/each}
</div>

<h2 class="mb-4 text-lg font-semibold">Start a New Conversation</h2>
<div class="mb-8 grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
	{#each data.scenarios as scenario}
		<a href="/conversations/new/{scenario.id}" class="group">
			<Card class="flex h-40 items-center justify-center gap-4 px-4 py-2">
				<div
					class="background-image absolute inset-0 -z-10 bg-cover bg-center opacity-50 blur-xs transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-75"
					style:background-image="url('{scenario.backgroundImageUrl}')"
				></div>
				<div class="flex flex-col gap-1">
					<div class="font-bold">{scenario.name}</div>
					<div class="text-sm font-light opacity-75">{scenario.description}</div>
					<div class="flex items-center gap-1 text-sm text-white/75">
						3 <ClipboardListIcon class="h-4 w-4" />
						<div class="mx-1 h-4 w-[1px] bg-white/75"></div>
						<Flag size="sm" countryCode={laguageToCountryCode(scenario.language)} />
					</div>
				</div>
			</Card>
		</a>
	{/each}
</div>

<style>
	.bottom-gradient {
		background: linear-gradient(to top, rgba(255, 100, 150, 0.25) 0%, rgba(255, 100, 150, 0) 200px);
	}

	.overlay-video {
		opacity: 0.25;
	}

	.fade-in {
		animation: fade-in 1s ease-out;
	}

	.blur-in {
		animation: blur-in 1s ease-out;
	}

	@keyframes blur-in {
		0% {
			filter: blur(10px);
		}
		100% {
			filter: blur(0px);
		}
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
			filter: blur(10px);
			top: 10px;
		}
		100% {
			opacity: 1;
			filter: blur(0px);
			top: 0px;
		}
	}
</style>
