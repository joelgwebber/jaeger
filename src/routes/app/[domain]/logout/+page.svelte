<script lang='ts'>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { clearCredentials } from '$lib/auth/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		clearCredentials($page.params.domain);
		goto('/', { replaceState: true });
	});
</script>
