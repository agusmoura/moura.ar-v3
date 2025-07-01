// @ts-check
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import rehypeRaw from 'rehype-raw';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [icon(), mdx()],
  site: 'https://moura.ar', // Cambia esto a tu dominio real
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [],
    rehypePlugins: [rehypeRaw],
  },
  compressHTML: true,
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@tailwindcss/vite'],
    },
    build: {
      cssMinify: 'lightningcss',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro'],
            animations: ['swiper'],
          },
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
            const info = assetInfo.name.split('.');
            const extType = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/css/i.test(extType)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },
  experimental: {
    responsiveImages: true,
    clientPrerender: true,
  },
});
