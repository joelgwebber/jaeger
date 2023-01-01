<script lang='ts'>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { finishAuth } from '$lib/auth/auth';
	import { onMount } from 'svelte';

	onMount(async () => {
		const domain = $page.params.domain;
		const code = $page.url.searchParams.get('code');
		if (code) {
			console.log('-> finishAuth');
			let success = await finishAuth(domain, code);
			if (success) {
				// All good. Go back to the app.
				console.log('<- finishAuth');
				goto(`/app/${domain}`, { replaceState: true });
				return;
			}
		}

		// Something went wonky. Go home.
		goto('/', { replaceState: true });
	});
</script>

<div>
	Auth token: <code>{$page.url.searchParams.get('code')}</code>
</div>
