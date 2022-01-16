import path from 'path'

import { setupPuppeteer } from '@validierung/test-utils'

const { page, consoleWarnMock } = setupPuppeteer(
  path.resolve(__dirname, 'index.html')
)

describe('iife', () => {
  beforeEach(async () => {
    await page().addScriptTag({
      path: require.resolve('validierung/dist/index.iife.min.js')
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
