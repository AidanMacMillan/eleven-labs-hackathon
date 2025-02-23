<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, class: className }: { children?: Snippet; class?: string } = $props();
</script>

<div class="card rounded-lg bg-black shadow-md {className} relative z-0 overflow-hidden">
	{@render children?.()}
</div>

<style>
	.card:before {
		pointer-events: none;
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: inherit;
		mask-image: linear-gradient(to bottom, black 0, transparent 100%);
	}
</style>
