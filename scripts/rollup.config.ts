import path from 'path'

import fs from 'fs-extra'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import type {
  OutputOptions,
  RollupOptions,
  Plugin,
  ExternalOption
} from 'rollup'
import esbuild, { minify } from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

const rootDir = path.resolve(__dirname, '..')

const VUE_DEMI_IIFE = fs.readFileSync(
  require.resolve('vue-demi/lib/index.iife.js'),
  'utf-8'
)

const plugin = {
  alias: {
    esm: alias({
      entries: [
        {
          find: '@internal/shared',
          replacement: path.resolve(rootDir, 'packages/shared/dist/index.mjs')
        }
      ]
    }),
    dts: alias({
      entries: [
        {
          find: '@internal/shared',
          replacement: path.resolve(rootDir, 'packages/shared/dist/index.d.ts')
        }
      ]
    })
  },
  injectVueDemi: {
    name: 'inject-vue-demi',
    renderChunk(code) {
      return `${VUE_DEMI_IIFE};\n;${code}`
    }
  } as Plugin,
  dts: dts(),
  esbuild: esbuild({
    target: 'ES2019'
  }),
  minify: minify({
    target: 'ES2019'
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
  }
} as const

type PackageName = 'shared' | 'validierung' | 'test-utils'

const input = (name: PackageName, file = 'index') =>
  `packages/${name}/src/${file}.ts`

type OutputReturn = {
  readonly esm: OutputOptions
  readonly dev: OutputOptions[]
  readonly prod: OutputOptions[]
  readonly dts: OutputOptions
}

const output = (name: PackageName): OutputReturn => ({
  esm: {
    file: `packages/${name}/dist/index.mjs`,
    format: 'esm'
  },
  dev: [
    {
      file: `packages/${name}/dist/index.cjs`,
      format: 'cjs'
    },
    {
      file: `packages/${name}/dist/index.iife.js`,
      format: 'iife',
      name: 'Validierung',
      extend: true,
      globals: {
        'vue-demi': 'VueDemi'
      },
      plugins: [plugin.injectVueDemi]
    }
  ],
  prod: [
    {
      file: `packages/${name}/dist/index.min.cjs`,
      format: 'cjs',
      plugins: [plugin.minify]
    },
    {
      file: `packages/${name}/dist/index.iife.min.js`,
      format: 'iife',
      name: 'Validierung',
      extend: true,
      globals: {
        'vue-demi': 'VueDemi'
      },
      plugins: [plugin.injectVueDemi, plugin.minify]
    }
  ],
  dts: {
    file: `packages/${name}/dist/index.d.ts`,
    format: 'esm'
  }
})

const baseExternals: ExternalOption = ['vue-demi']

const configs: RollupOptions[] = [
  {
    input: input('test-utils'),
    output: output('test-utils').esm,
    plugins: [plugin.replace.esm, plugin.esbuild],
    external: [/@internal\/.+/]
  },
  {
    input: input('test-utils'),
    output: output('test-utils').dts,
    plugins: [plugin.dts],
    external: [/@internal\/.+/]
  },
  {
    input: input('shared'),
    output: output('shared').esm,
    plugins: [plugin.replace.esm, plugin.esbuild]
  },
  {
    input: input('shared'),
    output: output('shared').dts,
    plugins: [plugin.dts]
  },
  {
    input: input('validierung'),
    output: output('validierung').esm,
    plugins: [plugin.alias.esm, plugin.replace.esm, plugin.esbuild]
  },
  {
    input: input('validierung'),
    output: output('validierung').dev,
    plugins: [plugin.alias.esm, plugin.replace.dev, plugin.esbuild]
  },
  {
    input: input('validierung'),
    output: output('validierung').prod,
    plugins: [plugin.alias.esm, plugin.replace.prod, plugin.esbuild]
  },
  {
    input: input('validierung'),
    output: output('validierung').dts,
    plugins: [plugin.alias.dts, plugin.dts]
  }
]

configs.forEach(config => {
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
