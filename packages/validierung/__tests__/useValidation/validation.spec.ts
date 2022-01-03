import { makePromise } from '@validierung/jest-helper'
import { UseValidation, useValidation } from '../../src/useValidation'
import { Field } from '../../src/data/types'
import { ValidationError } from '../../src/validationError'

describe.each([
  { debounce: true, note: 'with debounced rule' },
  { debounce: false, note: 'with async rule' }
])('should change field values correctly ($note)', ({ debounce }) => {
  let rule: jest.Mock
  let useVal: UseValidation<{
    a: Field<string>
  }>

  beforeEach(() => {
    rule = jest.fn(() => makePromise(50, 'Error'))
    useVal = useValidation({
      a: {
        $value: '',
        // @ts-expect-error
        $rules: [debounce ? [() => true, rule, 100] : [() => true, rule]]
      }
    })
  })

  test('using $validate', async () => {
    const { form, submitting, validating } = useVal

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
    const { form, submitting, validating, validateFields } = useVal

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
    const { form, submitting, validating, validateFields, resetFields } = useVal

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
