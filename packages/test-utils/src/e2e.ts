import url from 'url'

import puppeteer from 'puppeteer'

// First time launching puppeteer can take some time
jest.setTimeout(30000)

export function setupPuppeteer(pagePath: string) {
  let browser: puppeteer.Browser
  let page: puppeteer.Page

  const consoleLogMock = jest.fn<any, string[]>()
  const consoleWarnMock = jest.fn<any, string[]>()
  const consoleErrorMock = jest.fn<any, string[]>()

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
