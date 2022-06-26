import type { SimpleRule, KeyedRule } from 'validierung'

import type { Lengthy } from './types'

type RuleMessage = string | symbol

export const rules = {
  required:
    (message: RuleMessage): SimpleRule =>
    value =>
      !value && message,
  min:
    (min: number) =>
    (message: RuleMessage): SimpleRule<Lengthy> =>
    value =>
      value.length >= min || message,
  max:
    (max: number) =>
    (message: RuleMessage): SimpleRule<Lengthy> =>
    value =>
      value.length <= max || message,
  minMax:
    (min: number, max: number) =>
    (message: RuleMessage): SimpleRule<Lengthy> =>
    value =>
      (min <= value.length && value.length <= max) || message,
  email:
    (message: RuleMessage): SimpleRule<string> =>
    value =>
      /\S+@\S+\.\S+/.test(value) || message,
  equal:
    (message: RuleMessage): KeyedRule =>
    (...values) =>
      values.every(value => value === values[0]) || message,
  inTheFuture:
    (message: RuleMessage): SimpleRule<string> =>
    startDate => {
      const now = new Date().toLocaleDateString('en-CA')

      if (startDate && startDate.length <= now.length && startDate < now) {
        return message
      }
    }
}
