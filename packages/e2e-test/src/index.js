const { createValidation } = require('validierung')

createValidation({
  defaultValidationBehavior: 'foo',
  validationBehavior: {}
}).install()
