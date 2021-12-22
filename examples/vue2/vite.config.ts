import { fileURLToPath } from 'url'
import path from 'path'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'

const baseDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue2({
      jsx: false
    }),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(baseDir, 'src')
    }
  }
})
