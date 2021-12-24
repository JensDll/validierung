import { fileURLToPath } from 'url'
import path from 'path'

import { defineConfig, AliasOptions } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'

const baseDir = fileURLToPath(new URL('.', import.meta.url))
const isLocal = process.env.VITE_LOCAL === 'true'

const alias: AliasOptions = {
  '~': path.resolve(baseDir, 'src')
}

if (isLocal) {
  alias.vue = 'vue2'
}

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
    alias
  }
})
