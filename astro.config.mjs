import { defineConfig } from 'astro/config'
import icon from 'astro-icon'

export default defineConfig({
  integrations: [
    icon(),
  ],
  vite: {
    server: {
      hmr: {
        port: 24678,
        protocol: 'ws',
        overlay: false,
      },
      watch: {
        usePolling: true,
        interval: 2000,
        binaryInterval: 5000,
      },
    },
  },
})
