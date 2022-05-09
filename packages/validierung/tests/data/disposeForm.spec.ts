import { vue2Reactive } from '@internal/shared'

import {
  disposeForm,
  transformFormData,
  type TransformFormData
} from '../../src/data'
import { Form } from '../../src/form'
import { FormField } from '../../src/formField'

vi.mock('../../src/form')

function setup<T extends object>(
  formData: T,
  form: Form
): TransformFormData<T> {
  transformFormData(form, formData)
  return vue2Reactive(formData) as any
}

test('should dispose every field', () => {
  const form = vi.mocked(new Form())
  const formData = setup(
    {
      a: {
        $value: 1,
        $rules: [() => {}, () => {}]
      },
      b: {
        c: {
          $value: 2,
          $rules: [() => {}]
        },
        ds: [
          {
            e: {
              $value: 3,
              $rules: [() => {}, { key: 'key', rule: () => {} }]
            }
          },
          {
            f: {
              $value: 4,
              $rules: [() => {}, { key: 'key', rule: () => {} }]
            }
          }
        ]
      },
      g: { h: 5 },
      i: {
        j: {
          $value: 6,
          $rules: [
            () => {},
            () => {},
            { key: 'key', rule: () => {} },
            { key: 'key', rule: () => {} }
          ]
        }
      }
    } as const,
    form
  )
  const keyedEntry = form.keyedMap.get('key')!

  expect(form.dispose).toBeCalledTimes(0)
  expect(form.keyedMap.size).toBe(1)
  expect(form.simpleMap.size).toBe(5)
  expect(form.reactiveFieldMap.size).toBe(5)

  expect(keyedEntry.modelValues.map(r => r.value)).toStrictEqual([3, 4, 6])
  expect(keyedEntry.fields).toStrictEqual(
    Array.from({ length: 3 }, () => expect.any(FormField))
  )

  disposeForm(form, formData)

  expect(form.dispose).toBeCalledTimes(5)
  expect(form.simpleMap.size).toBe(0)
  expect(form.keyedMap.size).toBe(0)
  expect(form.reactiveFieldMap.size).toBe(0)
})

test('should dispose a subset', () => {
  const form = vi.mocked(new Form())
  const formData = setup(
    {
      a: {
        $value: 1,
        $rules: [() => {}, () => {}]
      },
      b: {
        c: {
          $value: 2,
          $rules: [() => {}]
        },
        ds: [
          {
            e: {
              $value: 3,
              $rules: [() => {}, { key: 'key', rule: () => {} }]
            }
          },
          {
            f: {
              $value: 4,
              $rules: [() => {}, { key: 'key', rule: () => {} }]
            }
          }
        ]
      },
      g: { h: 5 },
      i: {
        j: {
          $value: 6,
          $rules: [
            () => {},
            () => {},
            { key: 'key', rule: () => {} },
            { key: 'key', rule: () => {} }
          ]
        }
      }
    } as const,
    form
  )
  const keyedEntry = form.keyedMap.get('key')!

  disposeForm(form, formData.b)
  // @ts-expect-error
  delete formData.b

  expect(keyedEntry.modelValues.map(r => r.value)).toStrictEqual([6])
  expect(keyedEntry.fields).toStrictEqual(
    Array.from({ length: 1 }, () => expect.any(FormField))
  )

  expect(form.dispose).toBeCalledTimes(3)
  expect(form.simpleMap.size).toBe(2)
  expect(form.keyedMap.size).toBe(1)
  expect(form.reactiveFieldMap.size).toBe(2)

  disposeForm(form, formData)

  expect(form.dispose).toBeCalledTimes(5)
  expect(form.simpleMap.size).toBe(0)
  expect(form.keyedMap.size).toBe(0)
  expect(form.reactiveFieldMap.size).toBe(0)
})
