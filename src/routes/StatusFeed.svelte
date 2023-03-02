<script lang="ts">
	import type { Status } from '$lib/api/entities';
	import {
		ensureIdent,
		fillFeedCache,
		getFeedCache,
		type FeedCache,
		type FeedParams,
		type FeedRange
	} from '$stores/identity';
	import type { Unsubscriber, Writable } from 'svelte/store';
	import StatusCard from './StatusCard.svelte';

	export let domain: string;
	export let feed: string;

	let unsub: Unsubscriber;
	let params: FeedParams;
	let cache: Writable<FeedCache>;
	let stats: Status[];
	let latest = new Date();

	$: {
		// Unsubscribe from any existing feed.
		if (unsub) {
			unsub();
		}

		// Change the timeline whenever domain/feed change.
		const ident = ensureIdent(domain);
		params = ident.feeds[feed];
		cache = getFeedCache(domain, ident.feeds[feed]);
		unsub = cache.subscribe((value) => {
			if (latest.getDate() == 0) {
				latest = new Date(value.stats[0].created_at);
			}
			stats = value.stats.filter(stat => new Date(stat.created_at).getDate() < latest.getDate());
		});
		latest.setDate(0);
	}

	function moar(newer: boolean) {
		let range: FeedRange = { limit: 20, newer: newer };
		fillFeedCache(domain, params, range);
	}
</script>

<button on:click={() => moar(true)}>MOAR</button>
<div class="Feed">
	{#each stats as stat (stat.id)}
		<StatusCard {stat} />
	{/each}
</div>
<button on:click={() => moar(false)}>MOAR</button>

<style>
	.Feed {
		background-color: white;
	}
</style>
