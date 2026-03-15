// ============================================================
// Threadline Platform - Vite Configuration
// Phase 1: Tailwind CSS v4 integration via @tailwindcss/vite
// The API proxy below redirects /api requests to the backend
// during local development.
// ============================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
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

