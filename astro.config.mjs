import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://alaster-t34.github.io',
  integrations: [
    tailwind({
      applyBaseStyles: false,
      nesting: true,
    }),
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
