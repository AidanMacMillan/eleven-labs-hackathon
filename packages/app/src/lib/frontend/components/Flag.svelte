<script lang="ts">
	const { countryCode, size }: { countryCode: string; size?: 'sm' | 'md' } = $props();

	const sizeClass = {
		sm: 'h-[16px] w-[24px] border-1 rounded-xs',
		md: 'h-[24px] w-[36px] border-2 rounded'
	};
</script>

<img
	alt=""
	src="http://purecatamphetamine.github.io/country-flag-icons/3x2/{countryCode}.svg"
	class="box-content {sizeClass[size ?? 'md']} border-white"
/>
