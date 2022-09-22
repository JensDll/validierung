import type { MaybeRef } from '@internal/shared'
import { expectType } from 'tsd'
import type { TransformFormData, TransformedField, Field } from 'validierung'

// With basic object
{
  type Actual = TransformFormData<{
    a: { $value: string }
  }>
  type Expected = {
    a: TransformedField<string>
  }

  expectType<Actual>({} as Expected)
}

// With field part of union
{
  type Actual = TransformFormData<{
    a: { $value: string } | number | { a: string }
  }>
  type Expected = {
    a: TransformedField<string> | number | { a: string }
  }

  expectType<Actual>({} as Expected)
}

// With tuple
{
  type Actual = TransformFormData<[{ $value: string }]>
  type Expected = [TransformedField<string>]

  expectType<Actual>({} as Expected)
}

// With readonly tuple
{
  type Actual = TransformFormData<readonly [{ $value: string }]>
  type Expected = readonly [TransformedField<string>]

  expectType<Actual>({} as Expected)
}

// With tuple (nested)
{
  type Actual = TransformFormData<readonly [{ a: { $value: string } }]>
  type Expected = readonly [{ a: TransformedField<string> }]

  expectType<Actual>({} as Expected)
}

// Should preserve extra properties
{
  type Actual = TransformFormData<{
    a: {
      $value: MaybeRef<string> | number
      extra: boolean
    }
  }>
  type Expected = {
    a: TransformedField<string | number, { extra: boolean }>
  }

  expectType<Actual>({} as Expected)
}

// Deeply nested with array
{
  type Actual = TransformFormData<{
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
        c: TransformedField<string>
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}

// Should preserve undefined for optional properties
{
  type Actual = TransformFormData<{
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
        c?: TransformedField<string> | number
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
  type Actual = TransformFormData<WithInterface>
  type Expected = {
    a?: {
      bs?: {
        c?: TransformedField<string>
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}

// All of the above should also work when using the Field type!
// The tests below are copy and pasted!

// With basic object
{
  type Actual = TransformFormData<{
    a: Field<string>
  }>
  type Expected = {
    a: TransformedField<string>
  }

  expectType<Actual>({} as Expected)
}

// With field part of union
{
  type Actual = TransformFormData<{
    a: Field<string> | number | { a: string }
  }>
  type Expected = {
    a: TransformedField<string> | number | { a: string }
  }

  expectType<Actual>({} as Expected)
}

// With tuple
{
  type Actual = TransformFormData<[Field<string>]>
  type Expected = [TransformedField<string>]

  expectType<Actual>({} as Expected)
}

// With readonly tuple
{
  type Actual = TransformFormData<readonly [Field<string>]>
  type Expected = readonly [TransformedField<string>]

  expectType<Actual>({} as Expected)
}

// With tuple (nested)
{
  type Actual = TransformFormData<readonly [{ a: Field<string> }]>
  type Expected = readonly [{ a: TransformedField<string> }]

  expectType<Actual>({} as Expected)
}

// Should preserve extra properties
{
  type Actual = TransformFormData<{
    a: Field<string | number, { extra: boolean }>
  }>
  type Expected = {
    a: TransformedField<string | number, { extra: boolean }>
  }

  expectType<Actual>({} as Expected)
}

// Deeply nested with array
{
  type Actual = TransformFormData<{
    a: {
      bs: {
        c: Field<string>
      }[]
    }
  }>
  type Expected = {
    a: {
      bs: {
        c: TransformedField<string>
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}

// Should preserve undefined for optional properties
{
  type Actual = TransformFormData<{
    a?: {
      bs?: {
        c?: Field<string> | number
      }[]
    }
  }>
  type Expected = {
    a?: {
      bs?: {
        c?: TransformedField<string> | number
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
  type Actual = TransformFormData<WithInterface>
  type Expected = {
    a?: {
      bs?: {
        c?: TransformedField<string>
      }[]
    }
  }

  expectType<Actual>({} as Expected)
}
