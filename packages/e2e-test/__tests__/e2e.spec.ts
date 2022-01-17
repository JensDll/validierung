import path from 'path'
import cp from 'child_process'

import { isVue2 } from 'vue-demi'
import { setupPuppeteer } from '@validierung/test-utils'

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

    await page().addScriptTag({
      path: require.resolve('validierung/dist/index.iife.prod.js')
    })
  })

  it('should not warn on invalid input', async () => {
    await page().evaluate(() => {
      const { createValidation } = (window as any).Validierung

      createValidation({
        defaultValidationBehavior: 'foo',
        validationBehavior: {}
      }).install()
    })

    expect(consoleWarnMock).toBeCalledTimes(0)
  })
})

describe('cjs', () => {
  beforeAll(() => {
    cp.execSync('pnpm run build --filter "@validierung/e2e-test"')
  })

  it('should warn in dev mode', async () => {
    await page().addScriptTag({
      path: require.resolve('../dist/index.dev.js')
    })

    expect(consoleWarnMock).toBeCalledTimes(1)
    expect(consoleWarnMock.mock.calls[0][0].startsWith('[useValidation]')).toBe(
      true
    )
  })

  it('should not warn in prod mode', async () => {
    await page().addScriptTag({
      path: require.resolve('../dist/index.prod.js')
    })

    expect(consoleWarnMock).toBeCalledTimes(0)
  })
})
