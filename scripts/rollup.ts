import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

import alias, { type Alias, type ResolverFunction } from '@rollup/plugin-alias'
import type { Plugin } from 'rollup'

import { rootDir } from './utils'

const require = createRequire(import.meta.url)

function resolveExtensions(extensions: string[]): ResolverFunction {
  return async function (source) {
    try {
      const stats = await fs.lstat(source)

      if (stats.isDirectory()) {
        source = path.join(source, 'index')
      }
    } catch {}

    try {
      for (const extension of extensions) {
        const moduleInfo = await this.load({ id: source + extension })
        return moduleInfo.id
      }
    } catch {}

    return null
  }
}

export type AliasWithoutResolver = Omit<Alias, 'customResolver'>

export const tsPathAlias: AliasWithoutResolver = {
  find: /^~(.+?)\/(.+)/,
  replacement: path.resolve(rootDir, 'packages/$1/src/$2')
}

export const tsPathAliasPlugin = alias({
  customResolver: resolveExtensions(['.ts']),
  entries: [tsPathAlias]
})

const VUE_DEMI_IIFE = await fs.readFile(
  require.resolve('vue-demi/lib/index.iife.js'),
  'utf-8'
)

export const injectVueDemi: Plugin = {
  name: 'inject-vue-demi',
  renderChunk(code) {
    return `${VUE_DEMI_IIFE};\n;${code}`
  }
}
