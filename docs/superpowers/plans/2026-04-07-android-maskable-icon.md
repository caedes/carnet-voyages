# Android Maskable Icon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the PWA icon fill the entire adaptive icon shape on Android (Pixel circle, Samsung squircle, Redmi rounded square) with the dark background, using a proper SVG maple leaf instead of an emoji.

**Architecture:** Replace the emoji-based favicon.svg with a real SVG maple leaf path, generate maskable PNGs from it using sharp, and update the manifest to declare icons as maskable.

**Tech Stack:** SVG, sharp (Node.js), PWA manifest

---

### Task 1: Create the new favicon.svg with a real maple leaf path

**Files:**
- Modify: `public/favicon.svg`

- [ ] **Step 1: Replace favicon.svg with a proper SVG maple leaf**

The SVG uses a 512x512 viewBox. The maple leaf path is sized to fill the 80% maskable safe zone (~380px) and centered. Background fills the entire canvas.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="leaf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e63946"/>
      <stop offset="100%" stop-color="#e6a817"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#0f172a"/>
  <g transform="translate(256,256) scale(4.2) translate(-50,-50)">
    <path fill="url(#leaf)" d="M50 3L42 22L30 18L35 30L20 28L30 40L18 45L30 48L25 55L35 52L38 62L42 52L50 65L58 52L62 62L65 52L75 55L70 48L82 45L70 40L80 28L65 30L70 18L58 22Z"/>
  </g>
</svg>
```

Note: The maple leaf path above is a simplified placeholder. During implementation, use a proper public-domain Canadian maple leaf SVG path (e.g., from Wikimedia Commons flag of Canada SVG). The key constraints are:
- viewBox="0 0 512 512"
- `#0f172a` rect fills entire background
- Leaf uses the red-to-orange gradient `url(#leaf)`
- Leaf is centered and scaled to fill ~380px of the 512px canvas (safe zone)

- [ ] **Step 2: Verify the SVG renders correctly**

Open `public/favicon.svg` in a browser to verify the maple leaf is centered, the gradient looks good, and the dark background fills the entire canvas.

- [ ] **Step 3: Commit**

```bash
git add public/favicon.svg
git commit -m "feat: replace emoji favicon with SVG maple leaf path"
```

---

### Task 2: Generate maskable PNG icons from the SVG

**Files:**
- Modify: `public/logo192.png`
- Modify: `public/logo512.png`
- Create: `scripts/generate-icons.mjs` (one-shot script, can be deleted after)

- [ ] **Step 1: Install sharp as a dev dependency**

```bash
yarn add -D sharp
```

- [ ] **Step 2: Create the icon generation script**

Create `scripts/generate-icons.mjs`:

```js
import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../public/favicon.svg");
const svg = readFileSync(svgPath);

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(resolve(__dirname, `../public/logo${size}.png`));
  console.log(`Generated logo${size}.png`);
}
```

- [ ] **Step 3: Run the script**

```bash
node scripts/generate-icons.mjs
```

Expected output:
```
Generated logo192.png
Generated logo512.png
```

- [ ] **Step 4: Verify the PNGs visually**

Open both `public/logo192.png` and `public/logo512.png` to confirm:
- Dark background fills the entire image (no transparency, no white)
- Maple leaf is centered and large
- Gradient renders correctly

- [ ] **Step 5: Clean up and commit**

```bash
rm scripts/generate-icons.mjs
yarn remove sharp
git add public/logo192.png public/logo512.png
git commit -m "feat: generate maskable PNG icons from SVG maple leaf"
```

---

### Task 3: Update manifest.json with maskable purpose

**Files:**
- Modify: `public/manifest.json`

- [ ] **Step 1: Add "purpose": "maskable" to both icon entries**

Edit `public/manifest.json` — the icons array becomes:

```json
{
  "short_name": "Carnet",
  "name": "Carnet de Voyages — Canada 2026",
  "icons": [
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192",
      "purpose": "maskable"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "maskable"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0f172a",
  "background_color": "#0f172a"
}
```

- [ ] **Step 2: Commit**

```bash
git add public/manifest.json
git commit -m "feat: declare PWA icons as maskable for Android adaptive icons"
```

---

### Task 4: Validate with maskable.app

- [ ] **Step 1: Test with the maskable icon validator**

Go to https://maskable.app/editor and upload `public/logo512.png`. Verify that:
- The leaf is fully visible in all mask shapes (circle, squircle, rounded square)
- No important content is clipped
- The dark background fills edge to edge

- [ ] **Step 2: Test locally in the dev server**

```bash
yarn dev
```

Open the app in Chrome, go to DevTools > Application > Manifest and verify the icons load correctly with the maskable purpose.

- [ ] **Step 3: Final commit if any adjustments were needed**

If the leaf needed resizing after validation, regenerate PNGs and commit:

```bash
git add public/
git commit -m "fix: adjust maple leaf sizing for maskable safe zone"
```
