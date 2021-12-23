import * as nShared from '@validierung/shared'
import { isTransformedField } from './types'
import { Form } from '../form'

export function disposeForm(form: Form, deletedFormData: any) {
  for (const { value } of nShared.deepIterator(
    { box: deletedFormData },
    isTransformedField
  )) {
    if (isTransformedField(value)) {
      form.dispose(value.$uid)
    }
  }
}
