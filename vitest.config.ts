import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['playwrighttests', 'node_modules', 'dist', '.yarn/unplugged/**']
     , environment: 'jsdom'
     , watch: process.env.CI ? false : true
  }
});

