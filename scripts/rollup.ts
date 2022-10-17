import { createRequire } from 'node:module'
import path from 'node:path'

import type { ResolverFunction } from '@rollup/plugin-alias'
import fs from 'fs-extra'
import type { Plugin } from 'rollup'

const require = createRequire(import.meta.url)

export function resolveExtensions(extensions: string[]): ResolverFunction {
  return async function (source) {
    source = path.normalize(source)

    const isDirectory = await fs.pathExists(source)

    if (isDirectory) {
      source = path.join(source, 'index')
    }

    for (const extension of extensions) {
      try {
        const moduleInfo = await this.load({ id: source + extension })
        return moduleInfo.id
      } catch (e) {}
    }

    return null
  }
}

const VUE_DEMI_IIFE = fs.readFileSync(
  require.resolve('vue-demi/lib/index.iife.js'),
  'utf-8'
)

export const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk(code) {
    return `${VUE_DEMI_IIFE};\n;${code}`
  }
}
