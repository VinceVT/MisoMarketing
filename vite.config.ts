import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG'],
  build: {
    rollupOptions: {
      // Two separately-loaded pages rather than client-side routing, so
      // /portfolio.html is a real static file that survives a refresh or a
      // direct visit, with no SPA rewrite rules to maintain on the host.
      // Paths are relative to the project root; keeping them that way avoids
      // pulling @types/node in just to call path.resolve in this config.
      input: {
        main: 'index.html',
        portfolio: 'portfolio.html',
      },
    },
  },
})
