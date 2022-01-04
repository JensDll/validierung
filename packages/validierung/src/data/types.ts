import { UnwrapRef, Ref } from 'vue-demi'

import * as nShared from '@validierung/shared'
import { FieldRule } from '../rules'

export const isField = (value: unknown): value is Field<unknown> =>
  nShared.isRecord(value) ? '$value' in value : false

export const isTransformedField = (
  value: unknown
): value is TransformedField<unknown> =>
  nShared.isRecord(value) ? '$uid' in value && '$value' in value : false

export type Field<T, E extends object = {}> = {
  /**
   * The field's default value.
   */
  $value: nShared.MaybeRef<T>
  /**
   * Rules to use for validation.
   */
  $rules?: FieldRule<T>[]
} & E

export type ValidateOptions = {
  /**
   * Set the field touched when called.
   *
   * @default true
   */
  setTouched?: boolean
  /**
   * Validate with the `force` flag set.
   *
   * @default true
   */
  force?: boolean
}

export type TransformedField<T, E extends object = {}> = {
  /**
   * The unique id of this field.
   */
  $uid: number
  /**
   * The current field's value.
   */
  $value: T
  /**
   * A list of validation error messages.
   */
  $errors: string[]
  /**
   * The error status of this field.
   */
  $hasError: boolean
  /**
   * `True` while this field has any pending rules.
   */
  $validating: boolean
  /**
   * `True` if the field is touched. In most cases,
   * this value should be set together with the `blur` event.
   * Either through `$validate` or manually.
   */
  $touched: boolean
  /**
   * `True` if the `$value` of this field has changed at least once.
   */
  $dirty: boolean
  /**
   * Validate this field.
   *
   * @param options - Validate options to use
   * @default
   * ```
   * { setTouched: true, force: true }
   * ```
   */
  $validate(options?: ValidateOptions): Promise<void>
} & UnwrapRef<E>

/**
 * Unwrap the `$value` property of all fields in `FormData`.
 */
export type ResultFormData<FormData> = {
  [K in keyof FormData]: ResultFormDataImpl<FormData[K]>
}

type ResultFormDataImpl<T> = T extends {
  $value: infer V
}
  ? UnwrapRef<Exclude<V, Ref>>
  : T extends object
  ? ResultFormData<T>
  : T

/**
 * Receive the name of every field in `FormData` as a union of strings.
 */
export type FieldNames<FormData extends object> = FieldNamesImpl<
  FormData,
  never
>

type FieldNamesImpl<FormData, K> =
  nShared.ExcludePrimitives<FormData> extends never
    ? never
    : FormData extends { $value: any }
    ? K
    : FormData extends readonly (infer A)[]
    ? FieldNamesImpl<A, K>
    : {
        [K in keyof FormData]-?: nShared.ExcludePrimitives<
          FormData[K]
        > extends {
          $value: any
        }
          ? K
          : FieldNamesImpl<nShared.ExcludePrimitives<FormData[K]>, K>
      }[keyof FormData]

/**
 * Transforms every field in `FormData` into transformed fields.
 */
export type TransformFormData<FormData> = {
  [K in keyof FormData]: TransformFormDataImpl<FormData[K]>
}

type TransformFormDataImpl<T> = T extends {
  $value: infer V
}
  ? TransformedField<UnwrapRef<Exclude<V, Ref>>, Omit<T, '$value' | '$rules'>>
  : T extends object
  ? TransformFormData<T>
  : T
