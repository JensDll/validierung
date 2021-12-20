import { reactive, isVue2 } from 'vue-demi'

import { vue2Reactive } from '../src/vue2Reactive'

const mockReactive = reactive as jest.MockedFunction<typeof reactive>

afterEach(() => {
  mockReactive.mockClear()
})

jest.mock('vue-demi', () => {
  const vueDemi = jest.requireActual('vue-demi')

  return {
    ...vueDemi,
    reactive: jest.fn(vueDemi.reactive)
  }
})

it('should make simple object reactive', () => {
  const obj = {
    a: {
      b: {
        c: 1
      }
    }
  }

  const result = vue2Reactive(obj)

  if (isVue2) {
    expect(mockReactive).toBeCalledTimes(1)
  } else {
    expect(mockReactive).toBeCalledTimes(1)
  }

  expect(obj).toStrictEqual(result)
})

it('should make nested object reactive', () => {
  const obj = {
    a: {
      bs: [
        {
          c: 1,
          ds: [
            {
              e: {
                f: 2
              }
            }
          ]
        },
        {
          g: 3
        },
        'foo',
        'bar'
      ]
    }
  } as const

  const result = vue2Reactive(obj)

  if (isVue2) {
    expect(mockReactive).toBeCalledTimes(4)
    expect(mockReactive.mock.calls[0][0]).toStrictEqual(obj.a.bs[0].ds[0])
    expect(mockReactive.mock.calls[1][0]).toStrictEqual(obj.a.bs[0])
    expect(mockReactive.mock.calls[2][0]).toStrictEqual(obj.a.bs[1])
    expect(mockReactive.mock.calls[3][0]).toStrictEqual(obj)
  } else {
    expect(mockReactive).toBeCalledTimes(1)
  }

  expect(obj).toStrictEqual(result)
})
