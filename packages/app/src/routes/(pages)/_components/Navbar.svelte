<script lang="ts">
	import {
		BookAIcon,
		CompassIcon,
		GraduationCapIcon,
		Icon,
		ShapesIcon,
		UserRoundIcon
	} from 'lucide-svelte';
	import { page } from '$app/state';

	interface NavItem {
		name: string;
		href: string;
		icon: typeof Icon;
		isActive: () => boolean;
	}
	const navItems: NavItem[] = [
		{
			name: 'Learn',
			href: '/learn',
			icon: GraduationCapIcon,
			isActive: () => {
				return page.url.pathname.startsWith('/learn/') || page.url.pathname === '/learn';
			}
		},
		{
			name: 'Conversations',
			href: '/dictionary/en',
			icon: BookAIcon,
			isActive: () => {
				return page.url.pathname.startsWith('/dictionary/') || page.url.pathname === '/dictionary';
			}
		},
		{
			name: 'Library',
			href: '/library',
			icon: ShapesIcon,
			isActive: () => {
				return page.url.pathname.startsWith('/library/') || page.url.pathname === '/library';
			}
		},
		{
			name: 'Explore',
			href: '/explore',
			icon: CompassIcon,
			isActive: () => {
				return page.url.pathname.startsWith('/explore/') || page.url.pathname === '/explore';
			}
		},
		{
			name: 'Profile',
			href: '/profile',
			icon: UserRoundIcon,
			isActive: () => {
				return page.url.pathname.startsWith('/profile/') || page.url.pathname === '/profile';
			}
		}
	];
</script>

<nav
	class="pointer-events-auto absolute bottom-0 left-0 flex h-20 w-full items-center justify-around gap-0 sm:top-20 sm:left-0 sm:h-auto sm:w-16 sm:flex-col sm:items-end sm:justify-normal sm:gap-6"
>
	{#each navItems as navItem}
		{@const Icon = navItem.icon}
		<a href={navItem.href} class="p-2{navItem.isActive() ? '' : ' opacity-50 hover:opacity-100'}">
			<Icon class="h-6 w-6" />
		</a>
	{/each}
</nav>
