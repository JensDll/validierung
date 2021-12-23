import { ComputedRef, Ref } from 'vue-demi'

import * as nShared from '@validierung/shared'
import { FieldRule, RuleInformation } from '../rules'
import { validationConfig } from '../validationConfig'
import { Form } from '../form'
import { Field, isField, TransformedField } from './types'

export function mapFieldRules(
  fieldRules: FieldRule<unknown>[]
): RuleInformation[] {
  const defaultValidationBehavior =
    validationConfig.getDefaultValidationBehavior()

  return fieldRules.map<RuleInformation>(fieldRule => {
    if (typeof fieldRule === 'function') {
      return {
        validationBehavior: defaultValidationBehavior,
        rule: fieldRule
      }
    }

    if (Array.isArray(fieldRule)) {
      const [first, second, third] = fieldRule

      if (typeof second === 'number') {
        return {
          validationBehavior: defaultValidationBehavior,
          rule: first as any,
          debounce: second
        }
      }

      if (typeof first === 'function') {
        return {
          validationBehavior: first,
          rule: second,
          debounce: third
        }
      }

      const validationBehavior = validationConfig.validationBehavior.get(
        first as any
      )

      if (validationBehavior !== undefined) {
        return { validationBehavior, rule: second, debounce: third }
      } else {
        throw new Error(
          `[useValidation] Validation behavior with name '${first}' does not exist. Valid values are: ${[
            ...validationConfig.validationBehavior.keys()
          ].join(', ')}`
        )
      }
    } else {
      return {
        validationBehavior: defaultValidationBehavior,
        rule: fieldRule
      }
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
    $hasErrors: formField.hasErrors,
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

export function transformFormData(form: Form, formData: any) {
  for (const { key, value, parent } of nShared.deepIterator(
    formData,
    isField
  )) {
    if (isField(value)) {
      const transformedField = registerField(form, key, value)
      parent[key] = transformedField
    }
  }
}
