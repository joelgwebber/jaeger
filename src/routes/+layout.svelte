<script lang="ts">
	import IdentityList from './IdentityList.svelte';
	import { page } from '$app/stores';
</script>

<!-- This uses $page.params, because it needs 'domain' to be filled in by child pages. -->
<IdentityList domain={$page.params.domain} />
<slot />
