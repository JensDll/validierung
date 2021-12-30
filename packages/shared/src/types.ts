import type { Ref } from 'vue-demi'

export const isDefined = <T>(x: T | null | undefined): x is T =>
  x !== null && x !== undefined

export const isRecord = (x: unknown): x is AnyObject =>
  typeof x === 'object' && x !== null && !Array.isArray(x)

export const isArray = (x: unknown): x is any[] => Array.isArray(x)

export const isObject = (x: unknown): x is AnyObject =>
  typeof x === 'object' && x !== null

export type AnyObject = Record<PropertyKey, any>

export type AnyFunction = (...args: any[]) => any

export type DeepIndex<
  T,
  Ks extends readonly PropertyKey[],
  R = unknown
> = Ks extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends readonly PropertyKey[]
      ? DeepIndex<T[First], Rest>
      : R
    : R
  : T

type _Tuple<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _Tuple<T, N, [T, ...R]>
export type Tuple<T, N extends number> = number extends N
  ? T[]
  : _Tuple<T, N, []>

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K> &
  (T extends (...args: any[]) => any
    ? { (...args: Parameters<T>): ReturnType<T> }
    : unknown)

export type MaybeRef<T> = T extends Ref<infer V> ? T | V : Ref<T> | T

export type ExcludePrimitives<T> = T extends AnyFunction
  ? never
  : T extends object
  ? T
  : never
