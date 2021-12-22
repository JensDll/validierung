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
    name: 'validierung',
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

export const vue2Dependents = ['@vue/composition-api', 'vue-template-compiler']
export const vue3Dependents = ['@vue/server-renderer', '@vitejs/plugin-vue']
