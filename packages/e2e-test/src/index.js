const { createValidation, useValidation } = require('validierung')

window.testCreateValidation = () => {
  createValidation({
    defaultValidationBehavior: 'invalid',
    validationBehavior: {}
  }).install()
}

window.testUseValidation = () => {
  useValidation({
    field: {
      $value: '',
      $rules: [['invalid', () => {}]]
    }
  })
}
