import type { PageLoad } from './$types';

export type Data = {
	domain: string;
	feed: string;
};

export const load = async function ({ params, parent }): Promise<Data> {
	const parentData = await parent();
	return {
		domain: parentData.domain,
		feed: params.feed,
	};
} satisfies PageLoad;
