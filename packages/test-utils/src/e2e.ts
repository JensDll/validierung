import url from 'url'

import puppeteer from 'puppeteer'
import { isVue2 } from 'vue-demi'

export function setupPuppeteer(pagePath: string) {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  const consoleLogMock = jest.fn<any, string[]>()
  const consoleWarnMock = jest.fn<any, string[]>()
  const consoleErrorMock = jest.fn<any, string[]>()

  beforeAll(async () => {
    browser = await puppeteer.launch({
      dumpio: true
    })
  })

  beforeEach(async () => {
    page = await browser.newPage()

    await page.goto(url.pathToFileURL(pagePath).href)

    if (isVue2) {
      await page.addScriptTag({
        path: require.resolve('vue2/dist/vue.min.js')
      })
      await page.addScriptTag({
        path: require.resolve(
          '@vue/composition-api/dist/vue-composition-api.prod.js'
        )
      })
    } else {
      await page.addScriptTag({
        path: require.resolve('vue3/dist/vue.global.prod.js')
      })
    }

    page.on('console', msg => {
      switch (msg.type()) {
        case 'log':
          consoleLogMock(msg.text())
          break
        case 'warning':
          consoleWarnMock(msg.text())
          break
        case 'error':
          consoleErrorMock(msg.text())
          break
      }
    })
  })

  afterEach(async () => {
    await page.close()
    consoleLogMock.mockClear()
    consoleWarnMock.mockClear()
    consoleErrorMock.mockClear()
  })

  afterAll(async () => {
    await browser.close()
  })

  async function html(selector: string) {
    return await page.$eval(selector, node => node.outerHTML)
  }

  return {
    page: () => page,
    html,
    consoleLogMock,
    consoleWarnMock,
    consoleErrorMock
  }
}
