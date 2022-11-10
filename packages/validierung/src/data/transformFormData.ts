import * as nShared from '@internal/shared'
import type { AnyObject } from '@internal/shared'
import type { ComputedRef, Ref } from 'vue-demi'

import {
  isField,
  type Field,
  type TransformedField
} from '~validierung/data/types'
import type { Form } from '~validierung/form'
import type { FieldRule, RuleInformation } from '~validierung/rules'
import { validationConfig } from '~validierung/validationConfig'

export function mapFieldRules(
  fieldRules: FieldRule<unknown>[]
): RuleInformation[] {
  const defaultVbf = validationConfig.getDefaultVbf()

  // @ts-expect-error TypeScript is confused because of the __DEV__ branch at the end
  return fieldRules.map<RuleInformation>(fieldRule => {
    if (typeof fieldRule === 'function') {
      return {
        vbf: defaultVbf,
        rule: fieldRule
      }
    }

    if (!nShared.isArray(fieldRule)) {
      return {
        vbf: defaultVbf,
        rule: fieldRule
      }
    }

    const [first, second, third] = fieldRule

    if (typeof second === 'number') {
      return {
        vbf: defaultVbf,
        rule: first as any,
        debounce: second
      }
    }

    if (typeof first === 'function') {
      return {
        vbf: first,
        rule: second,
        debounce: third
      }
    }

    const vbf = validationConfig.vbfMap.get(first as never)

    if (vbf !== undefined) {
      return { vbf, rule: second, debounce: third }
    }

    if (__DEV__) {
      throw new Error(
        `[validierung] Validation behavior with name '${first}' does not exist. Valid values are: "${[
          ...validationConfig.vbfMap.keys()
        ].join(', ')}"`
      )
    }
  })
}

export function registerField(
  form: Form,
  name: string,
  field: Field<unknown>
): {
  [K in keyof TransformedField<unknown>]:
    | TransformedField<unknown>[K]
    | ComputedRef<TransformedField<unknown>[K]>
    | Ref<TransformedField<unknown>[K]>
} {
  const { $value, $rules, ...fieldExtraProperties } = field
  const rules = $rules ? mapFieldRules($rules) : []
  const uid = nShared.uid()
  const formField = form.registerField(uid, name, $value, rules)

  return {
    ...fieldExtraProperties,
    $uid: uid,
    $value: formField.modelValue,
    $errors: formField.errors,
    $hasError: formField.hasError,
    $validating: formField.validating,
    $dirty: formField.dirty,
    $touched: formField.touched,
    async $validate({ setTouched, force } = {}) {
      setTouched ??= true
      force ??= true

      if (setTouched) {
        formField.touched.value = true
      }

      await form.validate(uid, force)
    }
  }
}

export function transformFormData(form: Form, formData: AnyObject) {
  for (const [key, value] of Object.entries(formData)) {
    if (isField(value)) {
      const transformedField = registerField(form, key, value)
      formData[key] = transformedField
      continue
    }

    if (nShared.isObject(value)) {
      transformFormData(form, value)
    }
  }
}
