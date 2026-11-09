// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Subruta de GitHub Pages. Se inyecta por variable de entorno: un build por base.
// Netlify/Cloudflare/Vercel construyen sin BASE_PATH (raíz).
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  // Completar con la URL definitiva al publicar (solo metadatos; no rompe el build).
  // site: 'https://<usuario>.github.io',
  base,
  trailingSlash: 'always',
  output: 'static',
  integrations: [react()],
});
