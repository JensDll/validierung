import { unref } from 'vue-demi'

import * as nShared from '@validierung/shared'
import { isTransformedField } from './types'

function getResultFormDataImpl(
  formData: nShared.AnyRecord,
  resultFormData: nShared.AnyRecord,
  path: string[],
  predicate: ValidateFieldsPredicate
) {
  for (const [key, value] of Object.entries(formData)) {
    const isTransformedFieldResult = isTransformedField(value)
    const unpackedValue = isTransformedFieldResult
      ? nShared.deepCopy(value.$value)
      : unref(value)

    if (predicate({ key, value: unpackedValue, path })) {
      if (nShared.isArray(resultFormData)) {
        resultFormData.push(unpackedValue)
      } else {
        resultFormData[key] = unpackedValue
      }
    } else {
      continue
    }

    if (isTransformedFieldResult) {
      continue
    }

    if (nShared.isObject(value)) {
      resultFormData[key] = nShared.isArray(value) ? [] : {}
      getResultFormDataImpl(
        value,
        resultFormData[key],
        [...path, key],
        predicate
      )
    }
  }
}

export function getResultFormData(
  transformedFormData: nShared.AnyRecord,
  predicate: ValidateFieldsPredicate = () => true
): any {
  const resultFormData = {}
  getResultFormDataImpl(transformedFormData, resultFormData, [], predicate)
  return resultFormData
}

export type ValidateFieldsPredicateParameter = {
  key: string
  value: any
  path: string[]
}

export type ValidateFieldsPredicate = (
  value: ValidateFieldsPredicateParameter
) => boolean
