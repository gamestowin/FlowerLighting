import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'static',
  adapter: netlify({
    edgeMiddleware: false,
  }),
  vite: {
    ssr: {
      external: ['pg']
    },
    optimizeDeps: {
      exclude: ['blobshape', 'tailwindcss']
    }
  }
});
