import url from 'node:url'
import path from 'node:path'

import { defineConfig, type AliasOptions } from 'vite'
import Legacy from '@vitejs/plugin-legacy'
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import Components from 'unplugin-vue-components/vite'

const baseDir = url.fileURLToPath(new url.URL('.', import.meta.url))

const alias: AliasOptions = {
  '~': path.resolve(baseDir, 'src')
}

export default defineConfig({
  plugins: [
    Vue2({
      jsx: false
    }),
    Legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    ScriptSetup(),
    Components({
      dts: './dts/components.d.ts'
    })
  ],
  resolve: {
    alias
  }
})
