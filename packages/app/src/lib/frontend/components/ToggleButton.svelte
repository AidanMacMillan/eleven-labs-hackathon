<script lang="ts">
	import type { Snippet } from 'svelte';

	let { toggled = $bindable(), children }: { toggled: boolean; children?: Snippet } = $props();
</script>

<button
	class="toggle-button cursor-pointer rounded-lg p-2 backdrop-blur-sm active:opacity-75 {toggled
		? `bg-white/50`
		: `bg-black/20`}"
	onclick={() => (toggled = !toggled)}
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
