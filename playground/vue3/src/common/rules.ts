import type { SimpleRule } from 'validierung'

import type { Lengthy } from './types'

export const required = (msg: string) => (value: unknown) => !value && msg

export const min = (min: number) => (msg: string) => (value: Lengthy) =>
  value.length >= min || msg

export const max = (max: number) => (msg: string) => (value: Lengthy) =>
  value.length <= max || msg

export const minMax =
  (min: number, max: number) => (msg: string) => (value: Lengthy) =>
    (min <= value.length && value.length <= max) || msg

export const email = (msg: string) => (value: string) =>
  /\S+@\S+\.\S+/.test(value) || msg

export const equal =
  (msg: string) =>
  (...values: unknown[]) =>
    values.every(value => value === values[0]) || msg

export const inTheFuture =
  (message: string | symbol): SimpleRule<string> =>
  startDate => {
    const now = new Date().toLocaleDateString('en-CA')

    if (startDate && startDate.length <= now.length && startDate < now) {
      return message
    }
  }
