<script lang="ts">
	import type { Data } from './+layout';

	export let data: Data;
</script>

{#if data.loggedIn}
	Pick a feed.
{/if}
