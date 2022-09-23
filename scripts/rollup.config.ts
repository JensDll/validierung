import path from 'node:path'

import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import fs from 'fs-extra'
import type { RollupOptions, ExternalOption } from 'rollup'
import dts from 'rollup-plugin-dts'
import esbuild, { minify } from 'rollup-plugin-esbuild'

import { injectVueDemi, resolveExtensions } from './rollup'

const rootDir = path.resolve(__dirname, '..')

type PackageName = 'shared' | 'validierung' | 'test-utils'

const packageNames: PackageName[] = ['shared', 'validierung', 'test-utils']

const plugin = {
  esbuild: esbuild({
    target: 'ES2019'
  }),
  minify: minify({
    target: 'ES2019'
  }),
  dts: dts(),
  nodeResolve: nodeResolve({
    rootDir,
    resolveOnly: [/^@internal\//]
  }),
  replace: {
    esm: replace({
      preventAssignment: true,
      objectGuard: true,
      __DEV__: "(process.env.NODE_ENV !== 'production')"
    }),
    dev: replace({
      preventAssignment: true,
      objectGuard: true,
      __DEV__: true,
      'process.env.NODE_ENV': null
    }),
    prod: replace({
      preventAssignment: true,
      objectGuard: true,
      __DEV__: false,
      'process.env.NODE_ENV': "'production'"
    })
  },
  alias: {
    dts: alias({
      entries: [
        {
          find: /^@internal\/(.+)/,
          replacement: path.resolve(rootDir, 'packages/$1/dist/index.d.ts')
        }
      ]
    })
  }
} as const

type BuildTypes = 'esm' | 'cjs' | 'iife' | 'dts'

type BuildConfigs = {
  file: string
  types: BuildTypes[]
  dependencies?: PackageName[]
}[]

const configs: RollupOptions[] = []

for (const name of packageNames) {
  const buildConfigs = fs.readJSONSync(
    path.resolve(rootDir, 'packages', name, 'build.json')
  ) as BuildConfigs

  for (const { file, types, dependencies = [] } of buildConfigs) {
    for (const type of types) {
      const input = `packages/${name}/src/${file}`

      if (type === 'dts') {
        configs.push({
          input,
          output: {
            file: `packages/${name}/dist/index.d.ts`,
            format: 'esm'
          },
          plugins: [plugin.alias.dts, plugin.dts]
        })

        continue
      }

      if (type === 'iife') {
        configs.push(
          {
            input,
            output: {
              file: `packages/${name}/dist/index.iife.js`,
              format: 'iife',
              name: 'Validierung',
              extend: true,
              globals: {
                'vue-demi': 'VueDemi'
              },
              plugins: [injectVueDemi]
            },
            plugins: [plugin.replace.dev, plugin.nodeResolve, plugin.esbuild]
          },
          {
            input,
            output: {
              file: `packages/${name}/dist/index.iife.min.js`,
              format: 'iife',
              name: 'Validierung',
              extend: true,
              globals: {
                'vue-demi': 'VueDemi'
              },
              plugins: [injectVueDemi, plugin.minify]
            },
            plugins: [plugin.replace.prod, plugin.nodeResolve, plugin.esbuild]
          }
        )

        continue
      }
      const manualChunks = dependencies.reduce((chunks, dependency) => {
        chunks[`internal/${dependency}`] = [`@internal/${dependency}`]
        return chunks
      }, {} as Record<string, string[]>)

      if (type === 'esm') {
        configs.push({
          input,
          output: {
            dir: `packages/${name}/dist`,
            format: type,
            entryFileNames: '[name].mjs',
            chunkFileNames: '[name].mjs',
            manualChunks
          },
          plugins: [plugin.replace.esm, plugin.nodeResolve, plugin.esbuild]
        })

        continue
      }

      configs.push(
        {
          input,
          output: {
            dir: `packages/${name}/dist`,
            format: type,
            manualChunks,
            entryFileNames: '[name].cjs',
            chunkFileNames: '[name].cjs'
          },
          plugins: [plugin.replace.dev, plugin.nodeResolve, plugin.esbuild]
        },
        {
          input,
          output: {
            dir: `packages/${name}/dist`,
            format: type,
            manualChunks,
            entryFileNames: '[name].min.cjs',
            chunkFileNames: '[name].min.cjs',
            plugins: [plugin.minify]
          },
          plugins: [plugin.replace.prod, plugin.nodeResolve, plugin.esbuild]
        }
      )
    }
  }
}

const baseExternals: ExternalOption = ['vue-demi', /^node:.+/]

configs.forEach(config => {
  config.plugins ??= []
  config.plugins.unshift(
    alias({
      customResolver: resolveExtensions(['.ts']),
      entries: [
        {
          find: /^~(.+?)\/(.+)/,
          replacement: path.resolve(rootDir, 'packages/$1/src/$2')
        }
      ]
    })
  )

  if (config.external) {
    if (!Array.isArray(config.external)) {
      throw new Error('External option must be an array')
    }
    config.external.push(...baseExternals)
  } else {
    config.external = baseExternals
  }
})

export default configs
