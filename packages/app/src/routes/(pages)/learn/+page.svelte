<script>
	import Card from '$lib/frontend/components/Card.svelte';
</script>

<h1 class="mb-4 text-2xl font-bold">Learn</h1>

<Card class="mb-8 flex h-28 items-center justify-center p-4">
	<img
		class="absolute inset-0 -z-10 h-full w-full object-cover"
		src="https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=3584&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		alt=""
	/>
	<video loop autoplay muted class="overlay-video absolute -z-10 h-full w-full object-cover">
		<source
			src="https://cdn.alchemyrpg.com/universe/6260df75b0b47dc841b01d56/assets/lrv15j1b.webm"
		/>
	</video>
	<div class="bottom-gradient absolute inset-0 -z-10"></div>
	<div class="header-text relative text-center text-lg font-bold tracking-wider">
		Master New Languages Faster and Smarter
	</div>
</Card>

<h2 class="mb-4 text-lg font-semibold">Recent Conversations</h2>

<h2 class="mb-4 text-lg font-semibold">Start a New Conversation</h2>

<style>
	.bottom-gradient {
		background: linear-gradient(to top, rgba(255, 100, 150, 0.25) 0%, rgba(255, 100, 150, 0) 200px);
	}

	.overlay-video {
		opacity: 0.25;
	}

	.header-text {
		animation: fade-in 1s ease-out;
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
