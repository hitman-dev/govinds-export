# Govinds Export website

Static one-page site for Govinds Export (Pune, India). No build step and no backend.

## Run locally

```bash
python -m http.server 8090 --bind 127.0.0.1
```

Open http://127.0.0.1:8090.

## Layout

- `index.html` is the page.
- `css/styles.css` holds the layout and sections; `css/interactive.css` holds the gallery, lightbox, quote form and phone layout.
- `js/main.js` runs the mobile menu, quote form, gallery filter and lightbox.
- `assets/images/<bags|tubes|roses|oils>/` holds each photo twice: `name.jpg` (up to 1600px) and `name-sm.jpg` (600px).
- `source/` holds the original HTML and WhatsApp photos. Don't upload it.

## How the quote form works

The form doesn't need a server. It opens WhatsApp (+91 7709181557) or the visitor's email app with the request already filled in.
The number and email address are at the top of `js/main.js`.

## To add a gallery photo

1. Put `name.jpg` and `name-sm.jpg` in the right `assets/images/` folder.
2. Add a `<button class="gallery-item" data-cat="..." data-name="..." aria-label="caption">` line in the gallery section.

## Deploy

Upload `index.html`, `css/`, `js/` and `assets/` to any static host, such as Netlify, Cloudflare Pages, GitHub Pages or shared hosting.
