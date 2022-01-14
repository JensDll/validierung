import { ref } from 'vue-demi'

import { makePromise } from '@validierung/jest-helper'
import { useValidation } from '../../src/useValidation'
import { ValidationError } from '../../src/validationError'
import { ValidationBehaviorInfo } from 'validierung'
import { unpackRule } from '../../src/rules'

test('should prioritize last rule call', async () => {
  const promise = new Promise<void>(resolve => {
    const ms = { value: 0 }
    let ruleCalledTimes = 0

    const vbf = jest.fn(() => true)
    const rule = jest.fn(
      () =>
        new Promise(ruleResolve => {
          const result = ms.value.toString()
          setTimeout(() => {
            ruleResolve(result)
            if (++ruleCalledTimes === 6) {
              expect(vbf).toBeCalledTimes(6)
              expect(rule).toBeCalledTimes(6)
              expect(form.a.$errors).toStrictEqual(['50'])
              resolve()
            }
          }, ms.value)
        })
    )

    const { form } = useValidation({
      a: {
        $value: 1,
        $rules: [[vbf, rule]]
      }
    })

    ms.value = 600
    form.a.$validate()
    ms.value = 100
    form.a.$validate()
    ms.value = 400
    form.a.$validate()
    ms.value = 800
    form.a.$validate()
    ms.value = 200
    form.a.$validate()
    ms.value = 50
    form.a.$validate()
  })

  await promise
})

