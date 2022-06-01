import type { SimpleRule, KeyedRule } from 'validierung'

import type { Lengthy } from './types'

export const rules = {
  required:
    (msg: string): SimpleRule =>
    x =>
      !x && msg,
  min:
    (min: number) =>
    (msg: string): SimpleRule<Lengthy> =>
    x =>
      x.length >= min || msg,
  max:
    (max: number) =>
    (msg: string): SimpleRule<Lengthy> =>
    x =>
      x.length <= max || msg,
  minMax:
    (min: number, max: number) =>
    (msg: string): SimpleRule<Lengthy> =>
    x =>
      (min <= x.length && x.length <= max) || msg,
  email:
    (msg: string): SimpleRule<string> =>
    x =>
      /\S+@\S+\.\S+/.test(x) || msg,
  equal:
    (msg: string): KeyedRule =>
    (...xs) =>
      xs.every(x => x === xs[0]) || msg,
  inTheFuture:
    (msg: string): SimpleRule<string> =>
    startDate => {
      const now = new Date().toLocaleDateString('en-CA')

      if (startDate && startDate.length <= now.length && startDate < now) {
        return msg
      }
    }
}
