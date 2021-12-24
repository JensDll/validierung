import { fileURLToPath } from 'url'
import path from 'path'

import { defineConfig, AliasOptions } from 'vite'
import vue from '@vitejs/plugin-vue'

const baseDir = fileURLToPath(new URL('.', import.meta.url))
const isLocal = process.env.VITE_LOCAL === 'true'

const alias: AliasOptions = {
  '~': path.resolve(baseDir, 'src')
}

if (isLocal) {
  alias.vue = 'vue3'
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias
  }
})
