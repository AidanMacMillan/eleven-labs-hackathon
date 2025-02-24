<script lang="ts">
	import type { PageProps } from './$types';
	import Card from '$lib/frontend/components/Card.svelte';
	import { EyeIcon, MicVocalIcon } from 'lucide-svelte';

	const { data }: { data: PageProps } = $props();
</script>

<h1 class="mb-4 text-2xl font-bold">Dictionary</h1>

<h2 class="mb-4 text-lg font-semibold">Top Used Words</h2>
<div class="mb-8 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-3">
	{#each data.topUsedWords as word, index}
		<Card class="flex flex-col gap-1 bg-purple-950 px-4 py-2">
			<div class="text-center">
				<span class="text-sm text-white/75">{index + 1}.</span>
				<span class="font-bold">{word.element}</span>
			</div>
			<div class="flex items-center justify-center gap-1.5 text-sm text-white/75">
				{word.usedCount}
				<MicVocalIcon class="h-4 w-4" />
				{word.seenCount}
				<EyeIcon class="h-4 w-4" />
			</div>
		</Card>
	{/each}
</div>

<h2 class="mb-4 text-lg font-semibold">Words to Practice</h2>
<div class="mb-8 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-3">
	{#each data.wordsToPractice as word, index}
		<Card class="flex flex-col gap-1 bg-orange-950 px-4 py-2">
			<div>
				<span class="text-sm text-white/75">{index + 1}.</span>
				<span class="font-bold">{word.element}</span>
			</div>
			<div class="flex items-center justify-center gap-1.5 text-sm text-white/75">
				{word.usedCount}
				<MicVocalIcon class="h-4 w-4" />
				{word.seenCount}
				<EyeIcon class="h-4 w-4" />
			</div>
		</Card>
	{/each}
</div>
