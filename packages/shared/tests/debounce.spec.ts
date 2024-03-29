import { makePromise } from '@internal/test-utils'

import { debounce } from '~shared/debounce'

test('should debounce the function call', async () => {
  const target = vi.fn()
  const debounced = debounce(target, { wait: 50 })

  debounced()
  debounced()
  debounced()

  await makePromise(50)

  expect(target).toBeCalledTimes(1)
})

test('should cancel the function call', async () => {
  const target = vi.fn()
  const debounced = debounce(target, { wait: 50 })

  debounced()
  debounced()
  debounced()
  debounced.cancel()

  await makePromise(50)

  expect(target).toBeCalledTimes(0)
})

test('should work in tight loop', async () => {
  const target = vi.fn()
  const debounced = debounce(target, { wait: 10 })

  for (let i = 1; i <= 10; ++i) {
    if (i % 2 === 0) {
      debounced()
      debounced(i)
      await makePromise(10)
    } else {
      debounced()
      debounced.cancel()
      debounced()
      debounced.cancel()
      debounced.cancel()
      debounced.cancel()
      debounced(i)
      await makePromise(10)
    }
  }

  expect(target).toBeCalledTimes(10)
  for (let i = 1; i <= 10; ++i) {
    expect(target).nthCalledWith(i, i)
  }
})
