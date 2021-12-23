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

  expect(mockReactive).toBeCalledTimes(1)
  expect(mockReactive).toBeCalledWith({
    a: {
      b: {
        c: 1
      }
    }
  })
  expect(result).toStrictEqual(obj)
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
                f: 1
              }
            }
          ]
        },
        {
          g: 1
        },
        'foo',
        'bar'
      ]
    }
  } as const

  const result = vue2Reactive(obj)

  if (isVue2) {
    expect(mockReactive).toBeCalledTimes(4)
    expect(mockReactive).nthCalledWith(1, {
      e: {
        f: 1
      }
    })
    expect(mockReactive).nthCalledWith(2, {
      c: 1,
      ds: [
        {
          e: {
            f: 1
          }
        }
      ]
    })
    expect(mockReactive).nthCalledWith(3, {
      g: 1
    })
    expect(mockReactive).nthCalledWith(4, {
      a: {
        bs: [
          {
            c: 1,
            ds: [
              {
                e: {
                  f: 1
                }
              }
            ]
          },
          {
            g: 1
          },
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
            ds: [
              {
                e: {
                  f: 1
                }
              }
            ]
          },
          {
            g: 1
          },
          'foo',
          'bar'
        ]
      }
    })
  }

  expect(obj).toStrictEqual(result)
})
