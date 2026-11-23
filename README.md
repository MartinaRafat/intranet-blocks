# Intranet Blocks

Gutenberg blocks for an employee intranet homepage. They work in Arabic (RTL), and they look the same on any theme: color, font and text size are set once in **Settings > Intranet Blocks**.

## Blocks

**Portal Carousel** (`intranet/carousel` + `intranet/slide`)
Announcement slides with a background image, heading, text and button.
- Sliding is CSS scroll-snap, so swipe and trackpad work without extra code
- Arrows, dots, keyboard arrows (reversed in RTL), autoplay with a visible pause button
- Autoplay pauses on hover, focus and hidden tabs, and is skipped for people who prefer reduced motion
- Off-screen slides are `inert`, so keyboard users don't tab into hidden buttons
- In the editor the slides are stacked so they're easy to edit

**Announcement Bar** (`intranet/announcement`)
A short notice for the top of the page.
- Four types: information, good news, heads up, urgent
- Optional link
- People can close it. It stays closed in their browser (localStorage) until the message is edited, then it shows again

**Key Numbers** (`intranet/stats` + `intranet/stat`)
Big numbers with a label, like headcount or ticket stats.
- Counts up from zero the first time it scrolls into view, keeping prefixes, suffixes, decimals and thousands separators ("1,250", "94%", "$2.5M")
- Values that aren't plain numbers ("24/7") are left as they are
- No animation for people who prefer reduced motion

**Video Gallery** (`intranet/video-gallery` + `intranet/video`)
Training and company videos.
- YouTube, Vimeo or MP4 links. YouTube thumbnails are picked up automatically, or choose your own image
- Plays in a `<dialog>` on top of the page (youtube-nocookie for YouTube). Closing it stops the video and puts focus back on the thumbnail
- Without JS the thumbnails are plain links to the video

**Quick Links** (`intranet/quick-links` + `intranet/quick-link`)
Icon tiles for the tools people open every day.
- Icon picker (12 icons), optional badge ("New", "Updated"), URL with page search, new tab option
- Three styles from the Styles panel: Soft, Outline, Solid
- Columns setting on the parent

**Events** (`intranet/events`)
Upcoming events from the Events post type the plugin adds.
- Date badge, weekday and time in the site's format, location, region tag
- Region filter buttons when events come from more than one region
- "Add to calendar" downloads an .ics file (times converted to UTC)
- Event date, end and location are edited in an "Event details" panel in the editor sidebar
- Regions are a normal taxonomy, so they get the standard editor panel
- When the Events list is empty there's a button to add six sample events

**News Cards** (`intranet/news-cards`)
Latest posts.
- Featured layout (first post larger) or an even grid
- Category filter buttons, reading time, image/date/excerpt toggles
- Whole card is clickable through the title link, so there's one link per card for screen readers

**Document Accordion** (`intranet/accordion` + `intranet/accordion-item`)
Sections for policies and documents.
- Built on `<details>` / `<summary>`, so it works without JavaScript
- Search box that filters sections as you type and opens the matches
- Expand all / Collapse all
- A small tag per section ("4 documents") and File blocks styled as document rows

## Settings and sample content

**Settings > Intranet Blocks**
- Main color (seven presets or any color)
- Font: IBM Plex Sans Arabic, Inter, Cairo, Tajawal, or the theme's font
- Text size: small, default, large

These are printed as CSS variables on `:root`, for the site and the editor.

**Sample content** on the same screen adds six news posts (with generated cover images, so nothing is downloaded from outside) and six events. Everything it adds is tagged and can be removed with one click.

## Notes

- Themes often style every button, heading and link. The block styles are scoped and a bit more specific than usual so they don't pick that up.
- Grids use `auto-fill` with a minimum card width, so they adapt to narrow content areas and sidebars without media queries. The featured news layout uses a container query.

- Filters, search and carousel controls are added by small view scripts. Without JS, everything is still readable.
- All spacing uses logical CSS properties, and `wp-scripts` generates `-rtl.css` files that WordPress loads on RTL sites.
- Text is translatable (`intranet-blocks` text domain), including the front-end scripts.

## Development

```bash
npm install
npm run build   # or npm start while working
```

`webpack.config.js` extends the default `@wordpress/scripts` config with one extra entry for the event details panel. The `build/` folder is committed so the plugin can be installed straight from the repo.

Requires WordPress 6.6+.
