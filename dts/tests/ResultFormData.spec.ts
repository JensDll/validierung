import type { MaybeRef } from '@internal/shared'
import { expectType } from 'tsd'
import type { ResultFormData, Field } from 'validierung'

// With basic object
{
  type Actual = ResultFormData<{
    a: { $value: string }
  }>
  type Expected = {
    a: string
  }

  expectType<Actual>({} as Expected)
}

// With field part of union
{
  type Actual = ResultFormData<{
    a: { $value: string } | number | { a: string }
  }>
  type Expected = {
    a: string | number | { a: string }
  }

  expectType<Actual>({} as Expected)
}

// With tuple
{
  type Actual = ResultFormData<[{ $value: string }]>
  type Expected = [string]

  expectType<Actual>({} as Expected)
}

// With readonly tuple
{
  type Actual = ResultFormData<readonly [{ $value: string }]>
  type Expected = readonly [string]

  expectType<Actual>({} as Expected)
}

// With tuple (nested)
{
  type Actual = ResultFormData<readonly [{ a: { $value: string } }]>
  type Expected = readonly [{ a: string }]

  expectType<Actual>({} as Expected)
}

// Should discard extra properties
{
  type Actual = ResultFormData<{
    a: {
      $value: MaybeRef<string> | number
      extra: boolean
    }
  }>
  type Expected = {
    a: string | number
  }

  expectType<Actual>({} as Expected)
}

// Deeply nested with array
{
  type Actual = ResultFormData<{
    a: {
      bs: {
        c: {
          $value: MaybeRef<string>
        }
      }[]
    }
  }>
  type Expected = {
    a: {
      bs: {
        c: string
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}

// Should preserve undefined for optional properties
{
  type Actual = ResultFormData<{
    a?: {
      bs?: {
        c?:
          | {
              $value: MaybeRef<string>
            }
          | number
      }[]
    }
  }>
  type Expected = {
    a?: {
      bs?: {
        c?: string | number
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}

// Should work if passed an interface
{
  interface WithInterface {
    a?: {
      bs?: {
        c?: {
          $value: MaybeRef<string>
        }
      }[]
    }
  }
  type Actual = ResultFormData<WithInterface>
  type Expected = {
    a?: {
      bs?: {
        c?: string
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}

// All of the above should also work when using the Field type!
// The tests below are copy and pasted!

// With basic object
{
  type Actual = ResultFormData<{
    a: Field<string>
  }>
  type Expected = {
    a: string
  }

  expectType<Actual>({} as Expected)
}

// With field part of union
{
  type Actual = ResultFormData<{
    a: Field<string> | number | { a: string }
  }>
  type Expected = {
    a: string | number | { a: string }
  }

  expectType<Actual>({} as Expected)
}

// With tuple
{
  type Actual = ResultFormData<[Field<string>]>
  type Expected = [string]

  expectType<Actual>({} as Expected)
}

// With readonly tuple
{
  type Actual = ResultFormData<readonly [Field<string>]>
  type Expected = readonly [string]

  expectType<Actual>({} as Expected)
}

// With tuple (nested)
{
  type Actual = ResultFormData<readonly [{ a: Field<string> }]>
  type Expected = readonly [{ a: string }]

  expectType<Actual>({} as Expected)
}

// Should discard extra properties
{
  type Actual = ResultFormData<{
    a: Field<string | number, { extra: boolean }>
  }>
  type Expected = {
    a: string | number
  }

  expectType<Actual>({} as Expected)
}

// Deeply nested with array
{
  type Actual = ResultFormData<{
    a: {
      bs: {
        c: Field<string>
      }[]
    }
  }>
  type Expected = {
    a: {
      bs: {
        c: string
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}

// Should preserve undefined for optional properties
{
  type Actual = ResultFormData<{
    a?: {
      bs?: {
        c?: Field<string> | number
      }[]
    }
  }>
  type Expected = {
    a?: {
      bs?: {
        c?: string | number
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}

// Should work if passed an interface
{
  interface WithInterface {
    a?: {
      bs?: {
        c?: Field<string>
      }[]
    }
  }
  type Actual = ResultFormData<WithInterface>
  type Expected = {
    a?: {
      bs?: {
        c?: string
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}
