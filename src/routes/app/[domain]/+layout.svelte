<script lang="ts">
	import { onMount } from 'svelte';
	import type { Data } from './+layout';

	export let data: Data;

	onMount(() => {
		console.log('layout mount', window.location.href);
	});
</script>

{#if !data.loggedIn}
	(Not yet logged into {data.domain}) •
	<a href="/app/{data.domain}/login">login</a> •
	<a href="/app/{data.domain}/remove">remove</a>
{:else}
	<a href="/app/{data.domain}/logout">logout</a> •
	<a href="/app/{data.domain}/remove">remove</a>

	<div>
		{#each Object.keys(data.identity.feeds) as name}
			<a href="/app/{data.domain}/feed/{name}">{name}</a>
		{/each}
	</div>
{/if}

<slot />
