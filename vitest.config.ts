import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['playwrighttests', 'node_modules', 'dist']
     , environment: 'jsdom'
  }
});

