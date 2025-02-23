<script lang="ts">
	import './conversations.css';
	import type { PageProps } from './$types';
	import ConversationView from './_components/ConversationView.svelte';

	let { data }: PageProps = $props();
</script>

<ConversationView conversation={data.conversation} />
