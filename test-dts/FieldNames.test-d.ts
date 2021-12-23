import { expectType } from 'tsd'

import { FieldNames, Field } from 'validierung'

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
