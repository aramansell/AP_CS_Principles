// @ts-check
import { defineConfig } from 'astro/config';
import { writePacingMd } from './src/integrations/pacing-md.ts';

// GitHub Pages project site: served from https://aramansell.github.io/AP_CS_Principles/
// All internal links in content are relative, so the site also works at any
// other base path (or a custom domain) without changes.
export default defineConfig({
  site: 'https://aramansell.github.io',
  base: '/AP_CS_Principles',
  build: {
    // 'preserve' keeps lesson URLs flat and predictable:
    //   lessons/1.4a.astro        -> /lessons/1.4a.html
    //   docs/unit-01/index.astro  -> /docs/unit-01/index.html
    //   pace.astro                -> /pace.html
    format: 'preserve',
  },
  // 'ignore' keeps both /AP_CS_Principles and /AP_CS_Principles/ working in dev
  // (GitHub Pages serves both forms in production anyway).
  trailingSlash: 'ignore',
  integrations: [writePacingMd({ site: 'https://aramansell.github.io', base: '/AP_CS_Principles' })],
});
