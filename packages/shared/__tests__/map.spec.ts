import { tryGet, trySet } from '../src/map'

describe('tryGet', () => {
  it('should call success when the key value pair exists', () => {
    const map = new Map([[1, 'foo']])
    const success = jest.fn()
    const failure = jest.fn()

    tryGet(map)({
      success,
      failure
    })(1)

    expect(success).toBeCalledTimes(1)
    expect(success).toBeCalledWith('foo')
    expect(failure).toBeCalledTimes(0)
  })

  it('should call failure when the key value pair does not exist', () => {
    const map = new Map([[1, 'foo']])
    const success = jest.fn()
    const failure = jest.fn()

    tryGet(map)({
      success,
      failure
    })(2)

    expect(success).toBeCalledTimes(0)
    expect(failure).toBeCalledTimes(1)
  })
})

describe('trySet', () => {
  it('should call success when the key value pair does not exist', () => {
    const map = new Map()
    const success = jest.fn()
    const failure = jest.fn()

    trySet(map)({
      success,
      failure
    })(1, 'foo')

    expect(success).toBeCalledTimes(1)
    expect(success).toBeCalledWith('foo')
    expect(failure).toBeCalledTimes(0)
  })

  it('should call failure when the key value pair exists', () => {
    const map = new Map([[1, 'foo']])
    const success = jest.fn()
    const failure = jest.fn()

    trySet(map)({
      success,
      failure
    })(1, 'bar')

    expect(success).toBeCalledTimes(0)
    expect(failure).toBeCalledTimes(1)
    expect(failure).toBeCalledWith('foo')
  })
})
