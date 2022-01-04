import { isSimpleRule } from '../src/rules'
import { isField, isTransformedField } from '../src/data'

describe('isField', () => {
  it('field -> true', () => {
    expect(
      isField({
        $value: '',
        $rules: []
      })
    ).toBe(true)
  })
})

describe('isTransformedField', () => {
  it('transformedField -> true', () => {
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
  it('rule with key -> false', () => {
    const keyedRule = {
      key: ''
    }

    expect(isSimpleRule(keyedRule)).toBe(false)
  })

  it('rule with key -> false', () => {
    const keyedRule = {
      key: '',
      rule: () => {}
    }

    expect(isSimpleRule(keyedRule)).toBe(false)
  })

  it('rule without key -> true', () => {
    const simpleRule = () => {}

    expect(isSimpleRule(simpleRule)).toBe(true)
  })
})
