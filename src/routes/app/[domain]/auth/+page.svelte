<script lang='ts'>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { finishAuth } from '$lib/auth/auth';
	import { onMount } from 'svelte';

	onMount(async () => {
		const domain = $page.params.domain;
		const code = $page.url.searchParams.get('code');
		if (code) {
			let success = await finishAuth(domain, code);
			if (success) {
				// All good. Go back to the app.
				goto(`/app/${domain}`, { replaceState: true });
				return;
			}
		}

		// Something went wonky. Try logging in again.
		goto('/login', { replaceState: true });
	});
</script>

<div>
	Auth token: <code>{$page.url.searchParams.get('code')}</code>
</div>
