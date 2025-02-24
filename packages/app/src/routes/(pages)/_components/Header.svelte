<script>
	import Flag from '$lib/frontend/components/Flag.svelte';
</script>

<div
	class="pointer-events-auto absolute top-0 left-0 flex h-20 w-full items-center justify-between px-6"
>
	<div class="z-10 hidden text-xl font-black sm:block">
		<span class="fancy-text bg-clip-text tracking-wider">LINGUA</span><span class="font-normal"
			>CONVERSE</span
		>
	</div>
	<div class="flex grow items-center justify-between gap-0 sm:grow-0 sm:justify-normal sm:gap-16">
		<Flag countryCode="JP" />
		<div class="flex items-center gap-4">
			<div class="h-4 w-4 rotate-45 rounded border-2 border-white bg-purple-400"></div>
			<div class="font-bold text-purple-400">5289</div>
		</div>
		<img
			src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
			alt=""
			class="h-10 w-10 rounded-full border-2 border-white object-cover"
		/>
	</div>
</div>

<style>
	.fancy-text {
		background: linear-gradient(155deg, #d668d6, #8e53cc);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
