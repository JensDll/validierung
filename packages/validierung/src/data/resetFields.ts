import * as nShared from '@internal/shared'
import type { AnyObject } from '@internal/shared'
import type { Form } from '../form'
import { isTransformedField } from './types'

export function resetFields(
  form: Form,
  data: AnyObject,
  transformedFormData: AnyObject
) {
  Object.entries(data).forEach(([key, value]) => {
    const transformedValue = transformedFormData[key]

    if (isTransformedField(transformedValue)) {
      const field = form.getField(transformedValue.$uid)!
      field.reset(value)
      return
    }

    if (nShared.isObject(value)) {
      resetFields(form, value, transformedFormData[key])
    }
  })
}
