import { makePromise } from '@validierung/test-utils'
import { PromiseCancel } from '../src/promiseCancel'

let promiseCancel: PromiseCancel<string>

beforeEach(() => {
  promiseCancel = new PromiseCancel()
})

it('should resolve normal when not cancelled', done => {
  const p1 = makePromise(50, 'p1')
  const p2 = makePromise(100, 'p2')

  promiseCancel.race(p1, p2).then(a => {
    expect(a).toBe('p1')
    done()
  })
})

it('should resolve directly after cancelResolve', done => {
  const p1 = makePromise(50, 'p1')
  const p2 = makePromise(100, 'p2')

  promiseCancel.race(p1, p2).then(result => {
    expect(result).toBe('cancelled')
    done()
  })

  promiseCancel.cancelResolve('cancelled')
})

it('should reject directly after cancelReject', done => {
  const p1 = makePromise(50, 'p1')
  const p2 = makePromise(100, 'p2')

  promiseCancel.race(p1, p2).catch(reason => {
    expect(reason).toBe('cancelled')
    done()
  })

  promiseCancel.cancelReject('cancelled')
})
