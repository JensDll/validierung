import path from 'node:path'
import url from 'node:url'

import Vue from '@vitejs/plugin-vue2'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

const baseDir = url.fileURLToPath(new url.URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    Vue(),
    Components({
      dts: './dts/components.d.ts'
    })
  ],
  resolve: {
    alias: {
      '~': path.resolve(baseDir, 'src')
    }
  }
})
