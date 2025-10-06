import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sri from 'vite-plugin-sri'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sri(),
  ],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: false,
    host: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
