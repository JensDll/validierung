import path from 'node:path'
import cp from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { isVue2 } from 'vue-demi'
import { setupPuppeteer } from '@internal/test-utils'
import type * as Validierung from 'validierung'

interface ExtendedWindow extends Window {
  Validierung: typeof Validierung
  testCreateValidation(): void
  testUseValidation(): void
}

declare const window: ExtendedWindow

const { page, consoleWarnMock } = setupPuppeteer(
  path.resolve(__dirname, 'index.html')
)

describe('iife', () => {
  beforeEach(async () => {
    if (isVue2) {
      await page().addScriptTag({
        path: require.resolve('vue2/dist/vue.min.js')
      })
      await page().addScriptTag({
        path: require.resolve(
          '@vue/composition-api/dist/vue-composition-api.prod.js'
        )
      })
    } else {
      await page().addScriptTag({
        path: require.resolve('vue3/dist/vue.global.prod.js')
      })
    }
  })

  describe('dev mode', () => {
    beforeEach(async () => {
      await page().addScriptTag({
        path: 'node_modules/validierung/dist/index.iife.js'
      })
    })

    test('should warn', async () => {
      await page().evaluate(() => {
        window.Validierung.createValidation({
          defaultValidationBehavior: 'invalid' as never,
          validationBehavior: {}
        }).install()
      })

      expect(consoleWarnMock).toBeCalledTimes(1)
      expect(consoleWarnMock.mock.calls[0][0].startsWith('[validierung]')).toBe(
        true
      )
    })

    test('should throw validierung error', async () => {
      await expect(
        page().evaluate(() => {
          window.Validierung.useValidation({
            field: {
              $value: '',
              $rules: [['invalid', () => {}]]
            }
          })
        })
      ).rejects.toThrow('[validierung]')
    })
  })

  describe('prod mode', () => {
    beforeEach(async () => {
      await page().addScriptTag({
        path: 'node_modules/validierung/dist/index.iife.min.js'
      })
    })

    test('should NOT warn', async () => {
      await page().evaluate(() => {
        window.Validierung.createValidation({
          defaultValidationBehavior: 'invalid' as never,
          validationBehavior: {}
        }).install()
      })

      expect(consoleWarnMock).toBeCalledTimes(0)
    })

    test('should NOT throw validierung error', async () => {
      await expect(
        page().evaluate(() => {
          const { useValidation } = window.Validierung

          useValidation({
            field: {
              $value: '',
              $rules: [['invalid', () => {}]]
            }
          })
        })
      ).rejects.toThrow(expect.not.stringContaining('[validierung]'))
    })
  })
})

describe('cjs', () => {
  beforeAll(() => {
    cp.execSync('pnpm run --filter "@internal/e2e-test" build')
  })

  describe('dev mode', () => {
    beforeEach(async () => {
      await page().addScriptTag({
        path: fileURLToPath(new URL('../dist/index.js', import.meta.url))
      })
    })

    test('should warn', async () => {
      await page().evaluate(() => {
        window.testCreateValidation()
      })

      expect(consoleWarnMock).toBeCalledTimes(1)
      expect(consoleWarnMock.mock.calls[0][0].startsWith('[validierung]')).toBe(
        true
      )
    })

    test('should throw validierung error', async () => {
      await expect(
        page().evaluate(() => {
          window.testUseValidation()
        })
      ).rejects.toThrow('[validierung]')
    })
  })

  describe('prod mode', () => {
    beforeEach(async () => {
      await page().addScriptTag({
        path: fileURLToPath(new URL('../dist/index.min.js', import.meta.url))
      })
    })

    test('should NOT warn', async () => {
      await page().evaluate(() => {
        window.testCreateValidation()
      })

      expect(consoleWarnMock).toBeCalledTimes(0)
    })

    test('should NOT throw validierung error', async () => {
      await expect(
        page().evaluate(() => {
          window.testUseValidation()
        })
      ).rejects.toThrow(expect.not.stringContaining('[validierung]'))
    })
  })
})
