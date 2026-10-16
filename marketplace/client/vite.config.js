import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
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
