import { goto } from '$app/navigation';
import { verifyCredentials } from '$lib/api/api';
import { ensureIdent, identities, type Identity } from '$stores/identity';
import { post } from '../fetch';
import { basename } from '../utils';

export const DefaultTimeout = 20000;
export const WriteTimeout = 45000; // allow more time if the user did a write action
export const MediaWriteTimeout = 90000; // media uploads can take awhile

const Website = 'https://jaeger.social/';
const Scopes = 'read write follow push';
const ClientName = 'Jaeger';

function authRedirectUri(domain: string): string {
	return `${location.origin}/auth/${domain}`;
}

// Determines whether we _appear_ to be logged in. This is mean to be a quick check, so it only
// checks for the existence of domain, app, & token.
export function isLoggedIn(domain: string): boolean {
	const ident = ensureIdent(domain);
	return !!ident && !!ident.clientId && !!ident.clientSecret && !!ident.accessToken;
}

// Clears registration & credentials, for a clean auth slate.
export function clearCredentials(domain: string) {
	identities.update((idents) => {
		if (domain in idents) {
			const ident = idents[domain];
			ident.clientId = '';
			ident.clientSecret = '';
			ident.accessToken = '';
		}
		return idents;
	});
}

// Kicks off the login process for a given domain, authorizing the app and getting an auth token.
// Note that, because oauth, it will redirect the current page (if not already logged in).
export async function login(domain: string) {
	// Ensure the application is registered with this host.
	const ident = ensureIdent(domain);
	if (!ident.clientId) {
		await registerApplication(domain);
	}

	// See if there's a functional access token.
	if (ident.accessToken) {
		let success = await verifyCredentials(domain);
		if (success) {
			goto(`/app/${domain}`, { replaceState: true });
			return;
		}
	}

	// Nope. Kick off the oauth flow.
	authorize(domain);
}

async function registerApplication(domain: string) {
	const url = `${basename(domain)}/api/v1/apps`;
	const json = await post(
		url,
		{
			client_name: ClientName,
			redirect_uris: authRedirectUri(domain),
			scopes: Scopes,
			website: Website
		},
		undefined,
		{ timeout: WriteTimeout }
	);

	const ident = ensureIdent(domain);
	ident.clientId = json['client_id'];
	ident.clientSecret = json['client_secret'];
}

// Redirect the current page to the oauth login page.
// The redirect_uri specified here will continue the auth flow at /login/auth.
async function authorize(domain: string) {
	const ident = ensureIdent(domain);
	if (!ident.clientId) {
		throw "not logged in";
	}

	const u = new URL(`${basename(ident.domain)}/oauth/authorize`);
	u.searchParams.set('lang', 'en');
	u.searchParams.set('response_type', 'code');
	u.searchParams.set('client_id', ident.clientId);
	u.searchParams.set('scope', Scopes);
	u.searchParams.set('redirect_uri', authRedirectUri(domain));
	location.href = u.toString();
}

// Finish the auth flow, using the given authorization code to fill in the accessToken.
// Returns false if something went off the rails.
export async function finishAuth(domain: string, code: string): Promise<boolean> {
	try {
		const ident = ensureIdent(domain);
		if (!ident) {
			throw "missing identity";
		}
		let token = await getToken(domain, code);
		ident.accessToken = token;
		return verifyCredentials(domain);
	} catch (e) {
		return false;
	}
}

// Fetches the oauth token from the authorization code.
async function getToken(domain: string, code: string): Promise<string> {
	const ident = ensureIdent(domain);
	if (!ident.clientId || !ident.clientSecret) {
		throw "not logged in";
	}

	const url = `${basename(ident.domain)}/oauth/token`;
	const json = await post(
		url,
		{
			client_id: ident.clientId,
			client_secret: ident.clientSecret,
			code: code,
			scope: Scopes,
			redirect_uri: authRedirectUri(domain),
			grant_type: 'authorization_code'
		},
		undefined,
		{ timeout: WriteTimeout }
	);
	return json['access_token'];
}
