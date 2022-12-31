<script lang="ts">
	import { page } from '$app/stores';
	import { identities } from '$stores/identity';
	import { get } from 'svelte/store';

	export let domain: string;

	let domains: string[];
	$: domains = Object.keys($identities);
	console.log(get(page).params, get(page).data);
</script>

<div>
	{#each domains as dom, i}
		{#if dom == domain}
			<span class="domain">{dom}</span>
		{:else}
			<a class="domain" data-domain={dom} href="/app/{dom}">{dom}</a>
		{/if}
		{#if i < domains.length - 1}•&nbsp;{/if}
	{/each}
	•
	<a href="/add">add account</a> 
</div>

<style>
	.domain {
		font-weight: bold;
	}

	span.domain {
		display: inline-bock;
	}
</style>
