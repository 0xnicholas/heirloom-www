import { defineConfig } from 'astro/config';

// Static output, no JS framework islands — plain HTML + CSS.
export default defineConfig({
  output: 'static',
  // Placeholder origin until hosting/domain is decided (#9); used to build
  // absolute URLs for og:image and friends. Update this one value at launch.
  site: 'https://0xnicholas.github.io/heirloom-www/',
});
