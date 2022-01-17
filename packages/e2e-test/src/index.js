const { createValidation, useValidation } = require('validierung')

window.testCreateValidation = () => {
  createValidation({
    defaultValidationBehavior: 'foo',
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
