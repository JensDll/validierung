import { createValidation } from 'compose-validation'

export const validation = createValidation({
  defaultValidationBehavior: 'lazy',
  validationBehavior: {
    change(info) {
      return !info.force
    },
    lazy(info) {}
  }
})
