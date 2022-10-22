import { createRequire } from 'node:module'
import path from 'node:path'

import alias from '@rollup/plugin-alias'
import type { ResolverFunction } from '@rollup/plugin-alias'
import fs from 'fs-extra'
import type { Plugin } from 'rollup'

import { rootDir } from './utils'

const require = createRequire(import.meta.url)

function resolveExtensions(extensions: string[]): ResolverFunction {
  return async function (source) {
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

export const resolveAliases = alias({
  customResolver: resolveExtensions(['.ts']),
  entries: [
    {
      find: /^~(.+?)\/(.+)/,
      replacement: path.resolve(rootDir, 'packages/$1/src/$2')
    }
  ]
})
