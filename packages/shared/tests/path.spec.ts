import { path } from '../src/path'

let obj: {
  a: number
  b: {
    c: number
    ds: {
      e: number
      f: number
      gs: {
        h: number
      }[]
    }[]
  }
  is: {
    j: number
    k: number
  }[]
}

beforeEach(() => {
  obj = {
    a: 1,
    b: {
      c: 2,
      ds: [
        {
          e: 3,
          f: 4,
          gs: [
            {
              h: 5
            },
            {
              h: 6
            }
          ]
        }
      ]
    },
    is: [
      {
        j: 7,
        k: 8
      }
    ]
  }
})

test('should work for nested paths', () => {
  expect(path(['a'], obj)).toBe(1)
  expect(path(['b', 'c'], obj)).toBe(2)
  expect(path(['b', 'ds', 0, 'e'], obj)).toBe(3)
  expect(path(['b', 'ds', 0, 'f'], obj)).toBe(4)
  expect(path(['b', 'ds', 0, 'gs', 0, 'h'], obj)).toBe(5)
  expect(path(['b', 'ds', 0, 'gs', 1, 'h'], obj)).toBe(6)
  expect(path(['is', 0, 'j'], obj)).toBe(7)
  expect(path(['is', 0, 'k'], obj)).toBe(8)
})

test("should be undefined for paths that don't exist", () => {
  expect(path([], obj)).toBe(undefined)
  expect(path(['x'], obj)).toBe(undefined)
  expect(path(['a', 'x'], obj)).toBe(undefined)
  expect(path(['b', 'x'], obj)).toBe(undefined)
  expect(path(['b', 'ds', 1], obj)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'x'], obj)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'gs', 10], obj)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'gs', 20], obj)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'gs', 0, 'x'], obj)).toBe(undefined)
  expect(path(['b', 'ds', 0, 'gs', 1, 'x'], obj)).toBe(undefined)
  expect(path(['is', 0, 'x'], obj)).toBe(undefined)
})
