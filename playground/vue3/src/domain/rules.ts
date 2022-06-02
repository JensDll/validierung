import type { SimpleRule, KeyedRule } from 'validierung'

import type { Lengthy } from './types'

export const rules = {
  required:
    (message: string): SimpleRule =>
    value =>
      !value && message,
  min:
    (min: number) =>
    (message: string): SimpleRule<Lengthy> =>
    value =>
      value.length >= min || message,
  max:
    (max: number) =>
    (message: string): SimpleRule<Lengthy> =>
    value =>
      value.length <= max || message,
  minMax:
    (min: number, max: number) =>
    (message: string): SimpleRule<Lengthy> =>
    value =>
      (min <= value.length && value.length <= max) || message,
  email:
    (message: string): SimpleRule<string> =>
    value =>
      /\S+@\S+\.\S+/.test(value) || message,
  equal:
    (message: string): KeyedRule =>
    (...values) =>
      values.every(value => value === values[0]) || message,
  inTheFuture:
    (message: string): SimpleRule<string> =>
    startDate => {
      const now = new Date().toLocaleDateString('en-CA')

      if (startDate && startDate.length <= now.length && startDate < now) {
        return message
      }
    }
}
