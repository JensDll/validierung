import * as nShared from '@validierung/shared'
import { isTransformedField } from './types'
import { Form } from '../form'

export function disposeForm(form: Form, deletedFormData: nShared.AnyObject) {
  for (const value of Object.values(deletedFormData)) {
    if (isTransformedField(value)) {
      form.dispose(value.$uid)
      continue
    }

    if (nShared.isObject(value)) {
      disposeForm(form, value)
    }
  }
}
