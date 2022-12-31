import { browser } from '$app/environment';
import { isLoggedIn } from '$lib/auth/auth';
import type { PageLoad } from './$types';

export type Data = {
	domain: string;
	feed: string;
};

export const load = async function ({ params }): Promise<Data> {
	const domain = params.domain;
	if (browser && isLoggedIn(domain)) {
		return {
			domain: domain,
			feed: 'home'
		};
	}

	// TODO: Indicate that we're not logged in.
	return {
		domain: domain,
		feed: 'home'
	};
} satisfies PageLoad;
