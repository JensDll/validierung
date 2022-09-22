import * as nShared from '@internal/shared'
import type { AnyObject } from '@internal/shared'

import { isTransformedField } from '~validierung/data/types'
import type { Form } from '~validierung/form'

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
