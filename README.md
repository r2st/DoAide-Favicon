# DoAide Favicon

Free favicon generator and manager. Every website needs a favicon — this tool makes it easy.

**Live at [favicon.doaide.com](https://favicon.doaide.com)**

## Features

- **Text to Favicon** — Enter 1-2 characters, pick font/color/background, generate all sizes
- **Emoji Favicon** — Pick any emoji, generate it as a favicon set
- **Image to Favicon** — Upload an image, crop/resize to favicon sizes
- **SVG Favicon** — Build SVG favicons with shapes or paste custom SVG
- **Favicon Preview** — Preview how your favicon looks in browser tabs, bookmarks, mobile, and search results
- **Favicon Package** — Download complete package with all sizes, web manifest, and HTML meta tags
- **URL Checker** — Enter a URL to extract and view its current favicon

## Tech Stack

- React 19 + Vite
- Tailwind CSS 3.4
- Canvas API for image manipulation
- No backend required — runs entirely in the browser

## Development

```bash
npm install
npm run dev      # Start dev server on port 3072
npm run test     # Run tests
npm run build    # Production build
```

## Favicon Sizes Generated

| Size | Usage |
|------|-------|
| 16x16 | Browser tab |
| 32x32 | Browser tab (Retina) |
| 48x48 | Windows site shortcut |
| 180x180 | Apple Touch Icon |
| 192x192 | Android Chrome |
| 512x512 | Android Chrome (splash screen) |

## License

MIT
