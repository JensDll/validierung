import { isSimpleRule } from '../src/rules'
import { isField, isTransformedField } from '../src/data'

describe('isField', () => {
  test('field -> true', () => {
    expect(
      isField({
        $value: '',
        $rules: []
      })
    ).toBe(true)
  })
})

describe('isTransformedField', () => {
  test('transformedField -> true', () => {
    expect(
      isTransformedField({
        $uid: 1,
        $value: '',
        $errors: []
      })
    ).toBe(true)
  })
})

describe('isSimpleRule', () => {
  test('rule with key -> false', () => {
    const keyedRule = {
      key: ''
    }

    expect(isSimpleRule(keyedRule)).toBe(false)
  })

  test('rule with key -> false', () => {
    const keyedRule = {
      key: '',
      rule: () => {}
    }

    expect(isSimpleRule(keyedRule)).toBe(false)
  })

  test('rule without key -> true', () => {
    const simpleRule = () => {}

    expect(isSimpleRule(simpleRule)).toBe(true)
  })
})
