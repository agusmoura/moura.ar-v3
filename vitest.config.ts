import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@pages': resolve(__dirname, './src/pages'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
      '@data': resolve(__dirname, './src/data'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.js'],
    exclude: ['node_modules', 'dist', '.astro'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        '.astro/',
      ],
    },
  },
});