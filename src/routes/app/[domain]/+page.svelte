<script lang="ts">
	import { isLoggedIn } from '$lib/auth/auth';
	import StatusFeed from '$routes/StatusFeed.svelte';
	import type { Data } from './+page';

	export let data: Data;
</script>

{#if isLoggedIn(data.domain)}
	<a href="/app/{data.domain}/logout">logout</a>
	<a href="/app/{data.domain}/remove">remove</a>
	<StatusFeed domain={data.domain} feed="home" />
{:else}
	<a href="/app/{data.domain}/login">login</a>
	<a href="/app/{data.domain}/remove">remove</a>
{/if}
