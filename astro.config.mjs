import path from 'node:path'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://alaster-t34.github.io',
  build: {
    assets: 'assets',
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
      nesting: true,
    }),
    icon(),
    svelte(),
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            const ext = path.extname(assetInfo.name ?? '')
            const baseName = path.basename(assetInfo.name ?? 'asset', ext)
            const safeName = baseName.replace(/^_+/, '') || 'asset'
            return `assets/${safeName}-[hash][extname]`
          },
          chunkFileNames: 'assets/chunk-[hash].js',
          entryFileNames: 'assets/entry-[hash].js',
        },
      },
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
