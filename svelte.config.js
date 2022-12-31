import adapter from '@sveltejs/adapter-auto';
import path from 'path';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$stores: path.resolve('./src/stores'),
			$lib: path.resolve('./src/lib'),
			$routes: path.resolve('./src/routes'),
		},
	}
};

export default config;
