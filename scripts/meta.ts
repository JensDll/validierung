import type { ModuleFormat } from 'rollup'

export type Package = {
  name: string
  outputFormats: ModuleFormat[]
  external: string[]
}

export const packages: Package[] = [
  {
    name: 'shared',
    outputFormats: ['esm', 'cjs'],
    external: ['vue-demi']
  },
  {
    name: 'core',
    outputFormats: ['esm', 'cjs'],
    external: ['vue-demi', '@compose-validation/shared']
  }
]
