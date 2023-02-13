import path from 'node:path'

import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import type { ExternalOption, InputPluginOption, RollupOptions } from 'rollup'
import dts from 'rollup-plugin-dts'
import esbuild, { minify } from 'rollup-plugin-esbuild'

import { injectVueDemi, tsPathAliasPlugin } from './scripts/rollup'
import { rootDir } from './scripts/utils'

interface RollupOptionsWithPlugins extends RollupOptions {
  plugins: InputPluginOption[]
}

const plugin = {
  dts: dts(),
  esbuild: esbuild({
    target: 'ES2019'
  }),
  minify: minify({
    target: 'ES2019'
  }),
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

type PackageName = 'shared' | 'validierung' | 'test-utils'

const input = (name: PackageName, file = 'index') =>
  `packages/${name}/src/${file}.ts`

const baseExternals: ExternalOption = ['vue-demi', /^node:.+/]

const shared: RollupOptionsWithPlugins[] = [
  {
    input: input('shared'),
    output: {
      file: 'packages/shared/dist/index.mjs',
      format: 'esm'
    },
    plugins: [plugin.replace.esm, plugin.esbuild]
  },
  {
    input: input('shared'),
    output: {
      file: 'packages/shared/dist/index.d.ts',
      format: 'esm'
    },
    plugins: [plugin.alias.dts, plugin.dts]
  }
]

const validierung: RollupOptionsWithPlugins[] = [
  {
    input: input('validierung'),
    output: {
      dir: 'packages/validierung/dist',
      format: 'esm',
      manualChunks: {
        'internal/shared': ['@internal/shared']
      },
      entryFileNames: '[name].mjs',
      chunkFileNames: '[name].mjs'
    },
    plugins: [plugin.replace.esm, plugin.nodeResolve, plugin.esbuild]
  },
  {
    input: input('validierung'),
    output: {
      dir: 'packages/validierung/dist',
      format: 'cjs',
      manualChunks: {
        'internal/shared': ['@internal/shared']
      },
      interop: 'default',
      entryFileNames: '[name].cjs',
      chunkFileNames: '[name].cjs'
    },
    plugins: [plugin.replace.dev, plugin.nodeResolve, plugin.esbuild]
  },
  {
    input: input('validierung'),
    output: {
      dir: 'packages/validierung/dist',
      format: 'cjs',
      manualChunks: {
        'internal/shared': ['@internal/shared']
      },
      interop: 'default',
      entryFileNames: '[name].min.cjs',
      chunkFileNames: '[name].min.cjs',
      plugins: [plugin.minify]
    },
    plugins: [plugin.replace.prod, plugin.nodeResolve, plugin.esbuild]
  },
  {
    input: input('validierung'),
    output: {
      file: `packages/validierung/dist/index.iife.js`,
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
    input: input('validierung'),
    output: {
      file: `packages/validierung/dist/index.iife.min.js`,
      format: 'iife',
      name: 'Validierung',
      extend: true,
      globals: {
        'vue-demi': 'VueDemi'
      },
      plugins: [injectVueDemi, plugin.minify]
    },
    plugins: [plugin.replace.prod, plugin.nodeResolve, plugin.esbuild]
  },
  {
    input: input('validierung'),
    output: {
      file: 'packages/validierung/dist/index.d.ts',
      format: 'esm'
    },
    plugins: [plugin.alias.dts, plugin.dts]
  }
]

const testUtils: RollupOptionsWithPlugins[] = [
  {
    input: input('test-utils'),
    output: {
      file: 'packages/test-utils/dist/index.mjs',
      format: 'esm'
    },
    external: ['puppeteer'],
    plugins: [plugin.replace.esm, plugin.esbuild]
  },
  {
    input: input('test-utils'),
    output: {
      file: 'packages/test-utils/dist/index.d.ts',
      format: 'esm'
    },
    plugins: [plugin.alias.dts, plugin.dts]
  }
]

const configs: RollupOptionsWithPlugins[] = [
  ...shared,
  ...validierung,
  ...testUtils
]

configs.forEach(config => {
  config.plugins.unshift(tsPathAliasPlugin)

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
