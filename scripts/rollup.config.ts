import path from 'path'

import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import { OutputOptions, RollupOptions } from 'rollup'
import esbuild, { minify } from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

type PackageName = 'shared' | 'validierung'

const rootDir = path.resolve(__dirname, '..')

const plugin = {
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
    cjs: replace({
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
} as const

const input = (name: PackageName) => `packages/${name}/src/index.ts`

type OutputReturn = {
  readonly esm: OutputOptions
  readonly cjs: OutputOptions
  readonly dts: OutputOptions
  readonly prod: OutputOptions
}

const output = (name: PackageName): OutputReturn => ({
  esm: {
    file: `packages/${name}/dist/index.mjs`,
    format: 'esm'
  },
  cjs: {
    file: `packages/${name}/dist/index.cjs`,
    format: 'cjs'
  },
  dts: {
    file: `packages/${name}/dist/index.d.ts`,
    format: 'esm'
  },
  prod: {
    file: `packages/${name}/dist/index.prod.cjs`,
    format: 'cjs',
    plugins: [plugin.minify]
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
    output: output('validierung').cjs,
    plugins: [plugin.alias.esm, plugin.replace.cjs, plugin.esbuild]
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

configs.forEach(config => (config.external = ['vue-demi']))

export default (cliArgs: Record<string, unknown>) => {
  return cliArgs.watch
    ? [
        sharedConfigs[0],
        sharedConfigs[sharedConfigs.length - 1],
        validierungConfigs[0],
        validierungConfigs[validierungConfigs.length - 1]
      ]
    : configs
}
