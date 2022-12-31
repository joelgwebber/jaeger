<script lang="ts">
	import type { Status } from '$lib/api/entities';
	import { isLoggedIn } from '$lib/auth/auth';
	import { ensureIdent, fetchTimeline } from '$stores/identity';
	import { writable } from 'svelte/store';

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
			stats.set(await fetchTimeline(domain, ident.timelines[0]));
		}
	}
</script>

<div class="Feed">
	{#if console.log('render') === undefined}...{/if}
	{#each $stats as stat (stat.id)}
		<div class="Item">
			<div>{stat.created_at}</div>
			<div>{@html stat.content}</div>
		</div>
	{/each}
</div>

<style>
	.Feed {
		background-color: white;
	}

	.Feed > .Item {
		margin-top: 12px;
		border-bottom: 1px solid gray;
	}
</style>
