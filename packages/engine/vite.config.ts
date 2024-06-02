// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],

  build: {
    outDir: 'build',
    emptyOutDir: true,
  },

  test: {
    testTimeout: 5 * 60 * 1000,
    exclude: [],
  },
});
