## Jäger: A simple, fast Mastodon client.

[Note: *very* much an early work in progress. Don't use it yet and expect it to work properly.]

The main purpose of this project is to experiment with ideas for managing Mastodon feeds in a way that makes it easier
to manage multiple areas of interest, without the "home" feed turning into an unreadable stream of garbage. Many people
suggest that you follow #hashtags for this purpose, but that only increases the rate of flow on the home feed.

### Why Jäger?

I'm going on the assumption that Eugen's a fan of [this band](https://en.wikipedia.org/wiki/Mastodon_(band)) from my
hometown, who has a great album called [The Hunter](https://en.wikipedia.org/wiki/The_Hunter_(Mastodon_album)). It
does *not* relate to the notoriously impotable [German liqeur](https://en.wikipedia.org/wiki/J%C3%A4germeister) :)

## Motivation

Lists appear to be an incomplete experiment, and don't solve this problem particularly well in any case. The primary
issue is that anyone you put in a list may post on several different topics, not all of which you may be interested
in. For example, I created a "news" list of journalists (because I've found they're not using tags much, unfortunately).
And it's fairly low-signal, because it turns out journalists are also humans who have interests beyond the news.

You can also *search* #hashtags, which can help, but (a) these searches aren't easily persisted as feeds in most clients,
and (b) an interest-centered feed usually requires several tags to work well. The default Mastodon UI does provide a
facility for persisting tag searches as columns in the "advanced" UI, and you can even add up to four additional tags.
But this still has several problems -- you must first follow the tag you want to persist, if you close the column, you
lose the search completely, and they don't work in the normal UI or on mobile.

I am trying a slightly different approach, that focuses on saved tag searches as the main organizing principle. While
it will support all the standard feeds (e.g., home, local, federated, explore, etc), it will also allow you to create
any number of saved searches that use the basic boolean tag operations provided by the API. Unlike the "advanced" UI,
it will *not* try to implement a complex multi-column UI. But it *will* allow you to easily open multiple accounts and
feeds in separate browser tabs. I personally find this much more manageable and flexible than a more complex single-tab
UI.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
