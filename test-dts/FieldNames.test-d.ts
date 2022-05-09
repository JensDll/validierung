import { expectType } from 'tsd'

import type { FieldNames, Field } from 'validierung'

expectType<'a' | 'c' | 'e'>(
  {} as FieldNames<{
    a: Field<string>
    b: {
      c: Field<string>
      d: {
        e: Field<string>
      }
    }[]
  }>
)

expectType<'a' | 'c' | 'e'>(
  {} as FieldNames<{
    a?: Field<string>
    b?: {
      c?: Field<string>
      d?: {
        e?: Field<string>
      }
    }[]
  }>
)

expectType<'a' | 'c' | 'e'>(
  {} as FieldNames<{
    readonly a?: Field<string>
    readonly b?: {
      readonly c?: Field<string>
      readonly d?: {
        readonly e?: Field<string>
      }
    }[]
  }>
)

expectType<'a'>({} as FieldNames<[{ a: Field<string> }]>)

expectType<'a'>({} as FieldNames<readonly [{ a: Field<string> }]>)

interface FormData {
  a: Field<string>
}

expectType<'a'>({} as FieldNames<FormData>)

expectType<'a'>(
  {} as FieldNames<{
    a: Field<string> | number
  }>
)

expectType<'a'>(
  {} as FieldNames<{
    a: Field<string> | number[]
  }>
)

expectType<'a' | 'b'>(
  {} as FieldNames<{
    a: Field<string> | number | { b: Field<string> }[]
  }>
)
