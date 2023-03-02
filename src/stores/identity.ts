import {
	timelinesHome,
	timelinesList,
	timelinesPublic,
	timelinesTag,
	type TimelinesParams,
	type TimelinesPublicParams,
	type TimelinesTagParams
} from '$lib/api/api';
import type { Account, Status } from '$lib/api/entities';
import { get, writable, type Writable } from 'svelte/store';
import { defineLocalStore } from './stores';

export interface FeedCache {
	stats: Status[];
}

export const identities = defineLocalStore<{ [domain: string]: Identity }>('identities', {});
export const timelineCache: { [key: string]: Writable<FeedCache> } = {};

export type Identity = {
	domain: string;
	acct?: Account;

	clientId?: string;
	clientSecret?: string;
	accessToken?: string;

	feeds: { [name: string]: FeedParams };
	curFeed: number;
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
				curFeed: 0
			};
		}
		return idents;
	});

	return get(identities)[domain];
}

function defaultFeeds(): { [name: string]: FeedParams } {
	return {
		Home: {
			name: 'Home',
			type: 'home'
		},
		Local: {
			name: 'Local',
			type: 'public',
			kinds: {
				local: true
			}
		},
		Federated: {
			name: 'Federated',
			type: 'public',
			kinds: {
				remote: false // This is weird, but it's what the existing UI does.
			}
		},
		'Game development': {
			name: 'Game development',
			type: 'tag',
			kinds: {},
			tag: 'gamedev',
			any: ['indiedev', 'pixelart', 'gameart']
		}
	};
}

export function getFeedCache(domain: string, feed: FeedParams): Writable<FeedCache> {
	const key = feedKey(domain, feed);
	if (!(key in timelineCache)) {
		timelineCache[key] = writable<FeedCache>({
			stats: []
		});
		fillFeedCache(domain, feed, {
			newer: false,
			limit: 20,
		});
	}
	return timelineCache[key];
}

export function fillFeedCache(domain: string, feed: FeedParams, range: FeedRange) {
	const key = feedKey(domain, feed);
	timelineCache[key];
	fetchFeed(domain, feed, range)
		.then((stats: Status[]) => {
			getFeedCache(domain, feed).update((cache) => {
				if (range.newer) {
					cache.stats = stats.concat(...cache.stats);
				} else {
					cache.stats = cache.stats.concat(...stats);
				}
				return cache;
			});
		})
		.catch((reason: any) => {
			// TODO: ...
			console.error(reason);
		});
}

async function fetchFeed(domain: string, feed: FeedParams, range: FeedRange): Promise<Status[]> {
	function fillRange(params: TimelinesParams, range: FeedRange) {
		const existing = get(getFeedCache(domain, feed)).stats;
		if (existing.length > 0) {
			if (range.newer) {
				params.min_id = existing[0].id;
			} else {
				params.max_id = existing[existing.length - 1].id;
			}
		}
		params.limit = range.limit;
	}

	function fillKind(params: TimelinesPublicParams, kinds: FeedKinds) {
		params.local = kinds.local;
		params.remote = kinds.remote;
		params.only_media = kinds.media;
	}

	switch (feed.type) {
		case 'home': {
			const params: TimelinesParams = {};
			fillRange(params, range);
			return timelinesHome(domain, params);
		}

		case 'public': {
			const params: TimelinesPublicParams = {};
			fillRange(params, range);
			fillKind(params, feed.kinds);
			return timelinesPublic(domain, params);
		}

		case 'list': {
			const params: TimelinesPublicParams = {};
			fillRange(params, range);
			fillKind(params, feed.kinds);
			return timelinesList(domain, feed.listId, params);
		}

		case 'tag': {
			const params: TimelinesTagParams = {};
			fillRange(params, range);
			fillKind(params, feed.kinds);
			params.any = feed.any;
			params.all = feed.all;
			params.none = feed.none;
			return timelinesTag(domain, feed.tag, params);
		}
	}
}

export function feedKey(domain: string, feed: FeedParams): string {
	function bool(obj: any, key: string): string {
		return obj[key] ? ':' + key : '';
	}
	function pub(params: FeedKinds): string {
		if (!params) {
			return '';
		}
		return `${bool(params, 'local')}${bool(params, 'remote')}${bool(params, 'media')}`;
	}
	function strs(obj: any, key: string): string {
		if (!obj) {
			return '';
		}
		return obj[key] ? ':' + obj[key].join(',') : '';
	}
	function tag(params: TagFeedParams): string {
		if (!params) {
			return '';
		}
		return `${params.tag}${strs(params.any, 'any')}${strs(params.all, 'all')}${strs(
			params.none,
			'none'
		)}`;
	}

	switch (feed.type) {
		case 'home':
			return `${domain}:${feed.type}`;
		case 'public':
			return `${domain}:${feed.type}${pub(feed.kinds)}`;
		case 'list':
			return `${domain}:${feed.type}${pub(feed.kinds)}:${feed.listId}}`;
		case 'tag':
			return `${domain}:${feed.type}${pub(feed.kinds)}:${tag(feed)}`;
	}
}

export type FeedParams = HomeFeedParams | PublicFeedParams | ListFeedParams | TagFeedParams;

export interface FeedRange {
	newer: boolean;
	limit: number;
}

export interface FeedKinds {
	local?: boolean;
	remote?: boolean;
	media?: boolean;
}

export interface HomeFeedParams {
	type: 'home';
	name: string;
}

export interface PublicFeedParams {
	type: 'public';
	name: string;
	kinds: FeedKinds;
}

export interface ListFeedParams {
	type: 'list';
	name: string;
	kinds: FeedKinds;
	listId: string;
}

export interface TagFeedParams {
	type: 'tag';
	name: string;
	kinds: FeedKinds;
	tag: string;
	any?: string[];
	all?: string[];
	none?: string[];
}
