export interface MediaStatusPost {
	id?: string;
	in_reply_to_id?: string;
	media_ids: Array<string>;
	poll?: undefined;
	scheduled_at?: Date;
	sensitive?: boolean;
	spoiler_text?: string;
	status?: string;
	visibility?: Visibility;
}

export interface Status {
	account: Account;
	application?: Application;
	bookmarked?: boolean;
	card?: Card | null;
	created_at: string;
	content: string;
	edited_at?: string;
	emojis: Array<Emoji>;
	favourited?: boolean;
	favourites_count: number;
	id: string;
	in_reply_to_account_id?: string | null;
	in_reply_to_id?: string | null;
	language?: string | null;
	media_attachments: Array<MediaAttachment>;
	mentions: Array<StatusMention>;
	muted?: boolean;
	pinned?: boolean;
	poll?: Poll | null;
	reblog?: Status | null;
	reblogged?: boolean;
	reblogs_count: number;
	replies_count: number;
	sensitive: boolean;
	spoiler_text: string;
	tags: Array<Tag>;
	text?: string | null;
	uri: string;
	url?: string | null;
	visibility: Visibility;
}

export interface StatusMention {
	acct: string;
	id: string;
	username: string;
	url: string;
}

export type StatusPost = MediaStatusPost | TextStatusPost;

export interface StatusSchedule {
	id: string;
	media_attachments: Array<MediaAttachment>;
	params: Partial<Status>;
	scheduled_at: string;
}

export interface TextStatusPost {
	id?: string;
	in_reply_to_id?: string;
	media_ids?: undefined;
	poll?: TextStatusPostPoll;
	scheduled_at?: Date;
	sensitive?: boolean;
	spoiler_text?: string;
	status: string;
	visibility?: Visibility;
}

export interface TextStatusPostPoll {
	expires_in: number;
	hide_totals?: boolean;
	multiple?: boolean;
	options: Array<string>;
}

export type Visibility = 'direct' | 'private' | 'public' | 'unlisted';

export interface Account {
	acct: string;
	avatar?: string;
	avatar_static?: string;
	bot?: boolean;
	created_at: string;
	discoverable?: boolean;
	display_name: string;
	followers_count: number;
	following_count: number;
	group?: boolean;
	header?: string;
	header_static?: string;
	id: string;
	last_status_at: string;
	locked?: boolean;
	note?: string;
	statuses_count: number;
	url: string;
	username: string;
}

export interface Application {
	name: string;
	website?: string | null;
}

interface BaseCard {
	description: string;
	title: string;
	type: string;
	url: string;
}

export type Card = LinkCard | PhotoCard | VideoCard;

export interface LinkCard extends BaseCard {
	type: 'link';
}

export interface PhotoCard extends BaseCard {
	author_name: string;
	author_url: string;
	blurhash: string;
	embed_url: string;
	height: number;
	image: string;
	provider_name: string;
	provider_url: string;
	type: 'photo';
	width: number;
}

export interface VideoCard extends BaseCard {
	author_name: string;
	author_url: string;
	blurhash: string;
	height: number;
	html: string;
	image: string;
	provider_name: string;
	provider_url: string;
	type: 'video';
	width: number;
}

export interface Emoji {
	category?: string;
	shortcode: string;
	static_url: string;
	url: string;
	visible_in_picker: boolean;
}

export interface List {
	id: string;
	replies_policy?: string;
	title: string;
}

export type ListAccounts = Array<Account>;

export interface ListAccountsDelete {
	account_ids: Array<string>;
}

export interface ListAccountsPost {
	account_ids: Array<string>;
}

export interface ListPost {
	id?: string;
	replies_policy?: string;
	title: string;
}

export interface AudioAttachment {
	blurhash?: string | null;
	description?: string | null;
	id: string;
	meta: AudioAttachmentMeta;
	preview_url: string;
	remote_url?: string | null;
	/** @deprecated */
	text_url?: string;
	type: 'audio';
	url: string;
}

export interface AudioAttachmentMeta {
	audio_bitrate: string;
	audio_channels: string;
	audio_encode: string;
	duration: number;
	length: string;
	original: AudioAttachmentMetaOriginal;
}

