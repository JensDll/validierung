import path from 'path'

import { RollupOptions } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import { packages } from './meta'

const rootDir = path.resolve(__dirname, '..')

const configs: RollupOptions[] = []

for (const { name, external, output } of packages) {
  const config: RollupOptions = {
    input: `packages/${name}/src/index.ts`,
    output: output.map(({ format, fileName }) => ({
      file: `packages/${name}/dist/${fileName}`,
      format
    })),
    external,
    plugins: [
      nodeResolve({
        resolveOnly: ['@validierung/shared']
      }),
      esbuild({
        target: 'ES2019'
      })
    ]
  }

  const dtsConfig: RollupOptions = {
    input: `packages/${name}/src/index.ts`,
    output: {
      file: `packages/${name}/dist/index.d.ts`,
      format: 'esm'
    },
    external,
    plugins: [
      alias({
        entries: [
          {
            find: '@validierung/shared',
            replacement: path.resolve(rootDir, 'packages', 'shared')
          }
        ]
      }),
      dts()
    ]
  }

  configs.push(config, dtsConfig)
}

export default configs
