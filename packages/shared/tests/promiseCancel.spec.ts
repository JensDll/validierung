import { makePromise } from '@internal/test-utils'
import { PromiseCancel } from '../src/promiseCancel'

let promiseCancel: PromiseCancel<string>

beforeEach(() => {
  promiseCancel = new PromiseCancel()
})

test('should resolve normal when not cancelled', async () => {
  const p1 = makePromise(50, 'p1')
  const p2 = makePromise(100, 'p2')

  await new Promise<void>(resolve => {
    promiseCancel.race(p1, p2).then(a => {
      expect(a).toBe('p1')
      resolve()
    })
  })
})

test('should resolve directly after cancelResolve', async () => {
  const p1 = makePromise(50, 'p1')
  const p2 = makePromise(100, 'p2')

  const sut = new Promise<void>(resolve => {
    promiseCancel.race(p1, p2).then(result => {
      expect(result).toBe('cancelled')
      resolve()
    })
  })

  promiseCancel.cancelResolve('cancelled')

  await sut
})

test('should reject directly after cancelReject', async () => {
  const p1 = makePromise(50, 'p1')
  const p2 = makePromise(100, 'p2')

  const sut = new Promise<void>(resolve => {
    promiseCancel.race(p1, p2).catch(reason => {
      expect(reason).toBe('cancelled')
      resolve()
    })
  })

  promiseCancel.cancelReject('cancelled')

  await sut
})
