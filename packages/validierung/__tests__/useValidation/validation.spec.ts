import { makeMocks, makePromise } from '@validierung/jest-helper'
import { useValidation } from '../../src/useValidation'
import { Field } from '../../src/data/types'
import { ValidationError } from '../../src/validationError'

test('keyed rule should only be called when all other fields are touched and VBF is true', async () => {
  type FormData = {
    a: Field<number>
    b: Field<number>
    c: Field<number>
  }

  let a = false
  let b = false
  const [ruleA, ruleB, ruleC, ruleD] = makeMocks(4)
  const { form } = useValidation<FormData>({
    a: {
      $value: 1,
      $rules: [[() => true, { key: 'a', rule: ruleA }]]
    },
    b: {
      $value: 1,
      $rules: [[() => true, { key: 'a', rule: ruleB }]]
    },
    c: {
      $value: 1,
      $rules: [
        [() => a, { key: 'a', rule: ruleC }],
        [() => b, { key: 'a', rule: ruleD }]
      ]
    }
  })

  form.a.$touched = true
  form.b.$touched = true

  await form.c.$validate()

  expect(ruleA).toBeCalledTimes(0)
  expect(ruleB).toBeCalledTimes(0)
  expect(ruleC).toBeCalledTimes(0)
  expect(ruleD).toBeCalledTimes(0)

  a = true

  await form.c.$validate()

  expect(ruleA).toBeCalledTimes(0)
  expect(ruleB).toBeCalledTimes(0)
  expect(ruleC).toBeCalledTimes(0)
  expect(ruleD).toBeCalledTimes(0)

  b = true

  await form.c.$validate()

  expect(ruleA).toBeCalledTimes(1)
  expect(ruleB).toBeCalledTimes(1)
  expect(ruleC).toBeCalledTimes(1)
  expect(ruleD).toBeCalledTimes(1)
})

test('changing form values during validation should throw validation error accordingly', async () => {
  const vbf = jest.fn(() => true)
  const rule = jest.fn((foo: number) => makePromise(50, foo < 5 && 'Error'))

  const { form, validateFields } = useValidation({
    foo: {
      $value: 0,
      $rules: [[vbf, rule]]
    }
  })

  // Foo is 0 => promise should throw an error
  let promise = validateFields()

  form.foo.$value = 10

  await expect(promise).rejects.toThrow(ValidationError)

  // Foo is 10 => promise should NOT throw an error
  promise = validateFields()

  form.foo.$value = 0

  await expect(promise).resolves.toStrictEqual({
    foo: 10
  })

  // Foo is 0 again => promise should throw an error
  await expect(validateFields()).rejects.toThrow(ValidationError)
})

describe.each([
  { debounce: true, note: 'with debounced rule' },
  { debounce: false, note: 'with async rule' }
])('should change field values correctly ($note)', ({ debounce }) => {
  type FormData = {
    a: Field<string>
  }

  test('using $validate', async () => {
    const rule = jest.fn(() => makePromise(50, 'Error'))
    const { form, submitting, validating } = useValidation<FormData>({
      a: {
        $value: '',
        $rules: [debounce ? [() => true, rule, 100] : [() => true, rule]]
      }
    })

    const promise = form.a.$validate()

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: [],
      $hasError: false,
      $validate: expect.any(Function),
      $validating: true,
      $value: ''
    })
    expect(validating.value).toBe(true)
    expect(submitting.value).toBe(false)

    await promise

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['Error'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: ''
    })
    expect(validating.value).toBe(false)
    expect(submitting.value).toBe(false)
  })

  test('using validateFields', async () => {
    const rule = jest.fn(() => makePromise(50, 'Error'))
    const { form, submitting, validating, validateFields } =
      useValidation<FormData>({
        a: {
          $value: '',
          $rules: [debounce ? [() => true, rule, 100] : [() => true, rule]]
        }
      })

    const promise = validateFields()

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: [],
      $hasError: false,
      $validate: expect.any(Function),
      $validating: true,
      $value: ''
    })
    expect(validating.value).toBe(true)
    expect(submitting.value).toBe(true)

    await expect(promise).rejects.toThrow(ValidationError)

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['Error'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: ''
    })
    expect(validating.value).toBe(false)
    expect(submitting.value).toBe(false)
  })

  test('resetFields should cancel validation', async () => {
    const rule = jest.fn(() => makePromise(50, 'Error'))
    const { form, submitting, validating, validateFields, resetFields } =
      useValidation<FormData>({
        a: {
          $value: '',
          $rules: [debounce ? [() => true, rule, 100] : [() => true, rule]]
        }
      })

    resetFields()

    const validatePromise = form.a.$validate()

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: [],
      $hasError: false,
      $validate: expect.any(Function),
      $validating: true,
      $value: ''
    })
    expect(submitting.value).toBe(false)
    expect(validating.value).toBe(true)

    resetFields()

    await expect(validatePromise).resolves.toBeUndefined()

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: false,
      $errors: [],
      $hasError: false,
      $validate: expect.any(Function),
      $validating: false,
      $value: ''
    })
    expect(submitting.value).toBe(false)
    expect(validating.value).toBe(false)

    const validateFieldsPromise = validateFields()

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: [],
      $hasError: false,
      $validate: expect.any(Function),
      $validating: true,
      $value: ''
    })
    expect(submitting.value).toBe(true)
    expect(validating.value).toBe(true)

    resetFields()

    await expect(validateFieldsPromise).rejects.toThrow(ValidationError)

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: false,
      $errors: [],
      $hasError: false,
      $validate: expect.any(Function),
      $validating: false,
      $value: ''
    })
    expect(submitting.value).toBe(false)
    expect(validating.value).toBe(false)
  })
})
