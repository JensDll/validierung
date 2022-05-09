/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import replace from '@rollup/plugin-replace'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
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
