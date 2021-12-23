import { MockedObject } from 'ts-jest/dist/utils/testing'

import { vue2Reactive } from '@validierung/shared'
import {
  disposeForm,
  transformFormData,
  TransformFormData
} from '../../src/data'
import { Form } from '../../src/form'

jest.mock('../../src/Form')

function setup<T extends object>(
  formData: T,
  form: Form
): TransformFormData<T> {
  transformFormData(form, formData)
  return vue2Reactive(formData) as any
}

it('should dispose every field', () => {
  const form = new Form() as MockedObject<Form>
  const formData = setup(
    {
      a: {
        $value: 1,
        $rules: [() => {}, () => {}]
      },
      b: {
        c: {
          $value: 1,
          $rules: [() => {}]
        },
        ds: [
          {
            e: {
              $value: 1,
              $rules: [() => {}, { key: 'key' }]
            }
          },
          {
            f: {
              $value: 1,
              $rules: [() => {}, { key: 'key' }]
            }
          }
        ]
      },
      g: { h: 1 },
      i: { j: { $value: 1, $rules: [() => {}, () => {}] } }
    } as const,
    form
  )

  expect(form.dispose).toBeCalledTimes(0)
  expect(form.simpleValidators.size).toBe(5)
  expect(form.keyedValidators.size).toBe(1)
  expect(form.reactiveFields.size).toBe(5)

  disposeForm(form, formData)

  expect(form.dispose).toBeCalledTimes(5)
  expect(form.simpleValidators.size).toBe(0)
  expect(form.keyedValidators.size).toBe(0)
  expect(form.reactiveFields.size).toBe(0)
})

it('should dispose subset', () => {
  const form = new Form() as MockedObject<Form>
  const formData = setup(
    {
      a: {
        $value: 1,
        $rules: [() => {}, () => {}]
      },
      b: {
        c: {
          $value: 1,
          $rules: [() => {}]
        },
        ds: [
          {
            e: {
              $value: 1,
              $rules: [() => {}, { key: 'key' }]
            }
          },
          {
            f: {
              $value: 1,
              $rules: [() => {}, { key: 'key' }]
            }
          }
        ]
      },
      g: { h: 1 },
      i: { j: { $value: 1, $rules: [() => {}, () => {}] } }
    } as const,
    form
  )

  expect(form.dispose).toBeCalledTimes(0)
  expect(form.simpleValidators.size).toBe(5)
  expect(form.keyedValidators.size).toBe(1)
  expect(form.reactiveFields.size).toBe(5)

  disposeForm(form, formData.b)

  expect(form.dispose).toBeCalledTimes(3)
  expect(form.simpleValidators.size).toBe(2)
  expect(form.keyedValidators.size).toBe(0)
  expect(form.reactiveFields.size).toBe(2)
})
