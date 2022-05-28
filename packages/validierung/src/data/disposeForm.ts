import * as nShared from '@internal/shared'
import type { AnyObject } from '@internal/shared'
import { isTransformedField } from './types'
import type { Form } from '../form'

export function disposeForm(form: Form, deletedFormData: AnyObject) {
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
