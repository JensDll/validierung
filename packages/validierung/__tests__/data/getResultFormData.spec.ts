import { vue2Reactive } from '@validierung/shared'
import {
  getResultFormData,
  transformFormData,
  ResultFormData,
  TransformFormData
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
  })

  type Result = ResultFormData<typeof formData>
  const resultFormData: Result = getResultFormData(formData)

  expect(resultFormData).toStrictEqual<Result>({
    a: 1,
    b: {
      c: 1,
      ds: [{ e: 1 }]
    },
    f: { g: 1 }
  })
})

it.only('the predicate should be called for every key', () => {
  const formData = setup({
    a: {
      $value: 1
    },
    b: {
      cs: [1, 2, { d: { $value: { foo: 1 } } }]
    }
  } as const)

  const predicate = jest.fn(() => true)

  type Result = ResultFormData<typeof formData>
  const resultFormData: Result = getResultFormData(formData, predicate)

  expect(predicate).toBeCalledTimes(7)
  expect(predicate).nthCalledWith(1, { key: 'a', value: 1, path: [] })
  expect(predicate).nthCalledWith(2, { key: 'a', value: 1, path: [] })
})
