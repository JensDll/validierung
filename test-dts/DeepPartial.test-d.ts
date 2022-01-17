import { expectType } from 'tsd'

import { DeepPartial } from '@validierung/shared'

expectType<{
  a?: {
    b?: {
      c?: number
    }
  }
}>(
  {} as DeepPartial<{
    a: {
      b: {
        c: number
      }
    }
  }>
)

expectType<{
  a?: {
    bs?: {
      c?: string
    }[]
  }
}>(
  {} as DeepPartial<{
    a: {
      bs: {
        c: string
      }[]
    }
  }>
)

expectType<{
  a?: {
    bs?: [string]
  }
}>(
  {} as DeepPartial<{
    a: {
      bs: [string]
    }
  }>
)

expectType<{
  a?: {
    bs?: readonly [string]
  }
}>(
  {} as DeepPartial<{
    a: {
      bs: readonly [string]
    }
  }>
)

expectType<{
  a?(): void
}>(
  {} as DeepPartial<{
    a(): void
  }>
)
