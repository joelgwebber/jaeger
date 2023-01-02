<script lang="ts">
	import type { Status } from '$lib/api/entities';
	import MediaAttachment from './MediaAttachment.svelte';

	export let stat: Status;

	let real_stat: Status;
	$: real_stat = stat.reblog ? stat.reblog : stat;

	function renderDate(isoDate: string): string {
		// TODO: Shorthands.
		const d = new Date(isoDate);
		return d.toLocaleString();
	}
</script>

<div class="StatusCard">
	<!-- Boost header -->
	{#if stat.reblog}
		<div class="Header">
			<img
				src={stat.account.avatar}
				width="32"
				height="32"
				alt="Avater for {stat.account.display_name}"
			/>
			{stat.account.display_name} boosted
		</div>
	{/if}

	<img
		class="Avatar"
		src={real_stat.account.avatar}
		width="64"
		height="64"
		alt="Avater for {stat.account.display_name}"
	/>

	<div class="Name">{real_stat.account.display_name} • {real_stat.account.acct}</div>
	<div class="Time">{renderDate(real_stat.created_at)}</div>

	<!-- Content -->
	<div class="Content">
		<p>{@html real_stat.content}</p>

		<!-- Media -->
		{#each real_stat.media_attachments as media}
			<MediaAttachment {media} />
		{/each}
	</div>

	<!-- Footer -->
	<div class="Footer">{real_stat.favourites_count} likes • {real_stat.reblogs_count} boosts</div>
</div>

<style lang="scss">
	.invisible {
		display: none;
	}

	.StatusCard {
		margin-top: 12px;
		border-bottom: 1px solid gray;
		display: grid;
		grid-template-areas:
			'header header header header'
			'avatar name name time'
			'avatar content content content'
			'footer footer footer footer';

		.Header {
			grid-area: header;
		}

		.Avatar {
			grid-area: avatar;
			margin-right: 4px;
		}

		.Name {
			grid-area: name;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		.Time {
			grid-area: time;
			text-align: right;
		}

		.Content {
			grid-area: content;
		}

		.Footer {
			grid-area: footer;
			margin-bottom: 8px;
		}
	}
</style>
