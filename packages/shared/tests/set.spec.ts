import { reactive, isReactive, watch, nextTick } from 'vue-demi'

import { set } from '../src/set'

test('should do nothing if the path is empty', () => {
  const obj = { a: 1 }

  set(obj, [], 1)

  expect(obj).toStrictEqual(obj)
})

test('should create new properties', () => {
  const obj = {}

  set(obj, ['a'], 1)

  expect(obj).toStrictEqual({ a: 1 })
})

test('should create new nested properties', () => {
  const obj = {}

  set(obj, ['a', 'b'], 1)

  expect(obj).toStrictEqual({ a: { b: 1 } })
})

test('should not overwrite existing properties', () => {
  const obj = {
    a: 1,
    b: {
      c: 1
    }
  }

  set(obj, ['b', 'd'], 1)
  set(obj, ['e'], 1)

  expect(obj).toStrictEqual({
    a: 1,
    b: {
      c: 1,
      d: 1
    },
    e: 1
  })
})

test('should create nested properties in arrays', () => {
  const obj: any[] = []

  set(obj, [0, 'a'], 1)
  set(obj, [1, 'a'], 1)

  expect(obj).toStrictEqual([{ a: 1 }, { a: 1 }])
})

test('should create arrays if the path contains a number', () => {
  const obj = {}

  set(obj, ['as', 0], 1)
  set(obj, ['as', 1, 'a'], 1)
  set(obj, ['as', 2, 'bs', 0], 1)

  expect(obj).toStrictEqual({
    as: [
      1,
      {
        a: 1
      },
      {
        bs: [1]
      }
    ]
  })
})

test('should keep existing arrays', () => {
  const obj = {}

  set(obj, ['a', 0, 'a', 0], 1)
  set(obj, ['a', 0, 'a', 1], 2)
  set(obj, ['a', 0, 'a', 2], 3)
  set(obj, ['a', 0, 'a', 3], 4)

  set(obj, ['b', 0, 'b', 0], 1)
  set(obj, ['b', 0, 'b', 1], 2)
  set(obj, ['b', 0, 'b', 2], 3)
  set(obj, ['b', 0, 'b', 3], 4)

  expect(obj).toStrictEqual({
    a: [{ a: [1, 2, 3, 4] }],
    b: [{ b: [1, 2, 3, 4] }]
  })

  set(obj, ['b'], [])

  expect(obj).toStrictEqual({
    a: [{ a: [1, 2, 3, 4] }],
    b: []
  })
})

describe('reactive', () => {
  test('should trigger watch', async () => {
    const obj = reactive({
      a: 1,
      bs: []
    })
    const mock = vi.fn()

    watch(obj, mock, { deep: true })

    set(obj, ['c'], 1)

    await nextTick()

    set(obj, ['bs', 0], 1)

    await nextTick()

    expect(mock).toBeCalledTimes(2)
  })

  test('should make new objects reactive', async () => {
    const obj: any = reactive({})

    set(obj, ['a'], { x: 1 })
    set(obj, ['b'], { x: 1 })
    set(obj, ['cs'], [])
    set(obj, ['cs', 0], { x: 1 })

    expect(isReactive(obj.a)).toBe(true)
    expect(isReactive(obj.b)).toBe(true)
    expect(isReactive(obj.cs)).toBe(true)
    expect(isReactive(obj.cs[0])).toBe(true)
  })
})
