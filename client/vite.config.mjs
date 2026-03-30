// ============================================================
// Threadline Platform - Vite Configuration
// Phase 1: Tailwind CSS v4 integration via @tailwindcss/vite
// The API proxy below redirects /api requests to the backend
// during local development.
// ============================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Bundle analyser — run with: ANALYZE=true npm run build
let visualizer = null;
if (process.env.ANALYZE === 'true') {
  const { visualizer: _v } = await import('rollup-plugin-visualizer');
  visualizer = _v({ open: true, filename: 'stats.html', gzipSize: true });
}

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    ...(visualizer ? [visualizer] : []),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});