export interface AudioAttachmentMetaOriginal {
	bitrate: number;
	duration: number;
}

export interface GIFVAttachment {
	blurhash: string;
	description?: string | null;
	id: string;
	meta: GIFVAttachmentMeta;
	preview_url: string;
	remote_url?: string | null;
	/** @deprecated */
	text_url?: string;
	type: 'gifv';
	url: string;
}

export interface GIFVAttachmentMeta {
	aspect: number;
	duration: number;
	fps: number;
	height: number;
	length: string;
	original: GIFVAttachmentMetaOriginal;
	size: string;
	small: GIFVAttachmentMetaSmall;
	width: number;
}

export interface GIFVAttachmentMetaOriginal {
	bitrate: number;
	duration: number;
	frame_rate: string;
	height: number;
	width: number;
}

export interface GIFVAttachmentMetaSmall {
	aspect: number;
	height: number;
	size: string;
	width: number;
}

export interface ImageAttachment {
	blurhash: string;
	description?: string | null;
	id: string;
	meta: ImageAttachmentMeta;
	preview_url: string;
	remote_url?: string | null;
	/** @deprecated */
	text_url?: string;
	type: 'image';
	url: string;
}

export interface ImageAttachmentMeta {
	focus: ImageAttachmentMetaFocus;
	original: ImageAttachmentMetaOriginal;
	small: ImageAttachmentMetaSmall;
}

export interface ImageAttachmentMetaFocus {
	x: number;
	y: number;
}

export interface ImageAttachmentMetaOriginal {
	aspect: number;
	height: number;
	size: string;
	width: number;
}

export interface ImageAttachmentMetaSmall {
	aspect: number;
	height: number;
	size: string;
	width: number;
}

export type MediaAttachment =
	| AudioAttachment
	| GIFVAttachment
	| ImageAttachment
	| UnknownAttachment
	| VideoAttachment;

/**
 * Interface to post a new media attachment.
 */
export interface MediaAttachmentPost {
	file: Blob | File;
	thumbnail?: Blob;
	description?: string;
	focus?: string;
}

export interface UnknownAttachment {
	description?: string | null;
	id: string;
	meta: Record<string, Record<string, number | string>>;
	preview_url: string;
	remote_url?: string | null;
	/** @deprecated */
	text_url?: string;
	type: 'unknown';
	url: string;
}

export interface VideoAttachment {
	blurhash: string;
	description?: string | null;
	id: string;
	meta: VideoAttachmentMeta;
	preview_url: string;
	remote_url?: string | null;
	/** @deprecated */
	text_url?: string;
	type: 'video';
	url: string;
}

export interface VideoAttachmentMeta {
	aspect: number;
	audio_bitrate: string;
	audio_channels: string;
	audio_encode: string;
	duration: number;
	fps: number;
	height: number;
	length: string;
	original: VideoAttachmentMetaOriginal;
	size: string;
	small: VideoAttachmentMetaSmall;
	width: number;
}

export interface VideoAttachmentMetaOriginal {
	bitrate: number;
	duration: number;
	frame_rate: string;
	height: number;
	width: number;
}

export interface VideoAttachmentMetaSmall {
	aspect: number;
	height: number;
	size: string;
	width: number;
}

export interface Poll {
	emojis: Array<unknown>;
	expired: boolean;
	expires_at: string;
	id: string;
	multiple?: boolean;
	options: Array<PollOption>;
	own_votes: Array<number>;
	voted: boolean;
	voters_count?: number | null;
	votes_count: number;
}

export interface PollOption {
	title: string;
	votes_count: number;
}

export interface PollVotePost {
	choices: Array<number>;
}

export interface Search {
	account_id?: string;
	exclude_unreviewed?: boolean;
	following?: boolean;
	max_id?: string;
	min_id?: string;
	q: string;
	limit?: number;
	offset?: number;
	resolve?: boolean;
	type?: string;
}

export interface SearchResults {
	accounts: Array<Account>;
	hashtags: Array<Tag>;
	statuses: Array<Status>;
}

export interface Tag {
	history?: Array<TagStatistic>;
	name: string;
	url: string;
}

export interface TagStatistic {
	accounts: number;
	day: number;
	uses: number;
}
