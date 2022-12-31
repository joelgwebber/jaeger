<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { login } from "$lib/auth/auth";

	if (browser) {
		const domain = $page.params.domain;
		login(domain);
	}
</script>
