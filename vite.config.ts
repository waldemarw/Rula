import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import 'vite-ssg'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    formatting: 'minify',
    script: 'defer',
    dirStyle: 'nested',
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
  },
})
