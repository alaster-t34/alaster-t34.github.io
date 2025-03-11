import { defineConfig } from 'astro/config'

export default defineConfig({
  vite: {
    server: {
      hmr: {
        port: 24678,                # 使用独占端口
        protocol: 'ws',
        overlay: false
      },
      watch: {
        usePolling: true,           # 强制轮询模式
        interval: 2000,             # 适用于机械硬盘
        binaryInterval: 5000        # 大文件场景优化
      }
    }
  }
})
