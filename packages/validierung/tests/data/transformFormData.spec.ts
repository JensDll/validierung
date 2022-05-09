import { vue2Reactive } from '@internal/shared'

import {
  transformFormData,
  mapFieldRules
} from '../../src/data/transformFormData'
import { createValidation } from '../../src/createValidation'
import { Form } from '../../src/form'
import type { RuleInformation } from '../../src/rules'

vi.mock('../../src/validationConfig')

test('should transform every field', () => {
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
  beforeEach(() => {
    createValidation({
      defaultValidationBehavior: 'mock' as never,
      validationBehavior: {
        mock: () => true
      }
    }).install()
  })

  test('simple rule', () => {
    const rule = vi.fn()
    const ruleInfo = mapFieldRules([rule])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        vbf: expect.any(Function),
        rule
      }
    ])
  })

  test('keyed rule', () => {
    const rule = vi.fn()
    const ruleInfo = mapFieldRules([
      {
        key: 'key',
        rule
      }
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        vbf: expect.any(Function),
        rule: {
          key: 'key',
          rule
        }
      }
    ])
  })

  test('validation behavior string + simple rule', () => {
    const rule = vi.fn()
    const ruleInfo = mapFieldRules([['mock' as never, rule]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        vbf: expect.any(Function),
        rule
      }
    ])
  })

  test('validation behavior string + keyed rule', () => {
    const rule = vi.fn()
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
        vbf: expect.any(Function),
        rule: {
          key: 'key',
          rule
        }
      }
    ])
  })

  test('validation behavior inline + simple rule', () => {
    const vbf = vi.fn()
    const rule = vi.fn()
    const ruleInfo = mapFieldRules([[vbf, rule]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        vbf,
        rule
      }
    ])
  })

  test('validation behavior inline + keyed rule', () => {
    const vbf = vi.fn()
    const rule = vi.fn()
    const ruleInfo = mapFieldRules([
      [
        vbf,
        {
          key: 'key',
          rule
        }
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        vbf,
        rule: {
          key: 'key',
          rule
        }
      }
    ])
  })

  test('simple rule + debounce', () => {
    const rule = vi.fn()
    const ruleInfo = mapFieldRules([[rule, 100]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        vbf: expect.any(Function),
        rule,
        debounce: 100
      }
    ])
  })

  test('keyed rule + debounce', () => {
    const rule = vi.fn()
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
        vbf: expect.any(Function),
        rule: {
          key: 'key',
          rule
        },
        debounce: 100
      }
    ])
  })

  test('validation behavior string + simple rule + debounce', () => {
    const rule = vi.fn()
    const ruleInfo = mapFieldRules([['mock' as never, rule, 100]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        vbf: expect.any(Function),
        rule,
        debounce: 100
      }
    ])
  })

  test('validation behavior string + keyed rule + debounce', () => {
    const rule = vi.fn()
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
        vbf: expect.any(Function),
        rule: {
          key: 'key',
          rule
        },
        debounce: 100
      }
    ])
  })

  test('validation behavior inline + simple rule + debounce', () => {
    const vbf = vi.fn()
    const rule = vi.fn()
    const ruleInfo = mapFieldRules([[vbf, rule, 100]])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        vbf,
        rule,
        debounce: 100
      }
    ])
  })

  test('validation behavior inline + keyed rule + debounce', () => {
    const vbf = vi.fn()
    const rule = vi.fn()
    const ruleInfo = mapFieldRules([
      [
        vbf,
        {
          key: 'key',
          rule
        },
        100
      ]
    ])

    expect(ruleInfo).toEqual<RuleInformation[]>([
      {
        vbf,
        rule: {
          key: 'key',
          rule
        },
        debounce: 100
      }
    ])
  })

  test('should throw error for invalid input', () => {
    const rule = vi.fn()

    expect(() => {
      // @ts-expect-error
      mapFieldRules([['invalid', rule]])
    }).toThrow('[validierung]')

    expect(() => {
      // @ts-expect-error
      mapFieldRules([[100, rule]])
    }).toThrow('[validierung]')
  })
})
