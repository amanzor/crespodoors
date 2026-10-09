# Crespo Doors of Engineering — Website

A single-page marketing site built with React, Tailwind CSS v4, and Framer Motion, bundled by Vite into one self-contained HTML file.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

This outputs a single portable file at `dist/index.html` (JS, CSS, and images are all inlined).

## The door intro

The page opens with a scroll-driven 3D assembly (`src/components/Hero.jsx` + `src/components/intro/`):
a laser survey, then a walnut double door is built piece by piece — frame, stiles & rails on hinges,
glass, diagonal chevron slats, mortise locksets with black levers and a 3-point lock — then both leaves
swing open and the camera pushes through into a scroll-scrubbed showroom walkthrough.

- `intro/timeline.js` – every scroll range, screw and camera keyframe in one place (tweak timing here)
- `intro/DoorScene.jsx` – the CSS-3D door parts (geometry constants live in `timeline.js`)
- `public/intro/` – showroom still + walkthrough video (kept out of the single-file bundle).
  Encoded with a short GOP (`-g 3 -bf 0`) so scrubbing stays smooth.
- Visitors with "reduce motion" enabled get the finished scene without the animation.

## Project structure

- `src/App.jsx` – assembles all page sections
- `src/components/` – Navbar, Hero, Services, Products, Process, Stats, Gallery, Testimonials, FAQ, CTAForm, Footer, etc.
- `src/lib/motion.js` – shared Framer Motion variants
- `src/assets/` – logo assets (extracted/cleaned from the brand mockup)
