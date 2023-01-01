<script lang="ts">
	import StatusFeed from '$routes/StatusFeed.svelte';
	import type { Data } from './+page';

	export let data: Data;
</script>

<StatusFeed domain={data.domain} feed={data.feed} />
