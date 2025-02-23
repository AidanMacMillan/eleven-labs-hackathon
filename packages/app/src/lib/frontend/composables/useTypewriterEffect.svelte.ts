import { untrack } from 'svelte';

export class TypewriterEffect {
	public currentValue = $state('');
	private changes: (string | null)[] = [];
	private currentTarget: string = '';

	constructor() {
		$effect(() => {
			const interval = setInterval(() => {
				untrack(() => {
					if (this.changes.length === 0) {
						return;
					}

					const change = this.changes.shift();

					if (change === null) {
						this.currentValue = this.currentValue.slice(0, -1);
						return;
					}

					this.currentValue = this.currentValue += change;
				});
			}, 5);

			return () => {
				clearInterval(interval);
			};
		});
	}

	public commonPrefixLength(str1: string, str2: string) {
		let i = 0;
		while (i < str1.length && i < str2.length && str1.charAt(i) === str2.charAt(i)) {
			i++;
		}
		return i;
	}

	public updateValue(target: string) {
		if (target === this.currentTarget) {
			return;
		}

		const commonPrefix = this.commonPrefixLength(this.currentTarget, target);

		this.changes.push(
			...this.currentTarget
				.slice(commonPrefix)
				.split('')
				.map((_) => null)
		);
		this.changes.push(...target.slice(commonPrefix).split(''));

		if (this.changes.filter((change) => change === null).length > 20) {
			this.changes = [];
			this.currentValue = target;
		}
		this.currentTarget = target;
	}
}
