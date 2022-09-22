import type { UnwrapRef } from 'vue-demi'

import type {
  ValidationBehavior,
  ValidationBehaviorFunction
} from '~validierung/validationBehavior'

export const isSimpleRule = (
  rule: SimpleRule | RuleWithKey
): rule is SimpleRule => typeof rule === 'function'

export const unpackRule = (
  rule: SimpleRule | RuleWithKey
): [rule: SimpleRule | undefined, key: string | undefined] =>
  isSimpleRule(rule) ? [rule, undefined] : [rule.rule, rule.key]

export type SimpleRule<TParam = any> = (value: TParam) => any
export type KeyedRule<TParams extends readonly any[] = any[]> = (
  ...values: [...TParams]
) => any
export type RuleWithKey<T extends readonly any[] = any[]> = {
  key: string
  rule?: KeyedRule<T>
}

export type FieldSimpleRule<TParam = any> =
  | SimpleRule<TParam>
  | [
      validationBehavior: ValidationBehavior,
      rule: SimpleRule<TParam>,
      debounce?: number
    ]
  | [rule: SimpleRule<TParam>, debounce: number]

export type FieldKeyedRule<TParams extends readonly any[]> =
  | RuleWithKey<TParams>
  | [
      validationBehavior: ValidationBehavior,
      rule: RuleWithKey<TParams>,
      debounce?: number
    ]
  | [rule: RuleWithKey<TParams>, debounce: number]

export type FieldRule<
  TSimpleParams,
  TKeyedParams extends readonly any[] = any[]
> = FieldSimpleRule<UnwrapRef<TSimpleParams>> | FieldKeyedRule<TKeyedParams>

export type RuleInformation = {
  vbf: ValidationBehaviorFunction
  rule: SimpleRule | RuleWithKey
  debounce?: number
}
