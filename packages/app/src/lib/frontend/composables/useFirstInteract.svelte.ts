import { browser } from '$app/environment';

export function useFirstInteract(callback?: () => void) {
	if (!browser) {
		return;
	}

	let hasInteracted = $state(navigator.userActivation.hasBeenActive);

	$effect(() => {
		if (hasInteracted) {
			callback?.();
		} else {
			document.addEventListener('mousedown', onMouseDown);
			document.addEventListener('pointerdown', onPointerDown);
			document.addEventListener('pointerup', onPointerUp);
			document.addEventListener('keydown', onKeyDown);
		}

		return () => {
			document.removeEventListener('mousedown', onMouseDown);
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('pointerup', onPointerUp);
			document.removeEventListener('keydown', onKeyDown);
		};
	});

	function onMouseDown() {
		hasInteracted = true;
	}

	function onPointerDown(e: PointerEvent) {
		if (e.pointerType === 'mouse') {
			hasInteracted = true;
		}
	}

	function onPointerUp(e: PointerEvent) {
		if (e.pointerType !== 'mouse') {
			hasInteracted = true;
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.code === 'Escape') {
			hasInteracted = true;
		}
	}
}
