import path from 'path'

import fs from 'fs-extra'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import { OutputOptions, RollupOptions, Plugin } from 'rollup'
import esbuild, { minify } from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

type PackageName = 'shared' | 'validierung'

const rootDir = path.resolve(__dirname, '..')

const VUE_DEMI_IIFE = fs.readFileSync(
  require.resolve('vue-demi/lib/index.iife.js'),
  'utf-8'
)

type BuildPlugins = {
  readonly alias: {
    readonly esm: Plugin
    readonly dts: Plugin
  }
  readonly dts: Plugin
  readonly esbuild: Plugin
  readonly minify: Plugin
  readonly injectVueDemi: Plugin
  readonly replace: {
    readonly esm: Plugin
    readonly dev: Plugin
    readonly prod: Plugin
  }
}

const plugin: BuildPlugins = {
  alias: {
    esm: alias({
      entries: [
        {
          find: '@validierung/shared',
          replacement: path.resolve(rootDir, 'packages/shared/dist/index.mjs')
        }
      ]
    }),
    dts: alias({
      entries: [
        {
          find: '@validierung/shared',
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
  },
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
      __DEV__: "(process.env.NODE_ENV !== 'production')"
    }),
    dev: replace({
      preventAssignment: true,
      __DEV__: true,
      'process.env.NODE_ENV': null
    }),
    prod: replace({
      preventAssignment: true,
      __DEV__: false,
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  }
}

const input = (name: PackageName) => `packages/${name}/src/index.ts`

type OutputReturn = {
  readonly esm: OutputOptions | OutputOptions[]
  readonly dev: OutputOptions | OutputOptions[]
  readonly prod: OutputOptions | OutputOptions[]
  readonly dts: OutputOptions | OutputOptions[]
}

const output = (name: PackageName): OutputReturn => ({
  esm: {
    file: `packages/${name}/dist/index.mjs`,
    format: 'esm'
  },
  dev: [
    {
      file: `packages/${name}/dist/index.dev.cjs`,
      format: 'cjs'
    },
    {
      file: `packages/${name}/dist/index.iife.dev.js`,
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
      file: `packages/${name}/dist/index.prod.cjs`,
      format: 'cjs',
      plugins: [plugin.minify]
    },
    {
      file: `packages/${name}/dist/index.iife.prod.js`,
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

const sharedConfigs: RollupOptions[] = [
  {
    input: input('shared'),
    output: output('shared').esm,
    plugins: [plugin.replace.esm, plugin.esbuild]
  },
  {
    input: input('shared'),
    output: output('shared').dts,
    plugins: [plugin.dts]
  }
]

const validierungConfigs: RollupOptions[] = [
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

const configs = [...sharedConfigs, ...validierungConfigs]

configs.forEach(config => {
  config.treeshake = {
    moduleSideEffects: false
  }
  config.external = ['vue-demi']
})

export default configs
