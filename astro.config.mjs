import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import svelte from '@astrojs/svelte'

export default defineConfig({
  integrations: [
    icon(),
    svelte(),
  ],
  vite: {
    esbuild: {
      loader: 'tsx',
      include: /src\/.*\.tsx?$/,
      exclude: [],
    },
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
