import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Next.js lets .js files contain JSX; Vite needs to be told.
  oxc: {
    include: /\.jsx?$/,
    exclude: /node_modules/,
    lang: 'jsx',
    jsx: { runtime: 'automatic' },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    // Same origin as the default API URL, so jsdom applies no CORS checks
    // to the MSW-mocked backend.
    environmentOptions: { jsdom: { url: 'http://127.0.0.1:8000' } },
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
  },
});
