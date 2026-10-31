import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://api-segunda-fase.pontosat.net.br:45689',
        changeOrigin: true,
      },
    },
  },
})
