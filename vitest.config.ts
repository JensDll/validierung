/// <reference types="vitest" />

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, configDefaults } from 'vitest/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    exclude: ['dts', ...configDefaults.exclude],
    clearMocks: true
  },
  resolve: {
    alias: [
      {
        find: /^~(.+?)\/(.+)/,
        replacement: path.resolve(rootDir, 'packages/$1/src/$2')
      }
    ]
  },
  define: {
    __DEV__: true
  }
})
