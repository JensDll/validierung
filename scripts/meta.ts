import { ModuleFormat } from 'rollup'

export type PackageOutput = {
  format: ModuleFormat
  fileName: string
}

export type Package = {
  name: string
  output: PackageOutput[]
  external: string[]
}

export const packages: Package[] = [
  {
    name: 'shared',
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
  {
    name: 'compose-validation',
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
]
