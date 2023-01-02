<script lang="ts">
	import type { MediaAttachment } from '$lib/api/entities';

	export let media: MediaAttachment;
</script>

{#if media.type == 'image'}
	<img width=480 height=320 class="media" src={media.preview_url} alt={media.description} />
{:else if media.type == 'video'}
	<video width=480 height=320 class="media" src={media.url} />
{:else if media.type == 'gifv'}
	<img width=480 height=320 src={media.preview_url}/>
{:else if media.type == 'unknown'}
	[unknown {media.url}]
{/if}

<style>
	.media {
	}
</style>
