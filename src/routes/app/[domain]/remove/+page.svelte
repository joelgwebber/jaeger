<script lang='ts'>
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { removeIdent } from "$stores/identity";
	import { onMount } from 'svelte';

	onMount(() => {
		const domain = $page.params.domain;
		if (window.confirm(`Are you sure you want to remove ${domain}?`)) {
			removeIdent(domain);
		}
		goto('/');
	});
</script>
