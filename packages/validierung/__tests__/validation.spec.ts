import { ref, nextTick } from 'vue-demi'

import { makePromise } from '@validierung/jest-helper'
import { Form } from '../src/form'
import { ValidationBehaviorInfo } from '../src/validationBehavior'
import { ValidationError } from '../src/validationError'

let form: Form

beforeEach(() => {
  form = new Form()
})

describe('validation behavior', () => {
  it('should call vbf before validating', () => {
    const vbf = jest.fn()
    const rule = jest.fn()

    form.registerField(1, 'field', 'foo', [
      {
        vbf,
        rule
      }
    ])

    form.validate(1)

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
  })

  it('with force flag', () => {
    const vbf = jest.fn()
    const rule = jest.fn()

    form.registerField(1, 'field', 'foo', [
      {
        vbf,
        rule
      }
    ])

    form.validate(1, true)

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: true,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
  })

  it('with submit flag', async () => {
    const vbf = jest.fn()
    const rule = jest.fn()

    form.registerField(1, 'field', 'foo', [
      {
        vbf,
        rule
      }
    ])

    await form.validateAll()

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: true,
      touched: true,
      value: 'foo'
    })
  })

  it('when touched', () => {
    const vbf = jest.fn()
    const rule = jest.fn()

    const field = form.registerField(1, 'field', 'foo', [
      {
        vbf,
        rule
      }
    ])

    field.touched.value = true

    form.validate(1)

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: true,
      value: 'foo'
    })
  })

  it('when dirty', async () => {
    const vbf = jest.fn()
    const rule = jest.fn()

    const field = form.registerField(1, 'field', 'foo', [
      {
        vbf,
        rule
      }
    ])

    field.modelValue.value = 'bar'

    await nextTick()

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: true,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'bar'
    })
  })

  it('with ref', () => {
    const vbf = jest.fn()
    const rule = jest.fn()

    form.registerField(1, 'field', ref('foo'), [
      {
        vbf,
        rule
      }
    ])

    form.validate(1)

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
  })

  it('with debounce', async () => {
    const vbf = jest.fn()
    const rule = jest.fn()

    form.registerField(1, 'field', ref('foo'), [
      {
        vbf,
        rule,
        debounce: 20
      }
    ])

    await form.validate(1)

    expect(vbf).toBeCalledTimes(1)
    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
  })

  it('should execute rule when vbf returns true and work with debounce', async () => {
    const vbf = jest.fn(() => true)
    const rule = jest.fn()

    form.registerField(1, 'field', ref('foo'), [
      {
        vbf,
        rule
      },
      {
        vbf,
        rule,
        debounce: 20
      }
    ])

    await form.validate(1)

    expect(vbf).toBeCalledTimes(2)
    expect(vbf).nthCalledWith<ValidationBehaviorInfo[]>(1, {
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
    expect(vbf).nthCalledWith<ValidationBehaviorInfo[]>(2, {
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
    expect(rule).toBeCalledTimes(2)
    expect(rule).nthCalledWith(1, 'foo')
    expect(rule).nthCalledWith(2, 'foo')
  })

  it('should not execute rule when vbf returns false', () => {
    const vbf = jest.fn(() => false)
    const rule = jest.fn()

    form.registerField(1, 'field', ref('foo'), [
      {
        vbf,
        rule
      }
    ])

    form.validate(1)

    expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
      dirty: false,
      force: false,
      hasError: false,
      submit: false,
      touched: false,
      value: 'foo'
    })
    expect(rule).toBeCalledTimes(0)
  })
})

