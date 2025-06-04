// @ts-check
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],
  site: 'https://moura.ar', // Cambia esto a tu dominio real
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@tailwindcss/vite'],
    },
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro'],
          },
        },
      },
    },
  },
  experimental: {
    responsiveImages: true,
  },
});
