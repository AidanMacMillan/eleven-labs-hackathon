<script lang="ts">
	import type { Snippet } from 'svelte';

	let { onClick, children }: { onClick: () => void; children?: Snippet } = $props();

	let isActive = $state(false);
</script>

<button
	class="toggle-button cursor-pointer rounded-lg p-2 backdrop-blur-sm active:opacity-75 {isActive
		? `bg-red-500/75`
		: `bg-black/20`}"
	onclick={() => {
		if (isActive) {
			return;
		}
		isActive = true;
		onClick();
	}}
>
	{@render children?.()}
</button>

<style>
	.toggle-button:before {
		pointer-events: none;
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: inherit;
		mask-image: linear-gradient(to bottom, black 0, transparent 100%);
	}
</style>
