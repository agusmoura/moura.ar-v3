import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  // Configuración para archivos Astro
  ...eslintPluginAstro.configs['flat/recommended'],

  // Configuración para archivos TypeScript
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Ignorar archivos de build y dependencias
  {
    ignores: ['dist/**', 'node_modules/**', '.astro/**'],
  },
];
