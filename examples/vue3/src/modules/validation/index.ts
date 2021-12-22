import { createValidation } from 'validierung'

export const validation = createValidation({
  defaultValidationBehavior: 'lazier',
  validationBehavior: {
    change: ({ force }) => !force,
    lazy: ({ touched }) => touched,
    lazier: ({ force, touched, submit, hasError }) =>
      force || submit || (touched && hasError),
    submit: ({ submit, hasError }) => submit || hasError
  }
})
