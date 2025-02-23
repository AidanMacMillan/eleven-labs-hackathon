<script lang="ts">
	import type { PageProps } from './$types';
	import ConversationView from './_components/ConversationView.svelte';

	let { data }: PageProps = $props();
</script>

<ConversationView conversation={data.conversation} />

<style>
	:global(html, body) {
		height: 100%;
	}
</style>
