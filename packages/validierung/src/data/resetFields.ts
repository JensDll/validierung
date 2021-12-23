import * as nShared from '@validierung/shared'
import { Form } from '../form'
import { isTransformedField } from './types'

export function resetFields(
  form: Form,
  data: nShared.AnyRecord,
  transformedFormData: nShared.AnyRecord
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
