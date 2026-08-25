import { defineConfig } from 'astro/config';

// Static output, no JS framework islands — plain HTML + CSS.
export default defineConfig({
  output: 'static',
});
