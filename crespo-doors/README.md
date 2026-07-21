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

## Project structure

- `src/App.jsx` – assembles all page sections
- `src/components/` – Navbar, Hero, Services, Products, Process, Stats, Gallery, Testimonials, FAQ, CTAForm, Footer, etc.
- `src/lib/motion.js` – shared Framer Motion variants
- `src/assets/` – logo assets (extracted/cleaned from the brand mockup)
