import { MockedObject } from 'ts-jest/dist/utils/testing'

import { vue2Reactive } from '@validierung/shared'
import { resetFields } from '../../src/data/resetFields'
import { transformFormData } from '../../src/data/transformFormData'
import { Form } from '../../src/form'

jest.mock('../../src/Form')

it.only('should reset fields to passed values and not trigger validation', done => {
  const form = new Form() as MockedObject<Form>
  let formData = {
    a: {
      $value: 1,
      $rules: [() => {}],
      extra: 'extra'
    },
    b: {
      $value: 1,
      $rules: [() => {}, () => {}, { key: 'a', rule: () => {} }]
    },
    cs: [
      {
        d: { $value: 1, $rules: [() => {}, { key: 'b', rule: () => {} }] },
        e: { $value: 1, $rules: [() => {}, { key: 'c', rule: () => {} }] }
      },
      {
        f: { $value: 1, $rules: [() => {}, { key: 'b', rule: () => {} }] },
        g: { $value: 1, $rules: [() => {}, { key: 'c', rule: () => {} }] }
      },
      {
        h: { $value: 1, $rules: [() => {}, { key: 'b', rule: () => {} }] },
        i: { $value: 1, $rules: [() => {}, { key: 'c', rule: () => {} }] }
      }
    ],
    j: { k: 1, ls: [1, 2, 3] }
  }

  transformFormData(form, formData)
  formData = vue2Reactive(formData)

  resetFields(
    form,
    {
      a: 10,
      b: 20,
      cs: [
        { d: 30, e: 40 },
        { f: 50, g: 60 },
        { h: 70, i: 80 }
      ],
      j: { k: 90, ls: [100, 110, 120] }
    },
    formData
  )

  expect(formData).toStrictEqual({
    a: {
      $uid: expect.any(Number),
      $value: 10,
      $errors: [],
      $hasError: false,
      $hasErrors: [false],
      $validating: false,
      $dirty: false,
      $touched: false,
      $validate: expect.any(Function),
      extra: 'extra'
    },
    b: {
      $uid: expect.any(Number),
      $value: 20,
      $errors: [],
      $hasError: false,
      $hasErrors: [false, false, false],
      $validating: false,
      $dirty: false,
      $touched: false,
      $validate: expect.any(Function)
    },
    cs: [
      {
        d: {
          $uid: expect.any(Number),
          $value: 30,
          $errors: [],
          $hasError: false,
          $hasErrors: [false, false],
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        e: {
          $uid: expect.any(Number),
          $value: 40,
          $errors: [],
          $hasError: false,
          $hasErrors: [false, false],
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        }
      },
      {
        f: {
          $uid: expect.any(Number),
          $value: 50,
          $errors: [],
          $hasError: false,
          $hasErrors: [false, false],
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        g: {
          $uid: expect.any(Number),
          $value: 60,
          $errors: [],
          $hasError: false,
          $hasErrors: [false, false],
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        }
      },
      {
        h: {
          $uid: expect.any(Number),
          $value: 70,
          $errors: [],
          $hasError: false,
          $hasErrors: [false, false],
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        i: {
          $uid: expect.any(Number),
          $value: 80,
          $errors: [],
          $hasError: false,
          $hasErrors: [false, false],
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        }
      }
    ],
    j: { k: 1, ls: [1, 2, 3] }
  })

  setTimeout(() => {
    expect(form.validate).toBeCalledTimes(0)
    done()
  }, 0)
})
