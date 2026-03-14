// ============================================================
// Threadline Platform - Vite Configuration
// This is the build tool config for the frontend client.
// Deploying on Vercel? Vercel auto-detects Vite projects.
// The API proxy below redirects /api requests to the backend
// during local development.
// ============================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
