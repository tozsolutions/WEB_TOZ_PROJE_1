import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    // Generate minified files for production
    minify: true,
    // Generate source maps for debugging
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  preview: {
    port: 4173,
    open: true,
    host: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['axios']
  },
  // CSS options
  css: {
    devSourcemap: true
  }
})