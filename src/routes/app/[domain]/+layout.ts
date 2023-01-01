import { browser } from '$app/environment';
import { isLoggedIn } from '$lib/auth/auth';
import { ensureIdent, type Identity } from '$stores/identity';
import { onMount } from 'svelte';
import type { LayoutLoad } from './$types';

export type Data = {
	loggedIn: boolean;
	identity: Identity;
	domain: string;
};

export const load = async function ({ params }): Promise<Data> {
	const domain = params.domain;
	if (browser) console.log(`[domain] load: ${window.location.pathname}`);
	if (browser && isLoggedIn(domain)) {
		return {
			loggedIn: true,
			identity: ensureIdent(domain),
			domain: domain,
		};
	}

	return {
		loggedIn: false,
		identity: ensureIdent(domain),
		domain: domain,
	};
} satisfies LayoutLoad;
