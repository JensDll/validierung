import { expectType } from 'tsd'

import { MaybeRef } from '@validierung/shared'
import { ResultFormData } from 'validierung'

expectType<
  ResultFormData<{
    a: { $value: string }
  }>
>({} as { a: string })

expectType<
  ResultFormData<{
    a: { $value: MaybeRef<string> }
  }>
>({} as { a: string })

expectType<
  ResultFormData<{
    a: { b: { $value: MaybeRef<string> } }
  }>
>({} as { a: { b: string } })

expectType<
  ResultFormData<{
    a: {
      b: {
        c: {
          $value: MaybeRef<string>
        }[]
      }
    }
  }>
>(
  {} as {
    a: {
      b: {
        c: string[]
      }
    }
  }
)

expectType<
  ResultFormData<{
    a?: {
      b?: {
        c?: {
          $value: MaybeRef<string>
        }[]
      }
    }
  }>
>(
  {} as {
    a?: {
      b?: {
        c?: string[]
      }
    }
  }
)
