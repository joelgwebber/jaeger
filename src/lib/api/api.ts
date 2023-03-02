import { clearCredentials, isLoggedIn } from '$lib/auth/auth';
import { reqGet, type Headers } from '$lib/fetch';
import { basename } from '$lib/utils';
import { ensureIdent } from '$stores/identity';
import type { Status } from './entities';

function apiUrl(domain: string, endpoint: string, params?: { [key: string]: any }): string {
	let url = `${basename(domain)}/api/v1/${endpoint}`;
	if (params) {
		url += '?';
		for (let key in params) {
			const val = params[key];
			switch (typeof val) {
				case 'undefined':
					break;
				case 'object':
					if (!('length' in val)) {
						throw new Error(`expected array for value ${val}`);
					}
					const arr = val as Array<string>;
					for (let i = 0; i < arr.length; i++) {
						url += `${key}[]=${encodeURIComponent(val)}&`;
					}
					break;
				default:
					url += `${key}=${encodeURIComponent(val)}&`;
					break;
			}
		}
	}
	return url;
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

export interface TimelinesParams {
	max_id?: string; // Return results older than ID.
	since_id?: string; //  Return results newer than ID.
	min_id?: string; //  Return results immediately newer than ID.
	limit?: number; //  Maximum number of results to return. Defaults to 20 statuses. Max 40 statuses.
};

export interface TimelinesPublicParams extends TimelinesParams {
	local?: boolean; // TODO
	remote?: boolean; // TODO
	only_media?: boolean; // TODO
};

export interface TimelinesTagParams extends TimelinesPublicParams {
	any?: string[]; // TODO
	all?: string[]; // TODO
	none?: string[]; // TODO
};

// ...
export async function timelinesHome(domain: string, params: TimelinesParams): Promise<Status[]> {
	const json = await reqGet(apiUrl(domain, `timelines/home`, params), apiHeaders(domain));
	return json as Status[];
}

// ...
export async function timelinesPublic(
	domain: string,
	params: TimelinesPublicParams
): Promise<Status[]> {
	const json = await reqGet(apiUrl(domain, `timelines/public`, params), apiHeaders(domain));
	return json as Status[];
}

// ...
export async function timelinesTag(
	domain: string,
	tag: string,
	params: TimelinesTagParams
): Promise<Status[]> {
	const json = await reqGet(apiUrl(domain, `timelines/tag/${tag}`, params), apiHeaders(domain));
	return json as Status[];
}

// ...
export async function timelinesList(domain: string, listId: string, params: TimelinesPublicParams): Promise<Status[]> {
	const json = await reqGet(apiUrl(domain, `timelines/list/${listId}`, params), apiHeaders(domain));
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
