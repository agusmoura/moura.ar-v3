// @ts-check
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import rehypeRaw from 'rehype-raw';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    icon(),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
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
          manualChunks: (id) => {
            // Vendor chunk optimization for core libraries
            if (id.includes('node_modules')) {
              // Swiper gets its own chunk (lazy loaded)
              if (id.includes('swiper')) {
                return 'swiper';
              }
              // AOS gets its own chunk (lazy loaded)
              if (id.includes('aos')) {
                return 'aos';
              }
              // Heavy animation libraries
              if (id.includes('gsap') || id.includes('lottie') || id.includes('framer-motion')) {
                return 'animations';
              }
              // Image processing libraries
              if (id.includes('sharp') || id.includes('imagemin')) {
                return 'images';
              }
              // Core utilities that are always needed
              if (id.includes('zod') || id.includes('jsonwebtoken')) {
                return 'vendor-core';
              }
              // Other vendor libraries
              return 'vendor';
            }
            
            // Component-specific chunks for better loading
            if (id.includes('PersonalCarousel') || id.includes('Swiper')) {
              return 'carousel';
            }
            if (id.includes('SpaceBackground') || id.includes('effects/')) {
              return 'space-effects';
            }
            if (id.includes('ScrollAnimations') || id.includes('HeroOrbit')) {
              return 'scroll-animations';
            }
            if (id.includes('Contact') || id.includes('contact-form')) {
              return 'contact';
            }
            if (id.includes('SEO') || id.includes('analytics')) {
              return 'seo-analytics';
            }
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
      legalComments: 'none', // Remove license comments for smaller bundles
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      target: 'es2022', // Modern target for better optimization
    },
    // Additional performance optimizations
    reportCompressedSize: false, // Faster builds
    sourcemap: false, // Disable source maps in production
  },
  experimental: {
    responsiveImages: true,
    clientPrerender: true,
  },
});
