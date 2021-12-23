import { vue2Reactive } from '@validierung/shared'
import {
  getResultFormData,
  transformFormData,
  ResultFormData,
  TransformFormData,
  ValidateFieldsPredicateParameter
} from '../../src/data'
import { Form } from '../../src/form'

function setup<T extends object>(formData: T): TransformFormData<T> {
  transformFormData(new Form(), formData)
  return vue2Reactive(formData) as any
}

it('should only keep the $value properties', () => {
  const formData = setup({
    a: {
      $value: 1
    },
    b: {
      c: {
        $value: 1,
        $rules: []
      },
      ds: [
        {
          e: {
            $value: 1
          }
        }
      ]
    },
    f: { g: 1 }
  } as const)

  type Result = ResultFormData<typeof formData>
  const result: Result = getResultFormData(formData)

  expect(result).toStrictEqual<Result>({
    a: 1,
    b: {
      c: 1,
      ds: [{ e: 1 }]
    },
    f: { g: 1 }
  })
})

describe('predicate', () => {
  type MockPredicate = jest.Mock<boolean, ValidateFieldsPredicateParameter[]>

  it('should be called for every key', () => {
    const formData = setup({
      a: {
        $value: 1
      },
      b: {
        cs: [1, 2, { d: { $value: { foo: 1 } } }]
      }
    } as const)

    const predicate: MockPredicate = jest.fn(() => true)
    getResultFormData(formData, predicate)

    expect(predicate).toBeCalledTimes(7)
    expect(predicate).nthCalledWith(1, { key: 'a', value: 1, path: [] })
    expect(predicate).nthCalledWith(2, {
      key: 'b',
      value: formData.b,
      path: []
    })
    expect(predicate).nthCalledWith(3, {
      key: 'cs',
      value: formData.b.cs,
      path: ['b']
    })
    expect(predicate).nthCalledWith(4, {
      key: '0',
      value: 1,
      path: ['b', 'cs']
    })
    expect(predicate).nthCalledWith(5, {
      key: '1',
      value: 2,
      path: ['b', 'cs']
    })
    expect(predicate).nthCalledWith(6, {
      key: '2',
      value: formData.b.cs[2],
      path: ['b', 'cs']
    })
    expect(predicate).nthCalledWith(7, {
      key: 'd',
      value: formData.b.cs[2].d.$value,
      path: ['b', 'cs', '2']
    })
  })

  it('filter object', () => {
    const formData = setup({
      a: {
        $value: 1
      },
      b: {
        cs: [1, 2, { d: { $value: { foo: 1 } } }]
      }
    } as const)

    const predicate: MockPredicate = jest.fn(({ key }) => key !== 'cs')
    const result = getResultFormData(formData, predicate)

    expect(predicate).toBeCalledTimes(3)
    expect(predicate).nthCalledWith(1, { key: 'a', value: 1, path: [] })
    expect(predicate).nthCalledWith(2, {
      key: 'b',
      value: formData.b,
      path: []
    })
    expect(predicate).nthCalledWith(3, {
      key: 'cs',
      value: formData.b.cs,
      path: ['b']
    })
    expect(result).toStrictEqual({
      a: 1,
      b: {}
    })
  })

  it('filter array (start)', () => {
    const formData = setup([1, 2, { d: { $value: { foo: 1 } } }] as const)

    const predicate: MockPredicate = jest.fn(({ key }) => key !== '0')
    const result = getResultFormData(formData, predicate)

    expect(predicate).toBeCalledTimes(4)
    expect(predicate).nthCalledWith(1, {
      key: '0',
      value: 1,
      path: []
    })
    expect(predicate).nthCalledWith(2, {
      key: '1',
      value: 2,
      path: []
    })
    expect(predicate).nthCalledWith(3, {
      key: '2',
      value: formData[2],
      path: []
    })
    expect(predicate).nthCalledWith(4, {
      key: 'd',
      value: { foo: 1 },
      path: ['2']
    })
    expect(result).toStrictEqual([2, { d: { foo: 1 } }])
  })

  it('filter array (middle)', () => {
    const formData = setup([1, 2, { d: { $value: { foo: 1 } } }] as const)

    const predicate: MockPredicate = jest.fn(({ key }) => key !== '1')
    const result = getResultFormData(formData, predicate)

    expect(predicate).toBeCalledTimes(4)
    expect(predicate).nthCalledWith(1, {
      key: '0',
      value: 1,
      path: []
    })
    expect(predicate).nthCalledWith(2, {
      key: '1',
      value: 2,
      path: []
    })
    expect(predicate).nthCalledWith(3, {
      key: '2',
      value: formData[2],
      path: []
    })
    expect(predicate).nthCalledWith(4, {
      key: 'd',
      value: { foo: 1 },
      path: ['2']
    })
    expect(result).toStrictEqual([1, { d: { foo: 1 } }])
  })

  it('filter array (end)', () => {
    const formData = setup([1, 2, { d: { $value: { foo: 1 } } }] as const)

    const predicate: MockPredicate = jest.fn(({ key }) => key !== '2')
    const result = getResultFormData(formData, predicate)

    expect(predicate).toBeCalledTimes(3)
    expect(predicate).nthCalledWith(1, {
      key: '0',
      value: 1,
      path: []
    })
    expect(predicate).nthCalledWith(2, {
      key: '1',
      value: 2,
      path: []
    })
    expect(predicate).nthCalledWith(3, {
      key: '2',
      value: formData[2],
      path: []
    })

    expect(result).toStrictEqual([1, 2])
  })
})
