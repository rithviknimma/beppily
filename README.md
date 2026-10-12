# beppily ever after 🐈

A countdown to the day bep and bepper live together, drawn like a page out of a
kid's notebook. Two cats, fetched fresh on every visit.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173/beppily/
```

Note the `/beppily/` path — see "The subpath" below.

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint
```

## Things worth knowing before you change something

### The date is one line

`src/lib/countdown.js`:

```js
export const EVENT_ISO = '2028-08-31T00:00:00-04:00'
```

That offset is deliberate and the only genuinely non-obvious thing here. It is a
**fixed instant** — midnight on Thursday, Aug 31 2028 in US Eastern time (EDT,
UTC-4; DST doesn't end until November) — not a viewer-local wall clock. bep and
bepper are in different timezones, so anchoring to the destination means both of
them always see the same numbers instead of one of them always being further
away. Nothing on the page says this out loud; it's here instead.

Two side effects, both intended:

- the days figure can jump by 1–3 when a month boundary passes, because calendar
  months are different lengths;
- the hours figure shifts by one across a US DST boundary, because calendar
  months are wall-clock units.

Once the date passes, the page says "beppily ever after starts today" and the
same clock counts up instead.

### The cats

`src/lib/cats.js` tries three sources in order:

1. [TheCatAPI](https://thecatapi.com) — no key needed
2. [cataas](https://cataas.com) — backup
3. `public/cats/fallback-*.jpg` — committed to this repo, so a cat always
   appears even with both APIs down

Photos and gifs are both accepted as-is. No filtering: TheCatAPI's
`mime_types=gif` filter leaks jpgs anyway, and the surprise is half the fun.

### The subpath

GitHub Pages serves a *project* site from `/beppily/`, so `vite.config.js` sets
`base: '/beppily/'` and `index.html` references `/beppily/favicon.svg` and the
font path directly. The dev server respects `base` too, which is why local dev
runs at `localhost:5173/beppily/`.

**If the repo is renamed or a custom domain is added**, update `base` in
`vite.config.js` and the three `/beppily/...` paths in `index.html` (favicon,
font preload, and the two OG image URLs).

### The font

Patrick Hand is self-hosted in `public/fonts/` (14 KB, latin subset) so the page
has no third-party font dependency. The fallback stack is Comic Sans, on purpose.

## Hosting (not set up yet)

`.github/workflows/deploy.yml` is committed but inert. To turn it on:
repo **Settings → Pages → Source → GitHub Actions**, then push to `main`. The
site lands at `https://rithviknimma.github.io/beppily/`.
