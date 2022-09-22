import { isArray, isDefined, isObject, isRecord } from '~shared/typeGuards'

describe('isDefined', () => {
  test('null -> false', () => {
    expect(isDefined(null)).toBe(false)
  })

  test('undefined -> false', () => {
    expect(isDefined(void 0)).toBe(false)
  })

  test('any -> true', () => {
    expect(isDefined(0)).toBe(true)
  })
})

describe('isArray', () => {
  test('null -> false', () => {
    expect(isArray(null)).toBe(false)
  })

  test('{} -> false', () => {
    expect(isArray({})).toBe(false)
  })

  test('[] -> true', () => {
    expect(isArray([])).toBe(true)
  })
})

describe('isRecord', () => {
  test('null -> false', () => {
    expect(isRecord(null)).toBe(false)
  })

  test('[] -> false', () => {
    expect(isRecord([])).toBe(false)
  })

  test('{} -> true', () => {
    expect(isRecord({})).toBe(true)
  })
})

describe('isObject', () => {
  test('null -> false', () => {
    expect(isObject(null)).toBe(false)
  })

  test('[] -> true', () => {
    expect(isObject([])).toBe(true)
  })

  test('{} -> true', () => {
    expect(isObject({})).toBe(true)
  })
})
