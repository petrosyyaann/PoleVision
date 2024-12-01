import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5173,
    open: 'http://localhost:5173/',
    proxy: {
      '/api/v1': {
        target: 'http://lap.lab260.ru/api/v1',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api\/v1/, ''),
      },
      '/fic-data': {
        target: 'http://lap.lab260.ru/fic-data',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/fic-data/, ''),
      },
    },
  },
  resolve: {
    alias: {
      app: '/src/app',
      pages: '/src/pages',
      widgets: '/src/widgets',
      features: '/src/features',
      entities: '/src/entities',
      shared: '/src/shared',
    },
  },
})
