import { UnwrapRef } from 'vue-demi'

import {
  ValidationBehavior,
  ValidationBehaviorFunction
} from './validationBehavior'

export const isSimpleRule = (
  rule: SimpleRule | RuleWithKey
): rule is SimpleRule => typeof rule === 'function'

export const unpackRule = (
  rule: SimpleRule | RuleWithKey
): SimpleRule | undefined => (isSimpleRule(rule) ? rule : rule.rule)

export type SimpleRule<Param = any> = (...value: Param[]) => any
export type KeyedRule<Params extends readonly any[] = any[]> = (
  ...values: [...Params]
) => any
export type RuleWithKey<T extends readonly any[] = any[]> = {
  key: string
  rule?: KeyedRule<T>
}

export type FieldSimpleRule<Param = any> =
  | SimpleRule<Param>
  | [
      validationBehavior: ValidationBehavior,
      rule: SimpleRule<Param>,
      debounce?: number
    ]
  | [rule: SimpleRule<Param>, debounce: number]

export type FieldRuleWithKey<Params extends readonly any[]> =
  | RuleWithKey<Params>
  | [
      validationBehavior: ValidationBehavior,
      rule: RuleWithKey<Params>,
      debounce?: number
    ]
  | [rule: RuleWithKey<Params>, debounce: number]

export type FieldRule<
  SimpleParam,
  KeyedParams extends readonly any[] = any[]
> = FieldSimpleRule<UnwrapRef<SimpleParam>> | FieldRuleWithKey<KeyedParams>

export type RuleInformation = {
  validationBehavior: ValidationBehaviorFunction
  rule: SimpleRule | RuleWithKey
  debounce?: number
}
