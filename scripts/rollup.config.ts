import { type RollupOptions } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import path from 'path'

import { packages } from './meta'

const configs: RollupOptions[] = []

const esbuildPlugin = esbuild({ tsconfig: path.resolve('../tsconfig.json') })
const dtsPlugin = dts()

for (const { name, external, outputFormats } of packages) {
  const config: RollupOptions = {
    input: `packages/${name}/src/index.ts`,
    output: outputFormats.map(format => ({
      file: `packages/${name}/dist/index.${format}.js`,
      format
    })),
    external,
    plugins: [esbuildPlugin]
  }

  const dtsConfig: RollupOptions = {
    input: `packages/${name}/src/index.ts`,
    output: {
      file: `packages/${name}/dist/index.d.ts`,
      format: 'es'
    },
    external,
    plugins: [dtsPlugin]
  }

  configs.push(config, dtsConfig)
}

export default configs
