import { deepCopy } from '../src/deepCopy'

it('should copy nested object and leave no reference', () => {
  const original = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: [4, 5, 6],
      f: {
        g: 'foo'
      }
    }
  }
  const jsonCopy = JSON.parse(JSON.stringify(original))
  const copy = deepCopy(original)

  original.c.d = -1
  original.c.e[0] = -1
  original.c.f.g = 'bar'

  expect(jsonCopy).toStrictEqual(copy)
})
