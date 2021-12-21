import { fileURLToPath } from 'url'
import path from 'path'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'
import scriptSetup from 'unplugin-vue2-script-setup/vite'

const baseDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue2({
      jsx: true
    }),
    scriptSetup(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      vue: 'vue2',
      '@': path.resolve(baseDir, 'src')
    }
  }
})