describe('validate', () => {
  it('should invoke all rules on field', async () => {
    const vbf1 = jest.fn(() => true)
    const rule1 = jest.fn(() => 'rule1')

    const vbf2 = jest.fn(() => true)
    const rule2 = jest.fn()

    const field = form.registerField(1, 'field', ref('foo'), [
      {
        vbf: vbf1,
        rule: rule1
      },
      {
        vbf: vbf2,
        rule: rule2
      }
    ])

    await form.validate(1)

    expect(vbf1).toBeCalledTimes(1)
    expect(rule1).toBeCalledTimes(1)
    expect(rule1).toBeCalledWith('foo')

    expect(vbf2).toBeCalledTimes(1)
    expect(rule2).toBeCalledTimes(1)
    expect(rule2).toBeCalledWith('foo')

    expect(field.validating.value).toStrictEqual(false)
    expect(field.hasErrors.value).toStrictEqual([true, false])
    expect(field.hasError.value).toStrictEqual(true)
    expect(field.rawErrors.value).toStrictEqual(['rule1', null])
    expect(field.errors.value).toStrictEqual(['rule1'])
  })

  it('should not invoke rule when VBF is false', async () => {
    const vbf1 = jest.fn(() => false)
    const rule1 = jest.fn(() => 'rule1')

    const vbf2 = jest.fn(() => true)
    const rule2 = jest.fn(() => 'rule2')

    const field = form.registerField(1, 'field', 'foo', [
      {
        vbf: vbf1,
        rule: rule1
      },
      {
        vbf: vbf2,
        rule: rule2
      }
    ])

    await form.validate(1)

    expect(vbf1).toBeCalledTimes(1)
    expect(rule1).toBeCalledTimes(0)

    expect(vbf2).toBeCalledTimes(1)
    expect(rule2).toBeCalledTimes(1)
    expect(rule2).toBeCalledWith('foo')

    expect(field.validating.value).toStrictEqual(false)
    expect(field.hasErrors.value).toStrictEqual([false, true])
    expect(field.hasError.value).toStrictEqual(true)
    expect(field.rawErrors.value).toStrictEqual([null, 'rule2'])
    expect(field.errors.value).toStrictEqual(['rule2'])
  })

  it('with async simple rule should set validating', async () => {
    const vbf1 = jest.fn(() => true)
    const rule1 = jest.fn(() => makePromise(20, 'rule1'))

    const vbf2 = jest.fn(() => true)
    const rule2 = jest.fn(() => 'rule2')

    const field = form.registerField(1, 'field', 'foo', [
      {
        vbf: vbf1,
        rule: rule1
      },
      {
        vbf: vbf2,
        rule: rule2
      }
    ])

    const promise = form.validate(1)

    expect(vbf1).toBeCalledTimes(1)
    expect(rule1).toBeCalledTimes(1)
    expect(rule1).toBeCalledWith('foo')

    expect(vbf2).toBeCalledTimes(1)
    expect(rule2).toBeCalledTimes(1)
    expect(rule2).toBeCalledWith('foo')

    expect(field.validating.value).toStrictEqual(true)
    expect(field.hasErrors.value).toStrictEqual([false, true])
    expect(field.hasError.value).toStrictEqual(true)
    expect(field.rawErrors.value).toStrictEqual([null, 'rule2'])
    expect(field.errors.value).toStrictEqual(['rule2'])

    await promise

    expect(field.validating.value).toStrictEqual(false)
    expect(field.hasErrors.value).toStrictEqual([true, true])
    expect(field.hasError.value).toStrictEqual(true)
    expect(field.rawErrors.value).toStrictEqual(['rule1', 'rule2'])
    expect(field.errors.value).toStrictEqual(['rule1', 'rule2'])
  })

  it('with debounced simple rule should set validating', async () => {
    const vbf1 = jest.fn(() => true)
    const rule1 = jest.fn(() => 'rule1')

    const vbf2 = jest.fn(() => true)
    const rule2 = jest.fn(() => 'rule2')

    const field = form.registerField(1, 'field', 'foo', [
      {
        vbf: vbf1,
        rule: rule1
      },
      {
        vbf: vbf2,
        rule: rule2,
        debounce: 20
      }
    ])

    const promise = form.validate(1)

    expect(vbf1).toBeCalledTimes(1)
    expect(rule1).toBeCalledTimes(1)
    expect(rule1).toBeCalledWith('foo')

    expect(vbf2).toBeCalledTimes(1)
    expect(rule2).toBeCalledTimes(0)

    expect(field.validating.value).toStrictEqual(true)
    expect(field.hasErrors.value).toStrictEqual([true, false])
    expect(field.hasError.value).toStrictEqual(true)
    expect(field.rawErrors.value).toStrictEqual(['rule1', null])
    expect(field.errors.value).toStrictEqual(['rule1'])

    await promise

    expect(rule2).toBeCalledTimes(1)
    expect(rule2).toBeCalledWith('foo')

    expect(field.validating.value).toStrictEqual(false)
    expect(field.hasErrors.value).toStrictEqual([true, true])
    expect(field.hasError.value).toStrictEqual(true)
    expect(field.rawErrors.value).toStrictEqual(['rule1', 'rule2'])
    expect(field.errors.value).toStrictEqual(['rule1', 'rule2'])
  })

  it('should only call keyed rule when all other fields are touched and VBF is true', async () => {
    const vbf1 = jest.fn(() => true)
    const rule1 = jest.fn(() => 'rule1')

    const vbf2 = jest.fn(() => false)
    const rule2 = jest.fn(() => 'rule2')

    const field1 = form.registerField(1, 'field', 'foo', [
      {
        vbf: vbf1,
        rule: {
          key: 'a',
          rule: rule1
        }
      },
      {
        vbf: vbf2,
        rule: {
          key: 'a',
          rule: rule2
        }
      }
    ])

    const vbf3 = jest.fn(() => false)

    const field2 = form.registerField(2, 'field', 'bar', [
      {
        vbf: vbf3,
        rule: {
          key: 'a'
        }
      }
    ])

    const vbf4 = jest.fn(() => true)
    const rule4 = jest.fn(() => 'rule4')

    const field3 = form.registerField(3, 'field', 'baz', [
      {
        vbf: vbf4,
        rule: {
          key: 'a',
          rule: rule4
        }
      }
    ])

    await form.validate(1)

    expect(vbf1).toBeCalledTimes(0)
    expect(rule1).toBeCalledTimes(0)

    expect(vbf2).toBeCalledTimes(0)
    expect(rule2).toBeCalledTimes(0)

    expect(vbf3).toBeCalledTimes(0)

    expect(vbf4).toBeCalledTimes(0)
    expect(rule4).toBeCalledTimes(0)

    field2.touched.value = true
    await form.validate(1)

    expect(vbf1).toBeCalledTimes(0)
    expect(rule1).toBeCalledTimes(0)

    expect(vbf2).toBeCalledTimes(0)
    expect(rule2).toBeCalledTimes(0)

    expect(vbf3).toBeCalledTimes(0)

    expect(vbf4).toBeCalledTimes(0)
    expect(rule4).toBeCalledTimes(0)

    field3.touched.value = true
    await form.validate(1)

    expect(vbf1).toBeCalledTimes(1)
    expect(rule1).toBeCalledTimes(1)
    expect(rule1).toBeCalledWith('foo', 'bar', 'baz')

    expect(vbf2).toBeCalledTimes(1)
    expect(rule2).toBeCalledTimes(0)

    expect(vbf3).toBeCalledTimes(0)

    expect(vbf4).toBeCalledTimes(1)
    expect(rule4).toBeCalledTimes(1)
    expect(rule4).toBeCalledWith('foo', 'bar', 'baz')

    expect(field1.validating.value).toStrictEqual(false)
    expect(field1.hasErrors.value).toStrictEqual([true, false])
    expect(field1.hasError.value).toStrictEqual(true)
    expect(field1.rawErrors.value).toStrictEqual(['rule1', null])
    expect(field1.errors.value).toStrictEqual(['rule1'])

    expect(field2.validating.value).toStrictEqual(false)
    expect(field2.hasErrors.value).toStrictEqual([false])
    expect(field2.hasError.value).toStrictEqual(false)
    expect(field2.rawErrors.value).toStrictEqual([null])
    expect(field2.errors.value).toStrictEqual([])

    expect(field3.validating.value).toStrictEqual(false)
    expect(field3.hasErrors.value).toStrictEqual([true])
    expect(field3.hasError.value).toStrictEqual(true)
    expect(field3.rawErrors.value).toStrictEqual(['rule4'])
    expect(field3.errors.value).toStrictEqual(['rule4'])
  })
})

