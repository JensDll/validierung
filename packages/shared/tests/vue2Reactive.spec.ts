import { reactive, isVue2, ref, computed } from 'vue-demi'

import { vue2Reactive } from '../src/vue2Reactive'

vi.mock('vue-demi', async () => {
  const vueDemi = await vi.importActual<typeof import('vue-demi')>('vue-demi')

  return {
    ...vueDemi,
    reactive: vi.fn(vueDemi.reactive)
  }
})

const mockReactive = vi.mocked(reactive)

test('should make simple object reactive', () => {
  const obj = { a: { b: { c: 1 } } }
  const result = vue2Reactive(obj)

  expect(reactive).toBeCalledTimes(1)
  expect(reactive).toBeCalledWith({
    a: {
      b: {
        c: 1
      }
    }
  })
  expect(result).toStrictEqual(obj)
})

test('should make nested object reactive', () => {
  const obj = {
    a: {
      bs: [
        {
          c: 1,
          ds: [{ e: { f: 1 } }]
        },
        { g: 1 },
        'foo',
        'bar'
      ]
    }
  }
  const result = vue2Reactive(obj)

  if (isVue2) {
    expect(mockReactive).toBeCalledTimes(4)
    expect(mockReactive).nthCalledWith(1, { e: { f: 1 } })
    expect(mockReactive).nthCalledWith(2, {
      c: 1,
      ds: [{ e: { f: 1 } }]
    })
    expect(mockReactive).nthCalledWith(3, { g: 1 })
    expect(mockReactive).nthCalledWith(4, {
      a: {
        bs: [
          {
            c: 1,
            ds: [{ e: { f: 1 } }]
          },
          { g: 1 },
          'foo',
          'bar'
        ]
      }
    })
  } else {
    expect(mockReactive).toBeCalledTimes(1)
    expect(mockReactive).toBeCalledWith({
      a: {
        bs: [
          {
            c: 1,
            ds: [{ e: { f: 1 } }]
          },
          { g: 1 },
          'foo',
          'bar'
        ]
      }
    })
  }

  expect(obj).toStrictEqual(result)
})

test('should not call reactive on ref and computed as first child in array', () => {
  const obj = {
    a: [ref(1), computed(() => 1)]
  }
  const result = vue2Reactive(obj)

  expect(mockReactive).toBeCalledTimes(1)
  expect(obj).toStrictEqual(result)
})
