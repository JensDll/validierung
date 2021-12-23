import { UnwrapRef, Ref } from 'vue-demi'

import * as nShared from '@validierung/shared'
import { FieldRule } from '../rules'

export const isField = (value: unknown): value is Field<unknown> =>
  nShared.isRecord(value) ? '$value' in value : false

export const isTransformedField = (
  value: unknown
): value is TransformedField<unknown> =>
  nShared.isRecord(value) ? '$uid' in value && '$value' in value : false

export type Field<
  TValue,
  TExtra extends Record<string, unknown> = Record<string, never>
> = {
  /**
   * The field's default value.
   */
  $value: nShared.MaybeRef<TValue>
  /**
   * Rules to use for validation.
   */
  $rules?: FieldRule<TValue>[]
} & (TExtra extends Record<string, never> ? unknown : TExtra)

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

export type TransformedField<
  TValue,
  TExtra extends Record<string, unknown> = Record<string, never>
> = {
  /**
   * The unique id of this field.
   */
  $uid: number
  /**
   * The current field's value.
   */
  $value: TValue
  /**
   * A list of validation error messages.
   */
  $errors: string[]
  /**
   * The error status of this field.
   */
  $hasError: boolean
  /**
   * The error status of this field one for each rule.
   */
  $hasErrors: boolean[]
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
} & (TExtra extends Record<string, never> ? unknown : UnwrapRef<TExtra>)

export type OnlyField<T> = T extends { $value: infer TValue }
  ? { $value: TValue }
  : never

/**
 * Unwrap the `$value` property of all fields in `FormData`.
 */
export type ResultFormData<FormData> = FormData extends any
  ? {
      [K in keyof FormData]: Exclude<FormData[K], undefined> extends {
        $value: infer TValue
      }
        ? UnwrapRef<Exclude<TValue, Ref>>
        : Exclude<FormData[K], undefined> extends object
        ? ResultFormData<FormData[K]>
        : FormData[K]
    }
  : never

type FieldNamesImpl<FormData, K> = nShared.OnlyObject<FormData> extends never
  ? never
  : FormData extends { $value: any }
  ? K
  : FormData extends (infer TArray)[]
  ? FieldNamesImpl<TArray, K>
  : {
      [K in keyof FormData]-?: nShared.OnlyObject<FormData[K]> extends {
        $value: any
      }
        ? K
        : FieldNamesImpl<nShared.OnlyObject<FormData[K]>, K>
    }[keyof FormData]

/**
 * Receive the name of every field in `FormData` as a union of strings.
 */
export type FieldNames<FormData extends object> = FieldNamesImpl<
  FormData,
  never
>

/**
 * Transforms every field in `FormData` into transformed fields.
 */
export type TransformFormData<FormData> = FormData extends any
  ? {
      [K in keyof FormData]: Exclude<FormData[K], undefined> extends {
        $value: infer TValue
      }
        ? TransformedField<
            UnwrapRef<Exclude<TValue, Ref>>,
            Omit<Exclude<FormData[K], undefined>, '$value' | '$rules'>
          >
        : Exclude<FormData[K], undefined> extends object
        ? TransformFormData<FormData[K]>
        : FormData[K]
    }
  : never
