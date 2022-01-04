import type { Ref } from 'vue-demi'

export type AnyObject = Record<PropertyKey, any>

export type AnyFunction = (...args: any[]) => any

export type DeepIndex<
  T,
  Keys extends readonly PropertyKey[],
  R = unknown
> = Keys extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends readonly PropertyKey[]
      ? DeepIndex<T[First], Rest>
      : R
    : R
  : T

export type Tuple<T, N extends number> = number extends N
  ? T[]
  : TupleImpl<T, N, []>

type TupleImpl<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : TupleImpl<T, N, [T, ...R]>

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

export type DeepPartial<T extends object> = T extends readonly any[]
  ? {
      [K in keyof T]: DeepPartialImpl<T[K]>
    }
  : {
      [K in keyof T]?: DeepPartialImpl<T[K]> | undefined
    }

type DeepPartialImpl<T> = T extends object ? DeepPartial<T> : T