describe('validateAll', () => {
  it('should validate all fields', async () => {
    const vbf = jest.fn(() => true)

    const rule1 = jest.fn(() => 'rule1')
    const rule2 = jest.fn(() => 'rule2')
    const rule3 = jest.fn(() => 'rule3')
    form.registerField(1, 'field1', 'foo', [
      {
        vbf,
        rule: rule1
      },
      {
        vbf,
        rule: { key: 'a', rule: rule2 }
      },
      {
        vbf,
        rule: { key: 'a', rule: rule3 }
      }
    ])

    const rule4 = jest.fn(() => 'rule4')
    form.registerField(2, 'field2', 'bar', [
      {
        vbf: vbf,
        rule: rule4
      }
    ])

    const rule5 = jest.fn(() => 'rule5')
    const rule6 = jest.fn(() => 'rule6')
    form.registerField(3, 'field3', 'baz', [
      {
        vbf: vbf,
        rule: rule5
      },
      {
        vbf,
        rule: { key: 'a', rule: rule6 }
      }
    ])

    await expect(form.validateAll()).rejects.toThrow(ValidationError)

    expect(rule1).toBeCalledTimes(1)
    expect(rule2).toBeCalledTimes(1)
    expect(rule3).toBeCalledTimes(1)
    expect(rule4).toBeCalledTimes(1)
    expect(rule5).toBeCalledTimes(1)
    expect(rule6).toBeCalledTimes(1)
    expect(form.errors.value).toStrictEqual([
      'rule1',
      'rule2',
      'rule3',
      'rule4',
      'rule5',
      'rule6'
    ])
  })

  it('should only validate fields with given name', async () => {
    const vbf = jest.fn(() => true)

    const rule1 = jest.fn(() => 'rule1')
    const rule2 = jest.fn(() => 'rule2')
    const rule3 = jest.fn(() => 'rule3')
    form.registerField(1, 'field1', 'foo', [
      {
        vbf,
        rule: rule1
      },
      {
        vbf,
        rule: { key: 'a', rule: rule2 }
      },
      {
        vbf,
        rule: { key: 'a', rule: rule3 }
      }
    ])

    const rule4 = jest.fn(() => 'rule4')
    form.registerField(2, 'field2', 'bar', [
      {
        vbf: vbf,
        rule: rule4
      }
    ])

    const rule5 = jest.fn(() => 'rule5')
    const rule6 = jest.fn(() => 'rule6')
    form.registerField(3, 'field3', 'baz', [
      {
        vbf: vbf,
        rule: rule5
      },
      {
        vbf,
        rule: { key: 'a', rule: rule6 }
      }
    ])

    await expect(form.validateAll(['field1'])).rejects.toThrow(ValidationError)

    expect(rule1).toBeCalledTimes(1)

    await expect(form.validateAll(['field1', 'field2'])).rejects.toThrow(
      ValidationError
    )

    expect(rule1).toBeCalledTimes(2)
    expect(rule4).toBeCalledTimes(1)

    await expect(form.validateAll(['field1', 'field3'])).rejects.toThrow(
      ValidationError
    )

    expect(rule1).toBeCalledTimes(3)
    expect(rule2).toBeCalledTimes(1)
    expect(rule3).toBeCalledTimes(1)
    expect(rule4).toBeCalledTimes(1)
    expect(rule5).toBeCalledTimes(1)
    expect(rule6).toBeCalledTimes(1)
  })

  it.each([
    { debounce: true, note: 'with debounce' },
    { debounce: false, note: 'without debounce' }
  ])(
    'should cancel validating when resetting fields and not set errors afterwards ($note)',
    async ({ debounce }) => {
      const vbf = jest.fn(() => true)
      const rule1 = jest.fn(() => makePromise(40, 'rule1'))
      const rule2 = jest.fn(() => makePromise(50, 'rule2'))

      const field = form.registerField(1, 'field', 'foo', [
        {
          vbf,
          rule: rule1
        },
        debounce
          ? {
              vbf,
              rule: rule2,
              debounce: 50
            }
          : {
              vbf,
              rule: rule2
            }
      ])

      form.resetFields()
      form.resetFields()

      form.validate(1)

      expect(field.rulesValidating.value).toBe(2)
      expect(form.rulesValidating.value).toBe(2)

      form.resetFields()

      expect(field.rulesValidating.value).toBe(0)
      expect(form.rulesValidating.value).toBe(0)

      const promise1 = form.validate(1)

      expect(field.rulesValidating.value).toBe(2)
      expect(form.rulesValidating.value).toBe(2)

      form.resetFields()

      expect(field.rulesValidating.value).toBe(0)
      expect(form.rulesValidating.value).toBe(0)

      await promise1

      expect(field.rulesValidating.value).toBe(0)
      expect(form.rulesValidating.value).toBe(0)
      expect(field.hasErrors.value).toStrictEqual([false, false])

      const promise2 = form.validate(1)

      expect(field.rulesValidating.value).toBe(2)
      expect(form.rulesValidating.value).toBe(2)

      await promise2

      expect(field.rulesValidating.value).toBe(0)
      expect(form.rulesValidating.value).toBe(0)
      expect(field.hasErrors.value).toStrictEqual([true, true])
      expect(field.errors.value).toStrictEqual(['rule1', 'rule2'])
    }
  )

  it('should ignore debounce', async () => {
    const vbf = jest.fn(() => true)

    const rule = jest.fn()
    const field = form.registerField(1, 'field', 'foo', [
      {
        vbf,
        rule: rule
      },
      {
        vbf,
        rule: rule,
        debounce: 100
      },
      {
        vbf,
        rule: {
          key: 'a',
          rule
        },
        debounce: 200
      }
    ])

    field.touched.value = true

    let promise: Promise<any> = form.validate(1)

    // Should be validating because of the debounce duration
    expect(form.validating.value).toBe(true)
    expect(field.validating.value).toBe(true)

    await promise

    expect(rule).toBeCalledTimes(3)

    promise = form.validateAll()

    // Should not be validating because debounce was skipped
    expect(form.validating.value).toBe(false)
    expect(field.validating.value).toBe(false)

    await promise

    expect(rule).toBeCalledTimes(6)
  })
})

it('should prioritize last rule call', async () => {
  const testFactory = () =>
    new Promise<void>(resolve => {
      const ms = { value: 0 }
      let timeoutCalledTimes = 0

      const vbf = jest.fn(() => true)
      const rule = jest.fn(
        () =>
          new Promise(resolve => {
            const result = ms.value.toString()
            setTimeout(() => {
              resolve(result)
              if (++timeoutCalledTimes === 6) {
                callback()
              }
            }, ms.value)
          })
      )

      const callback = () => {
        expect(vbf).toBeCalledTimes(6)
        expect(rule).toHaveBeenCalledTimes(6)
        expect(timeoutCalledTimes).toBe(6)
        expect(field.errors.value).toStrictEqual(['50'])
        resolve()
      }

      const field = form.registerField(1, 'name', '', [{ vbf, rule }])

      ms.value = 600
      form.validate(1)
      ms.value = 100
      form.validate(1)
      ms.value = 400
      form.validate(1)
      ms.value = 800
      form.validate(1)
      ms.value = 200
      form.validate(1)
      ms.value = 50
      form.validate(1)
    })

  const tests = []

  for (let i = 0; i < 400; i++) {
    tests.push(testFactory())
  }

  await Promise.all(tests)
})
