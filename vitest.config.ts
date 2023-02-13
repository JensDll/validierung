/// <reference types="vitest" />

import { defineConfig, configDefaults } from 'vitest/config'

import { tsPathAlias } from './scripts/rollup'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['dts', ...configDefaults.exclude],
    clearMocks: true
  },
  resolve: {
    alias: [tsPathAlias]
  },
  define: {
    __DEV__: true
  }
})
