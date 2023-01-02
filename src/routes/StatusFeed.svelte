<script lang="ts">
	import type { Status } from '$lib/api/entities';
	import { isLoggedIn } from '$lib/auth/auth';
	import { ensureIdent, fetchTimeline } from '$stores/identity';
	import { writable } from 'svelte/store';
	import StatusCard from './StatusCard.svelte';

	export let domain: string;
	export let feed: string;

	let stats = writable<Status[]>([]);

	$: {
		// Fetch the feed whenever domain/feed change.
		fetchFeed(domain, feed);
	}

	// TODO: The feed part
	async function fetchFeed(domain: string, feed: string) {
		stats.set([]);
		if (isLoggedIn(domain)) {
			const ident = ensureIdent(domain);
			stats.set(await fetchTimeline(domain, ident.feeds[feed]));
		}
	}
</script>

<div class="Feed">
	{#each $stats as stat (stat.id)}
		<StatusCard {stat} />
	{/each}
</div>

<style>
	.Feed {
		background-color: white;
	}
</style>
