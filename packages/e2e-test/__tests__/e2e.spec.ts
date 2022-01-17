import path from 'path'
import cp from 'child_process'

import { isVue2 } from 'vue-demi'
import { setupPuppeteer } from '@validierung/test-utils'
import * as Validierung from 'validierung'

interface ExtendedWindow extends Window {
  Validierung: typeof Validierung
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
        path: require.resolve('validierung/dist/index.iife.dev.js')
      })
    })

    it('should warn', async () => {
      await page().evaluate(() => {
        const { createValidation } = window.Validierung

        // @ts-expect-error
        createValidation({
          defaultValidationBehavior: 'foo' as never,
          validationBehavior: {}
          // @ts-expect-error
        }).install()
      })

      expect(consoleWarnMock).toBeCalledTimes(1)
      expect(consoleWarnMock.mock.calls[0][0].startsWith('[validierung]')).toBe(
        true
      )
    })

    it('should throw validierung error', async () => {
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
      ).rejects.toThrow('[validierung]')
    })
  })

  describe('prod mode', () => {
    beforeEach(async () => {
      await page().addScriptTag({
        path: require.resolve('validierung/dist/index.iife.prod.js')
      })
    })

    it('should NOT warn', async () => {
      await page().evaluate(() => {
        const { createValidation } = window.Validierung

        // @ts-expect-error
        createValidation({
          defaultValidationBehavior: 'foo' as never,
          validationBehavior: {}
          // @ts-expect-error
        }).install()
      })

      expect(consoleWarnMock).toBeCalledTimes(0)
    })

    it('should NOT throw validierung error', async () => {
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
    cp.execSync('pnpm run build --filter "@validierung/e2e-test"')
  })

  describe('dev mode', () => {
    beforeEach(async () => {
      await page().addScriptTag({
        path: require.resolve('../dist/index.dev.js')
      })
    })

    it('should warn', async () => {
      await page().evaluate(() => {
        // @ts-expect-error
        testCreateValidation()
      })

      expect(consoleWarnMock).toBeCalledTimes(1)
      expect(consoleWarnMock.mock.calls[0][0].startsWith('[validierung]')).toBe(
        true
      )
    })

    it('should throw validierung error', async () => {
      await expect(
        page().evaluate(() => {
          // @ts-expect-error
          testUseValidation()
        })
      ).rejects.toThrow('[validierung]')
    })
  })

  describe('prod mode', () => {
    beforeEach(async () => {
      await page().addScriptTag({
        path: require.resolve('../dist/index.prod.js')
      })
    })

    it('should NOT warn', async () => {
      await page().evaluate(() => {
        // @ts-expect-error
        testCreateValidation()
      })

      expect(consoleWarnMock).toBeCalledTimes(0)
    })

    it('should NOT throw validierung error', async () => {
      await expect(
        page().evaluate(() => {
          // @ts-expect-error
          testUseValidation()
        })
      ).rejects.toThrow(expect.not.stringContaining('[validierung]'))
    })
  })
})
