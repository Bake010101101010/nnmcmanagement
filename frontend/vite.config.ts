import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 13004,
    proxy: {
      '/api': {
        target: 'http://localhost:12004',
        changeOrigin: true,
      },
    },
  },
})
