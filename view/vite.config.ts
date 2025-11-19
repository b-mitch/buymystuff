import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/register': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/products': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/account': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/cart': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/checkout': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/orders': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/home': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
});