describe.each([
  { debounce: true, note: 'with debounce' },
  { debounce: false, note: 'without debounce' }
])('$note', ({ debounce }) => {
  type MakeRuleResult = {
    tuple: any
    vbf: jest.Mock<boolean, ValidationBehaviorInfo[]>
    rule: jest.Mock
  }

  const makeRule = (
    vbf: jest.Mock<boolean, ValidationBehaviorInfo[]>,
    rule: jest.Mock | { key: string; rule?: jest.Mock }
  ): MakeRuleResult => {
    return {
      tuple: debounce ? [vbf, rule, 50] : [vbf, rule],
      rule: unpackRule(rule)[0] as any,
      vbf
    }
  }

  test('async rule should set validating', async () => {
    const ruleA = makeRule(
      jest.fn(() => true),
      jest.fn(() => makePromise(60, 'a'))
    )
    const ruleB = makeRule(
      jest.fn(() => true),
      jest.fn(() => 'b')
    )

    const { form, errors, hasError, submitting, validating } = useValidation({
      a: {
        $value: 1,
        $rules: [ruleA.tuple, ruleB.tuple]
      }
    })

    const promise = form.a.$validate()

    expect(ruleA.rule).toBeCalledTimes(debounce ? 0 : 1)
    expect(ruleB.rule).toBeCalledTimes(debounce ? 0 : 1)

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: debounce ? [] : ['b'],
      $hasError: !debounce,
      $validate: expect.any(Function),
      $validating: true,
      $value: 1
    })

    expect(errors.value).toStrictEqual(debounce ? [] : ['b'])
    expect(hasError.value).toBe(!debounce)
    expect(submitting.value).toBe(false)
    expect(validating.value).toBe(true)

    await promise

    expect(ruleA.rule).toBeCalledTimes(1)
    expect(ruleA.rule).lastCalledWith(1)
    expect(ruleB.rule).toBeCalledTimes(1)
    expect(ruleB.rule).lastCalledWith(1)

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['a', 'b'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 1
    })

    expect(errors.value).toStrictEqual(['a', 'b'])
    expect(hasError.value).toBe(true)
    expect(submitting.value).toBe(false)
    expect(validating.value).toBe(false)
  })

  test('validateFields should validate all rules and ignore debounce', async () => {
    const ruleA = makeRule(
      jest.fn(() => true),
      jest.fn(() => 'a')
    )
    const ruleB = makeRule(
      jest.fn(() => true),
      { key: 'a', rule: jest.fn(() => 'b') }
    )
    const ruleC = makeRule(
      jest.fn(() => true),
      { key: 'a', rule: jest.fn(() => 'c') }
    )
    const ruleD = makeRule(
      jest.fn(() => true),
      { key: 'b', rule: jest.fn(() => 'd') }
    )
    const ruleE = makeRule(
      jest.fn(() => true),
      { key: 'b', rule: jest.fn(() => makePromise(50, 'e')) }
    )

    const { form, errors, hasError, submitting, validating, validateFields } =
      useValidation({
        a: {
          $value: 1,
          $rules: [ruleA.tuple, ruleB.tuple, ruleD.tuple]
        },
        b: {
          $value: 2,
          $rules: [ruleC.tuple, ruleE.tuple]
        }
      })

    const promise = validateFields()

    expect(ruleA.rule).toBeCalledTimes(1)
    expect(ruleA.rule).toBeCalledWith(1)
    expect(ruleB.rule).toBeCalledTimes(1)
    expect(ruleB.rule).toBeCalledWith(1, 2)
    expect(ruleC.rule).toBeCalledTimes(1)
    expect(ruleC.rule).toBeCalledWith(1, 2)
    expect(ruleD.rule).toBeCalledTimes(1)
    expect(ruleD.rule).toBeCalledWith(1, 2)
    expect(ruleE.rule).toBeCalledTimes(1)
    expect(ruleE.rule).toBeCalledWith(1, 2)

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['a', 'b', 'd'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 1
    })

    expect(form.b).toStrictEqual<typeof form.b>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['c'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: true,
      $value: 2
    })

    expect(errors.value.sort()).toStrictEqual(['a', 'b', 'c', 'd'])
    expect(hasError.value).toBe(true)
    expect(submitting.value).toBe(true)
    expect(validating.value).toBe(true)

    await expect(promise).rejects.toThrow(ValidationError)

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['a', 'b', 'd'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 1
    })

    expect(form.b).toStrictEqual<typeof form.b>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['c', 'e'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 2
    })

    expect(errors.value.sort()).toStrictEqual(['a', 'b', 'c', 'd', 'e'])
    expect(hasError.value).toBe(true)
    expect(submitting.value).toBe(false)
    expect(validating.value).toBe(false)
  })

  test('keyed rule should only be called when all other fields are touched and VBF is true', async () => {
    let a = false
    let b = false
    let e = false

    const ruleA = makeRule(
      jest.fn(() => a),
      { key: 'a', rule: jest.fn() }
    )
    const ruleB = makeRule(
      jest.fn(() => b),
      { key: 'a', rule: jest.fn() }
    )
    const ruleC = makeRule(
      jest.fn(() => true),
      { key: 'a', rule: jest.fn() }
    )
    const ruleD = makeRule(
      jest.fn(() => true),
      { key: 'a', rule: jest.fn() }
    )
    const ruleE = makeRule(
      jest.fn(() => e),
      { key: 'b', rule: jest.fn() }
    )
    const ruleF = makeRule(
      jest.fn(() => true),
      { key: 'b', rule: jest.fn() }
    )

    const { form } = useValidation({
      a: {
        $value: 1,
        $rules: [ruleA.tuple, ruleB.tuple, ruleE.tuple]
      },
      b: {
        $value: 2,
        $rules: [ruleC.tuple]
      },
      c: {
        $value: 3,
        $rules: [ruleD.tuple, ruleF.tuple]
      }
    })

    form.b.$touched = true
    form.c.$touched = true

    await form.a.$validate()

    expect(ruleA.rule).toBeCalledTimes(0)
    expect(ruleB.rule).toBeCalledTimes(0)
    expect(ruleC.rule).toBeCalledTimes(0)
    expect(ruleD.rule).toBeCalledTimes(0)
    expect(ruleE.rule).toBeCalledTimes(0)
    expect(ruleF.rule).toBeCalledTimes(0)

    a = true

    await form.a.$validate()

    expect(ruleA.rule).toBeCalledTimes(0)
    expect(ruleB.rule).toBeCalledTimes(0)
    expect(ruleC.rule).toBeCalledTimes(0)
    expect(ruleD.rule).toBeCalledTimes(0)
    expect(ruleE.rule).toBeCalledTimes(0)
    expect(ruleF.rule).toBeCalledTimes(0)

    b = true

    await form.a.$validate()

    expect(ruleA.rule).toBeCalledTimes(1)
    expect(ruleA.rule).lastCalledWith(1, 2, 3)
    expect(ruleB.rule).toBeCalledTimes(1)
    expect(ruleB.rule).lastCalledWith(1, 2, 3)
    expect(ruleC.rule).toBeCalledTimes(1)
    expect(ruleC.rule).lastCalledWith(1, 2, 3)
    expect(ruleD.rule).toBeCalledTimes(1)
    expect(ruleD.rule).lastCalledWith(1, 2, 3)
    expect(ruleE.rule).toBeCalledTimes(0)
    expect(ruleF.rule).toBeCalledTimes(0)

    e = true

    await form.a.$validate()

    expect(ruleA.rule).toBeCalledTimes(2)
    expect(ruleA.rule).lastCalledWith(1, 2, 3)
    expect(ruleB.rule).toBeCalledTimes(2)
    expect(ruleB.rule).lastCalledWith(1, 2, 3)
    expect(ruleC.rule).toBeCalledTimes(2)
    expect(ruleC.rule).lastCalledWith(1, 2, 3)
    expect(ruleD.rule).toBeCalledTimes(2)
    expect(ruleD.rule).lastCalledWith(1, 2, 3)
    expect(ruleE.rule).toBeCalledTimes(1)
    expect(ruleE.rule).lastCalledWith(1, 3)
    expect(ruleF.rule).toBeCalledTimes(1)
    expect(ruleF.rule).lastCalledWith(1, 3)
  })

  test('validateFields should only validate fields with given name', async () => {
    const ruleA = makeRule(
      jest.fn(() => true),
      jest.fn(() => 'a')
    )
    const ruleB = makeRule(
      jest.fn(() => true),
      { key: 'a', rule: jest.fn(() => 'b') }
    )
    const ruleC = makeRule(
      jest.fn(() => true),
      { key: 'a', rule: jest.fn(() => 'c') }
    )
    const ruleD = makeRule(
      jest.fn(() => true),
      jest.fn(() => 'd')
    )
    const ruleE = makeRule(
      jest.fn(() => true),
      jest.fn(() => 'e')
    )
    const ruleF = makeRule(
      jest.fn(() => true),
      { key: 'a', rule: jest.fn(() => 'f') }
    )

    const { form, validateFields } = useValidation({
      a: {
        $value: ref(1),
        $rules: [ruleA.tuple, ruleB.tuple, ruleC.tuple]
      },
      b: {
        $value: ref(2),
        $rules: [ruleD.tuple]
      },
      c: {
        $value: ref(3),
        $rules: [ruleE.tuple, ruleF.tuple]
      }
    })

    const restoreDefaults = () => {
      ruleA.rule.mockClear()
      ruleA.vbf.mockClear()
      ruleB.rule.mockClear()
      ruleB.vbf.mockClear()
      ruleC.rule.mockClear()
      ruleC.vbf.mockClear()
      ruleD.rule.mockClear()
      ruleD.vbf.mockClear()
      ruleE.rule.mockClear()
      ruleE.vbf.mockClear()
      ruleF.rule.mockClear()
      ruleF.vbf.mockClear()
      form.a.$touched = false
      form.a.$dirty = false
      form.b.$touched = false
      form.b.$dirty = false
      form.c.$touched = false
      form.c.$dirty = false
    }

    await expect(validateFields({ names: [] })).resolves.toStrictEqual({
      a: 1,
      b: 2,
      c: 3
    })

    await expect(validateFields({ names: ['a'] })).rejects.toThrow(
      ValidationError
    )

    expect(ruleA.rule).toBeCalledTimes(1)
    expect(ruleA.rule).lastCalledWith(1)
    expect(ruleB.rule).toBeCalledTimes(0)
    expect(ruleC.rule).toBeCalledTimes(0)
    expect(ruleD.rule).toBeCalledTimes(0)
    expect(ruleE.rule).toBeCalledTimes(0)
    expect(ruleF.rule).toBeCalledTimes(0)

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['a'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 1
    })
    expect(form.b).toStrictEqual<typeof form.b>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: false,
      $errors: [],
      $hasError: false,
      $validate: expect.any(Function),
      $validating: false,
      $value: 2
    })
    expect(form.c).toStrictEqual<typeof form.c>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: false,
      $errors: [],
      $hasError: false,
      $validate: expect.any(Function),
      $validating: false,
      $value: 3
    })

    restoreDefaults()
    await expect(validateFields({ names: ['a', 'b'] })).rejects.toThrow(
      ValidationError
    )

    expect(ruleA.rule).toBeCalledTimes(1)
    expect(ruleA.rule).lastCalledWith(1)
    expect(ruleB.rule).toBeCalledTimes(0)
    expect(ruleC.rule).toBeCalledTimes(0)
    expect(ruleD.rule).toBeCalledTimes(1)
    expect(ruleD.rule).lastCalledWith(2)
    expect(ruleE.rule).toBeCalledTimes(0)
    expect(ruleF.rule).toBeCalledTimes(0)

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['a'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 1
    })
    expect(form.b).toStrictEqual<typeof form.b>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['d'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 2
    })
    expect(form.c).toStrictEqual<typeof form.c>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: false,
      $errors: [],
      $hasError: false,
      $validate: expect.any(Function),
      $validating: false,
      $value: 3
    })

    restoreDefaults()
    await expect(validateFields({ names: ['a', 'b', 'c'] })).rejects.toThrow(
      ValidationError
    )

    expect(ruleA.rule).toBeCalledTimes(1)
    expect(ruleA.rule).lastCalledWith(1)
    expect(ruleB.rule).toBeCalledTimes(1)
    expect(ruleB.rule).lastCalledWith(1, 3)
    expect(ruleC.rule).toBeCalledTimes(1)
    expect(ruleC.rule).lastCalledWith(1, 3)
    expect(ruleD.rule).toBeCalledTimes(1)
    expect(ruleD.rule).lastCalledWith(2)
    expect(ruleE.rule).toBeCalledTimes(1)
    expect(ruleE.rule).lastCalledWith(3)
    expect(ruleF.rule).toBeCalledTimes(1)
    expect(ruleF.rule).lastCalledWith(1, 3)

    expect(form.a).toStrictEqual<typeof form.a>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['a', 'b', 'c'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 1
    })
    expect(form.b).toStrictEqual<typeof form.b>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['d'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 2
    })
    expect(form.c).toStrictEqual<typeof form.c>({
      $uid: expect.any(Number),
      $dirty: false,
      $touched: true,
      $errors: ['e', 'f'],
      $hasError: true,
      $validate: expect.any(Function),
      $validating: false,
      $value: 3
    })
  })

  test('should not brake when keyed rule is undefined', async () => {
    const ruleA = makeRule(
      jest.fn(() => true),
      { key: 'a', rule: jest.fn() }
    )
    const ruleB = makeRule(
      jest.fn(() => true),
      { key: 'a' }
    )
    const ruleC = makeRule(
      jest.fn(() => true),
      { key: 'a' }
    )

    const { form, validateFields } = useValidation({
      a: {
        $value: 1,
        $rules: [ruleA.tuple]
      },
      b: {
        $value: 1,
        $rules: [ruleB.tuple]
      },
      c: {
        $value: 1,
        $rules: [ruleC.tuple]
      }
    })

    await form.a.$validate()

    expect(ruleA.rule).toBeCalledTimes(0)
    expect(ruleA.vbf).toBeCalledTimes(0)
    expect(ruleB.vbf).toBeCalledTimes(0)
    expect(ruleC.vbf).toBeCalledTimes(0)

    form.b.$touched = true
    form.c.$touched = true
    await form.a.$validate()

    expect(ruleA.rule).toBeCalledTimes(1)
    expect(ruleA.vbf).toBeCalledTimes(1)
    expect(ruleB.vbf).toBeCalledTimes(0)
    expect(ruleC.vbf).toBeCalledTimes(0)

    await validateFields()

    expect(ruleA.rule).toBeCalledTimes(2)
    expect(ruleA.vbf).toBeCalledTimes(2)
    expect(ruleB.vbf).toBeCalledTimes(0)
    expect(ruleC.vbf).toBeCalledTimes(0)
  })

  test('changing form values during validation should throw validation error accordingly', async () => {
    const rule = makeRule(
      jest.fn(() => true),
      jest.fn((foo: number) => makePromise(50, foo < 5 && 'a'))
    )

    const { form, validateFields } = useValidation({
      foo: {
        $value: 0,
        $rules: [rule.tuple]
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

  test('resetFields should cancel validation', async () => {
    const rule = makeRule(
      jest.fn(() => true),
      jest.fn(() => makePromise(100, 'a'))
    )

    const { form, validating, validateFields, resetFields } = useValidation({
      a: {
        $value: 1,
        $rules: [rule.tuple]
      }
    })

    resetFields()
    resetFields()

    expect(form.a.$validate()).resolves.toBeUndefined()

    expect(form.a.$validating).toBe(true)
    expect(validating.value).toBe(true)

    resetFields()

    expect(form.a.$validating).toBe(false)
    expect(validating.value).toBe(false)

    const p1 = expect(validateFields()).rejects.toThrow(ValidationError)

    expect(form.a.$validating).toBe(true)
    expect(validating.value).toBe(true)

    resetFields()

    expect(form.a.$validating).toBe(false)
    expect(validating.value).toBe(false)

    await p1

    expect(form.a.$errors).toStrictEqual([])
    expect(form.a.$hasError).toBe(false)
    expect(form.a.$validating).toBe(false)
    expect(validating.value).toBe(false)

    const p2 = expect(form.a.$validate()).resolves.toBeUndefined()

    expect(form.a.$validating).toBe(true)
    expect(validating.value).toBe(true)

    await p2

    expect(form.a.$errors).toStrictEqual(['a'])
    expect(form.a.$hasError).toBe(true)
    expect(form.a.$validating).toBe(false)
    expect(validating.value).toBe(false)
  })
})
