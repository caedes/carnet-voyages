# Android Maskable Icon

## Problem

On Android, the app icon ("Carnet") appears as a dark square inside a white circle (Pixel) or white squircle (Samsung/Xiaomi). This happens because:

1. The current PNG icons (logo192.png, logo512.png) are not declared as `maskable` in the manifest
2. Android treats them as classic icons and places them inside a white adaptive icon container
3. The maple leaf emoji renders differently across devices (Pixel, Samsung, Redmi)

## Goal

- The dark background (`#0f172a`) fills the entire adaptive icon shape on all Android devices
- The maple leaf is large and centered within the maskable safe zone
- The maple leaf looks identical on all devices (SVG-based, not emoji)
- Works correctly on: Pixel 9a (circle), Samsung Galaxy S21 (squircle), Redmi Note 14 (rounded square)

## Design

### SVG Source Icon

- Replace the current `favicon.svg` (which uses an emoji `<text>` element) with a proper SVG using a public domain maple leaf path (Canadian flag style silhouette)
- Colors: linear gradient top-to-bottom, red (`#e63946`) to golden-orange (`#e6a817`)
- Background: `#0f172a` filling the full viewBox
- The leaf is sized to fill the 80% maskable safe zone generously with minimal padding

### Maskable Safe Zone

Android maskable icons guarantee only the inner 80% circle is visible. The icon is 512x512, so:

- Full canvas: 512x512, filled with `#0f172a`
- Safe zone: inner 410x410 (centered)
- The maple leaf is sized to comfortably fill most of the safe zone (~360-380px)
- On circular masks (Pixel): the leaf fits well within the visible circle
- On squircle/rounded-square masks (Samsung/Redmi): even more of the icon is visible

### Files Modified

| File | Action | Description |
|------|--------|-------------|
| `public/favicon.svg` | **Replace** | New SVG with real maple leaf path + gradient (replaces emoji version) |
| `public/logo192.png` | **Regenerate** | 192x192 PNG from new SVG, maskable-ready |
| `public/logo512.png` | **Regenerate** | 512x512 PNG from new SVG, maskable-ready |
| `public/manifest.json` | **Edit** | Add `"purpose": "maskable"` to both icon entries |

### PNG Generation

Use `sharp` (Node.js library) via a one-shot script to convert the SVG to PNG at 192x192 and 512x512. The script is run once during development, not at build time.

### Unchanged Files

- `index.html` (meta tags stay the same)
- `favicon.ico` (desktop fallback, unchanged)
- `favicon.png` (32x32 desktop fallback, unchanged)
- `vite.config.ts` (no PWA plugin needed)

## Out of Scope

- Service worker / offline support
- Apple touch icon changes (iOS handles icons differently)
- `vite-plugin-pwa` integration
- favicon.ico / favicon.png regeneration
