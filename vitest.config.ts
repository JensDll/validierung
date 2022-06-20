/// <reference types="vitest" />

import { defineConfig, configDefaults } from 'vitest/config'
import replace from '@rollup/plugin-replace'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    exclude: ['test-dts', ...configDefaults.exclude],
    clearMocks: true
  },
  plugins: [
    replace({
      preventAssignment: true,
      objectGuard: true,
      __DEV__: true
    })
  ]
})
