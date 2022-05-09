import { unref } from 'vue-demi'

import * as nShared from '@internal/shared'
import { isTransformedField } from './types'

function getResultFormDataImpl(
  formData: nShared.AnyObject,
  resultFormData: nShared.AnyObject,
  path: string[],
  predicate: ValidateFieldsPredicate
) {
  let arrayIndexOffset = 0

  for (const [key, value] of Object.entries(formData)) {
    const nextKey = nShared.isArray(formData) ? +key - arrayIndexOffset : key

    const isTransformedFieldResult = isTransformedField(value)
    const unpackedValue = isTransformedFieldResult
      ? nShared.deepCopy(value.$value)
      : unref(value)

    if (predicate({ key, value: unpackedValue, path })) {
      resultFormData[nextKey] = unpackedValue
    } else {
      ++arrayIndexOffset
      continue
    }

    if (isTransformedFieldResult) {
      continue
    }

    if (nShared.isObject(value)) {
      resultFormData[nextKey] = nShared.isArray(value) ? [] : {}
      getResultFormDataImpl(
        value,
        resultFormData[nextKey],
        [...path, key],
        predicate
      )
    }
  }
}

export function getResultFormData(
  transformedFormData: nShared.AnyObject,
  predicate: ValidateFieldsPredicate = () => true
): any {
  const resultFormData = nShared.isArray(transformedFormData) ? [] : {}
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
