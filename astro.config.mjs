import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import svelte from '@astrojs/svelte'

export default defineConfig({
  site: 'https://alaster-t34.github.io',
  integrations: [
    icon(),
    svelte(),
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
