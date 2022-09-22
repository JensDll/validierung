import path from 'node:path'
import url from 'node:url'

import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, type AliasOptions } from 'vite'

const baseDir = url.fileURLToPath(new url.URL('.', import.meta.url))

const alias: AliasOptions = {
  '~': path.resolve(baseDir, 'src')
}

export default defineConfig({
  plugins: [
    Vue(),
    Components({
      dts: './dts/components.d.ts'
    })
  ],
  resolve: {
    alias
  }
})
