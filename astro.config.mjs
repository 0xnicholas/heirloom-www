import { defineConfig } from 'astro/config';

// Static output, no JS framework islands — plain HTML + CSS.
export default defineConfig({
  output: 'static',
  // Hosting: GitHub Pages project site (ADR-0005). `site` intentionally
  // carries the project path so absolute URLs (og:image) resolve correctly —
  // if you change one of `site`/`base`, change both. Static asset references
  // in pages must use import.meta.env.BASE_URL.
  site: 'https://0xnicholas.github.io/heirloom-www/',
  base: '/heirloom-www/',
});
