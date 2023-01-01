import {
	timelinesHome,
	timelinesList,
	timelinesPublic,
	timelinesTag,
	type TimelinesPublicParams,
	type TimelinesTagParams
} from '$lib/api/api';
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

	feeds: { [name: string]: TimelineParams };
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
				feeds: defaultFeeds(),
				curTimeline: 0
			};
		}
		return idents;
	});

	return get(identities)[domain];
}

function defaultFeeds(): { [name: string]: TimelineParams } {
	return {
		Home: {
			name: 'Home',
			type: 'home'
		},
		Local: {
			name: 'Local',
			type: 'public',
			params: {
				local: true
			}
		},
		Federated: {
			name: 'Federated',
			type: 'public',
			params: {
				remote: false // This is weird, but it's what the existing UI does.
			}
		},
		'Game development': {
			name: 'Game development',
			type: 'tag',
			tag: 'gamedev',
			params: {
				any: ['indiedev', 'pixelart', 'gameart']
			}
		}
	};
}

export async function fetchTimeline(domain: string, timeline: TimelineParams): Promise<Status[]> {
	switch (timeline.type) {
		case 'home':
			return timelinesHome(domain);
		case 'public':
			return timelinesPublic(domain, timeline.params);
		case 'tag':
			return timelinesTag(domain, timeline.tag, timeline.params);
		case 'list':
			return timelinesList(domain, timeline.listId);
			break;
	}
	return [];
}

export type TimelineParams =
	| HomeTimelineParams
	| PublicTimelineParams
	| TagTimelineParams
	| ListTimelineParams;

export interface HomeTimelineParams {
	name: string;
	type: 'home';
}

export interface PublicTimelineParams {
	name: string;
	type: 'public';
	params: TimelinesPublicParams;
}

export interface TagTimelineParams {
	name: string;
	type: 'tag';
	tag: string;
	params: TimelinesTagParams;
}

export interface ListTimelineParams {
	name: string;
	type: 'list';
	listId: string;
}
