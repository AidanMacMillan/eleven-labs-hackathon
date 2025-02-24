<script lang="ts">
	import Navbar from './_components/Navbar.svelte';
	import Header from './_components/Header.svelte';

	let { children } = $props();
</script>

<div class="background fixed inset-0 -z-10"></div>

<div class="pointer-events-none fixed inset-0 z-10">
	<div class="background background-overlay absolute inset-0 -z-10"></div>
	<Navbar />
	<Header />
</div>

<div class="pt-24 pb-20 sm:pt-20 sm:pb-0 sm:pl-16">
	<div class="px-6 sm:px-12">
		{@render children()}
	</div>
</div>

<style>
	.background {
		background: linear-gradient(160deg, #1f0027, #000000);
	}

	.background-overlay {
		mask-image:
			linear-gradient(to bottom, black 0, black 40px, transparent 80px, transparent 100%),
			linear-gradient(to top, black 0, black 40px, transparent 120px, transparent 100%);
	}

	@media (width >= 40rem /* sm */) {
		.background-overlay {
			mask-image:
				linear-gradient(to bottom, black 0, black 40px, transparent 80px, transparent 100%),
				linear-gradient(to right, black 0, black 40px, transparent 80px, transparent 100%);
		}
	}
</style>
