import { vue2Reactive } from '@validierung/shared'
import {
  transformFormData,
  mapFieldRules
} from '../../src/data/transformFormData'
import { Form } from '../../src/form'
import { RuleInformation } from '../../src/rules'

jest.mock('../../src/validationConfig')

it('should transform every field', () => {
  const form = new Form()
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

  expect(formData).toStrictEqual({
    a: {
      $uid: expect.any(Number),
      $value: 1,
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
      $value: 1,
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
          $value: 1,
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
          $value: 1,
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
          $value: 1,
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
          $value: 1,
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
          $value: 1,
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
          $value: 1,
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
})

describe('mapFieldRules', () => {
  it('simple rule', () => {
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([rule])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule
      }
    ])
  })

  it('keyed rule', () => {
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([
      {
        key: 'key',
        rule
      }
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: {
          key: 'key',
          rule
        }
      }
    ])
  })

  it('validation behavior string + simple rule', () => {
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([['mock' as never, rule]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule
      }
    ])
  })

  it('validation behavior string + keyed rule', () => {
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([
      [
        'mock' as never,
        {
          key: 'key',
          rule
        }
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: {
          key: 'key',
          rule
        }
      }
    ])
  })

  it('validation behavior inline + simple rule', () => {
    const validationBehavior = jest.fn()
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([[validationBehavior, rule]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior,
        rule
      }
    ])
  })

  it('validation behavior inline + keyed rule', () => {
    const validationBehavior = jest.fn()
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([
      [
        validationBehavior,
        {
          key: 'key',
          rule
        }
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior,
        rule: {
          key: 'key',
          rule
        }
      }
    ])
  })

  it('simple rule + debounce', () => {
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([[rule, 100]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule,
        debounce: 100
      }
    ])
  })

  it('keyed rule + debounce', () => {
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([
      [
        {
          key: 'key',
          rule
        },
        100
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: {
          key: 'key',
          rule
        },
        debounce: 100
      }
    ])
  })

  it('validation behavior string + simple rule + debounce', () => {
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([['mock' as never, rule, 100]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule,
        debounce: 100
      }
    ])
  })

  it('validation behavior string + keyed rule + debounce', () => {
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([
      [
        'mock' as never,
        {
          key: 'key',
          rule
        },
        100
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior: expect.any(Function),
        rule: {
          key: 'key',
          rule
        },
        debounce: 100
      }
    ])
  })

  it('validation behavior inline + simple rule + debounce', () => {
    const validationBehavior = jest.fn()
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([[validationBehavior, rule, 100]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior,
        rule,
        debounce: 100
      }
    ])
  })

  it('validation behavior inline + keyed rule + debounce', () => {
    const validationBehavior = jest.fn()
    const rule = jest.fn()
    const ruleInfo = mapFieldRules([
      [
        validationBehavior,
        {
          key: 'key',
          rule
        },
        100
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        validationBehavior,
        rule: {
          key: 'key',
          rule
        },
        debounce: 100
      }
    ])
  })

  it('should throw error for invalid input', () => {
    const rule = jest.fn()

    expect(() => {
      // @ts-expect-error
      mapFieldRules([['invalid', rule]])
    }).toThrow()

    expect(() => {
      // @ts-expect-error
      mapFieldRules([[100, rule]])
    }).toThrow()
  })
})
