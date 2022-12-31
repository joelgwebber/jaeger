import { timelinesHome } from '$lib/api/api';
import type { Account, Status } from '$lib/api/entities';
import { get } from 'svelte/store';
import { defineLocalStore } from './stores';

export const identities = defineLocalStore<{ [domain: string]: Identity }>('identities', {});

export type Identity = {
	domain: string;
	acct?: Account;

	clientId?: string;
	clientSecret?: string;
	accessToken?: string;

	timelines: TimelineParams[];
	curTimeline: number;
};

export function removeIdent(domain: string) {
	identities.update((idents) => {
		delete idents[domain];
		return idents;
	});
}

export function ensureIdent(domain: string): Identity {
	if (!get(identities)) {
		identities.set({});
	}

	identities.update((idents) => {
		if (!(domain in idents)) {
			idents[domain] = {
				domain: domain,
				timelines: defaultTimelines(),
				curTimeline: 0
			};
		}
		return idents;
	});

	return get(identities)[domain];
}

function defaultTimelines(): TimelineParams[] {
	return [
		{
			name: 'Home',
			type: 'home'
		},
		{
			name: 'Local',
			type: 'public',
			local: true
		},
		{
			name: 'Federated',
			type: 'public',
			local: true,
			remote: true
		},
		{
			name: 'Game development',
			type: 'tag',
			local: true,
			remote: true,
			anyTags: ['gamedev', 'indiedev', 'pixelart', 'gameart']
		}
	];
}

export async function fetchTimeline(domain: string, timeline: TimelineParams): Promise<Status[]> {
	switch (timeline.type) {
		case 'home':
			return timelinesHome(domain);
		case 'public':
			break;
		case 'tag':
			break;
		case 'list':
			break;
	}
	return [];
}

export type TimelineParams =
	| PublicTimelineParams
	| HomeTimelineParams
	| TagTimelineParams
	| ListTimelineParams;

export interface HomeTimelineParams {
	name: string;
	type: 'home';
}

export interface PublicTimelineParams {
	name: string;
	type: 'public';

	local?: boolean;
	remote?: boolean;
	mediaOnly?: boolean;
}

export interface TagTimelineParams {
	name: string;
	type: 'tag';

	local?: boolean;
	remote?: boolean;
	mediaOnly?: boolean;

	anyTags?: string[];
	allTags?: string[];
	noneTags?: string[];
}

export interface ListTimelineParams {
	name: string;
	type: 'list';
	listId: string;
}
