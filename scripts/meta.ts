import { ModuleFormat } from 'rollup'

type PackageNames = 'shared' | 'validierung'

export type PackageOutput = {
  format: ModuleFormat
  fileName: string
}

export type Package = {
  output: PackageOutput[]
  external: string[]
}

export const packages: Record<PackageNames, Package> = {
  shared: {
    output: [
      {
        format: 'esm',
        fileName: 'index.mjs'
      },
      {
        format: 'cjs',
        fileName: 'index.cjs'
      }
    ],
    external: ['vue-demi']
  },
  validierung: {
    output: [
      {
        format: 'esm',
        fileName: 'index.mjs'
      },
      {
        format: 'cjs',
        fileName: 'index.cjs'
      }
    ],
    external: ['vue-demi']
  }
}
