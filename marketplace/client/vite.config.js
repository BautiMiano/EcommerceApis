import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/chat': {
        target: 'http://localhost:4002',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:4002',
        changeOrigin: true,
      }
    }
  }
})
