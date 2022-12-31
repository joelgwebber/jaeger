<script lang="ts">
	import { enhance } from '$app/forms';
	import { login } from '$lib/auth/auth';
	import type { SubmitFunction } from '@sveltejs/kit';

	export const submitLogin = (({ data, cancel }) => {
		cancel();

		const domain = data.get('domain') as string;
		if (!domain || domain.trim() == '') {
			alert('please specify a domain');
			return;
		}

		login(domain).catch((reason: any) => {
			alert(reason);
		});
	}) satisfies SubmitFunction;
</script>

<form use:enhance={submitLogin} method="POST" action="login">
	<label>domain<input type="text" name="domain" placeholder="mastodon.example.com" /></label>
	<input type="submit" />
</form>
