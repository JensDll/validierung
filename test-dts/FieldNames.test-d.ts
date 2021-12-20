import { expectType } from 'tsd'

import { FieldNames, Field } from 'compose-validation'

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
