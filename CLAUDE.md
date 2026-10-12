# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Commands, the cat API list, and hosting steps are in `@README.md` — don't duplicate them here.

## The event date is one line, and its timezone is deliberate

`src/lib/countdown.js`:

```js
export const EVENT_ISO = '2028-08-31T00:00:00-04:00'
```

The `-04:00` is not a mistake to clean up. It makes the target a **fixed instant**
(midnight ET, EDT in August) rather than a viewer-local wall clock, because the two
people this page is for live in different timezones and must always see the same
numbers. Converting this to a local-time string or a `new Date(y, m, d)` constructor
silently breaks that. Nothing on the page explains the offset — this is the only
place it's written down besides the README.

Months are walked as real calendar months in Eastern time. Two artifacts are
intended, not bugs: the days figure can jump 1-3 at a month boundary, and the hours
figure shifts by one across a US DST change.

## The `/beppily/` base path

GitHub Pages serves this as a project site from a subpath. It's hardcoded in four
places: `base` in `vite.config.js`, and the favicon, font preload, and two OG image
URLs in `index.html`. Get it wrong and the build still succeeds — the page just
renders blank. Any rename or custom domain means updating all four. Local dev runs
at `localhost:5173/beppily/` for the same reason.

## Cats

`src/lib/cats.js` tries TheCatAPI, then cataas, then images committed in
`public/cats/`. Keep all three: the page must still show a cat in Aug 2028 with both
APIs dead. Don't add a mime-type filter — gifs and photos are both wanted, and
TheCatAPI's `mime_types=gif` filter returns jpgs anyway.

## Design direction

The page is committed to looking like a page from a kid's notebook: ruled paper,
crayon strokes, wobbly hand-drawn boxes, taped-in photos. Two rules that aren't
visible in the code:

- **No stick figures.** bep and bepper are the cats, never drawn people.
- **The drawing is childlike; the writing is sincere.** Don't add misspellings or
  baby talk.
- The page carries only the title, the countdown, and the cats. Requests to add
  subtitles, dates, or explanatory copy were explicitly declined — ask before adding
  text.

## Workflow

- Commit to `main`, but **never push.** Pushing is what deploys the live site, so
  that's the user's call.
- Before claiming a visual change works, actually look at the page: run the dev
  server and drive headless Chrome over the DevTools Protocol
  (`--remote-debugging-port`, `Emulation.setDeviceMetricsOverride`, then
  `Page.captureScreenshot`).
  **Do not size a mobile screenshot with `--window-size`** — macOS Chrome enforces a
  ~600px minimum window, so the page renders at 600px and the screenshot is a crop,
  which looks exactly like a broken layout. Use device-metrics emulation and confirm
  overflow with `document.documentElement.scrollWidth` vs `clientWidth`.

## Known non-issue

The `oxlint-disable-next-line react/set-state-in-effect` in `src/App.jsx` is
intentional: every `setState` in `loadCats` runs after an `await`, so it isn't
synchronous, and the rule can't see past the await. `npm run lint` is clean — keep it
that way rather than re-"fixing" this.
