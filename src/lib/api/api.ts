import { clearCredentials, isLoggedIn } from '$lib/auth/auth';
import { reqGet, type Headers } from '$lib/fetch';
import { basename } from '$lib/utils';
import { ensureIdent, type Identity } from '$stores/identity';
import type { Status } from './entities';

function apiUrl(domain: string, endpoint: string): string {
	return `${basename(domain)}/api/v1/${endpoint}`;
}

function ensureLogin(domain: string) {
	if (!isLoggedIn(domain)) {
		throw new Error('must be logged in');
	}
}

function apiHeaders(domain: string): Headers {
	ensureLogin(domain);
	return {
		Authorization: `Bearer ${ensureIdent(domain).accessToken}`
	};
}

// ...
export async function timelinesHome(domain: string): Promise<Status[]> {
	const json = await reqGet(apiUrl(domain, `timelines/home`), apiHeaders(domain));
	return json as Status[];
}

// ...
export async function timelinesTag(domain: string, tag: string): Promise<Status[]> {
	const json = await reqGet(apiUrl(domain, `timelines/tag/:${tag}`), apiHeaders(domain));
	return json as Status[];
}

// Determines whether we're _really_ logged in, according to the host.
export async function verifyCredentials(domain: string): Promise<boolean> {
	// Don't bother making a request unless we at least have plausible-looking credentials.
	if (!isLoggedIn(domain)) {
		return false;
	}

	try {
		await reqGet(apiUrl(domain, 'apps/verify_credentials'), apiHeaders(domain));
		return true;
	} catch (e) {
		// Any bad response will throw an exception.
		clearCredentials(domain);
		return false;
	}
}
