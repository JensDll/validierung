import type { Ref } from 'vue-demi'

export const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined

export const isRecord = (value: unknown): value is AnyObject =>
  isObject(value) && !Array.isArray(value)

export const isArray = (value: unknown): value is any[] => Array.isArray(value)

export const isObject = (value: unknown): value is AnyObject =>
  typeof value === 'object' && value !== null && !(value instanceof File)

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
