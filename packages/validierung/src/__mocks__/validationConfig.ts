export const ValidationConfig = jest.fn<any, any>().mockImplementation(() => {
  const { ValidationConfig } = jest.requireActual('../validationConfig')

  class MockValidationConfig extends ValidationConfig {}

  return new MockValidationConfig()
})

export const validationConfig = new ValidationConfig()
