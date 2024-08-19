import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  css: {
    preprocessorOptions: {
      // Add any preprocessor options if needed
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure CSS files are handled correctly
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
  plugins: [
    createHtmlPlugin({
      inject: {
        injectData: {
          warning: '<!-- WARN: Vite generated - do not edit! -->',
        },
      },
      minify: false, // Ensure the comment is not removed during minification
    }),
  ],
});