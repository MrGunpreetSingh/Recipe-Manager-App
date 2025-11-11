import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    // Prioritize .ts extensions
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    // Don't pre-bundle simplekit - process TypeScript on demand
    exclude: ['simplekit']
  },
  esbuild: {
    target: 'es2020'
  }
});

