import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export function defineLocalStore<T>(name: string, init: T): Writable<T> {
	if (browser) {
		if (localStorage[name]) {
			init = JSON.parse(localStorage[name]);
		}
		const w = writable<T>(init);
		w.subscribe((value) => {
			localStorage[name] = JSON.stringify(value);
		});
		return w;
	}
	return writable<T>(init);
}
