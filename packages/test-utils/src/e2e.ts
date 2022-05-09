import url from 'node:url'

import puppeteer from 'puppeteer'

export function setupPuppeteer(pagePath: string) {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  const consoleLogMock = vi.fn<any, string[]>()
  const consoleWarnMock = vi.fn<any, string[]>()
  const consoleErrorMock = vi.fn<any, string[]>()

  beforeAll(async () => {
    browser = await puppeteer.launch({})
  })

  beforeEach(async () => {
    page = await browser.newPage()

    await page.goto(url.pathToFileURL(pagePath).href)

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

  function html(selector: string) {
    return page.$eval(selector, node => node.outerHTML)
  }

  return {
    page: () => page,
    html,
    consoleLogMock,
    consoleWarnMock,
    consoleErrorMock
  }
}
